<template>
  <div ref="rootRef" class="hero-particle-field" aria-hidden="true">
    <canvas ref="canvasRef" class="hero-particle-canvas" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { isDark } = useTheme()

const rootRef = ref(null)
const canvasRef = ref(null)

/** @type {Particle[]} */
let particles = []
let rafId = 0
let lastTs = 0
let running = false
let visible = true
let pageVisible = true
let reducedMotion = false
let width = 0
let height = 0
let dpr = 1
let spacing = 100
let pointerX = 0
let pointerY = 0
let pointerActive = false
/** ms since pointer left the hero (for delayed idle breath) */
let idleSinceLeave = 0
let idleArmed = true
let idleT = 0
/** one-shot first-visit ripple */
let rippleX = 0
let rippleY = 0
let rippleAge = -1
let rippleDone = false
let resizeObserver = null
let intersectionObserver = null
let mediaQuery = null

/**
 * @typedef {{ homeX: number, homeY: number, x: number, y: number, vx: number, vy: number, r: number }} Particle
 */

// Stiffer spring + slightly lower damping → readable snap-back ~300–500ms
const SPRING = 30
const DAMPING = 0.84
/** Home-space radius for the dent bowl (must cover ≥1 grid cell) */
const REPULSE_RADIUS = 165
/** Max dent in px; also capped at ~0.62× spacing in rebuild */
const MAX_DISPLACEMENT_PX = 56
const MAX_DISPLACEMENT_FRAC = 0.62
/** Near-home ring size so the hollow reads as a shape, not 2–3 dots */
const NEAR_COUNT = 16
/** Visual highlight radius (home-space) — slightly wider than force for a fuller rim */
const HIGHLIGHT_RADIUS = 190
const IDLE_DELAY_S = 2.4
/** Soft breath only — must not read as a second dent */
const IDLE_AMP = 1.6
const IDLE_FORCE = 0.05
const RIPPLE_DURATION = 0.85
const RIPPLE_RADIUS = 160
const FIRST_VISIT_KEY = 'hero-particle-ripple-v1'

/**
 * Lattice follows site theme (see --color-hero-bg).
 * Light: softer slate dots on cool mist; ice accent only on near rim.
 * Dark: snow-night ice lattice (unchanged quiet night look).
 * Hierarchy: resting lattice ≪ near rim < accent < title.
 */
function themeColors() {
  if (!isDark.value) {
    return {
      rest: 'rgba(94, 122, 138, 0.2)',
      near: 'rgba(94, 122, 138, 0.52)',
      nearCore: 'rgba(168, 197, 212, 0.82)'
    }
  }
  return {
    // Idle lattice biased to #A8C5D4 so rest reads cold ice, not gray terminal.
    rest: 'rgba(168, 197, 212, 0.28)',
    near: 'rgba(168, 197, 212, 0.78)',
    nearCore: 'rgba(232, 238, 242, 0.9)'
  }
}

function spacingForArea(w) {
  const mobile = w < 734
  // Denser rest lattice (desktop ~72px ≈ +90% nodes vs 100px); mobile stays
  // a bit sparser for scroll/jank headroom while still richer than before.
  return mobile ? 112 : 72
}

function maxDisplacement() {
  return Math.min(MAX_DISPLACEMENT_PX, spacing * MAX_DISPLACEMENT_FRAC)
}

function rebuildGrid() {
  const root = rootRef.value
  const canvas = canvasRef.value
  if (!root || !canvas) return

  const rect = root.getBoundingClientRect()
  width = Math.max(1, Math.floor(rect.width))
  height = Math.max(1, Math.floor(rect.height))
  dpr = Math.min(window.devicePixelRatio || 1, 1.75)

  canvas.width = Math.floor(width * dpr)
  canvas.height = Math.floor(height * dpr)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  const ctx = canvas.getContext('2d')
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  spacing = spacingForArea(width)
  const cols = Math.max(2, Math.floor(width / spacing))
  const rows = Math.max(2, Math.floor(height / spacing))
  const padX = (width - (cols - 1) * spacing) / 2
  const padY = (height - (rows - 1) * spacing) / 2

  const next = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const homeX = padX + col * spacing
      const homeY = padY + row * spacing
      // Slightly tighter dots so denser lattice stays quiet, not speckled
      const r = 1.55 + ((col * 7 + row * 13) % 5) * 0.22
      next.push({
        homeX,
        homeY,
        x: homeX,
        y: homeY,
        vx: 0,
        vy: 0,
        r
      })
    }
  }
  particles = next

  if (reducedMotion) {
    drawStatic()
  }
}

/**
 * Steep local falloff (ripple bands).
 * @param {number} dist
 * @param {number} radius
 */
function falloffNear(dist, radius) {
  const t = 1 - dist / radius
  if (t <= 0) return 0
  return t * t * t
}

/**
 * Wide dent bowl: 1 − smoothstep so nodes across the first grid cell
 * still reach near-max displacement (falloff³ was ~19px on a 100px lattice).
 * @param {number} dist
 * @param {number} radius
 */
function falloffBowl(dist, radius) {
  const t = Math.min(1, Math.max(0, dist / radius))
  return 1 - t * t * (3 - 2 * t)
}

/**
 * Dent via home-space targets (not live-position impulses).
 * Live impulses barely moved particles between 100px grid nodes (~1–2px);
 * springing each node toward an outward target up to maxD makes the hollow
 * read as a shape at a glance while keeping the same spring snap-back.
 */
function applyForceAt(px, py, strength, dt) {
  const radius = REPULSE_RADIUS
  const spring = SPRING
  const damp = Math.pow(DAMPING, dt * 60)
  const maxD = maxDisplacement()
  const active = strength > 0.001

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]
    let targetX = p.homeX
    let targetY = p.homeY

    if (active) {
      const hdx = p.homeX - px
      const hdy = p.homeY - py
      const homeDist = Math.hypot(hdx, hdy)
      if (homeDist < radius && homeDist > 0.01) {
        // Bowl: near nodes push hard (→maxD); far edge eases out
        const push = maxD * falloffBowl(homeDist, radius) * strength
        targetX = p.homeX + (hdx / homeDist) * push
        targetY = p.homeY + (hdy / homeDist) * push
      } else if (homeDist <= 0.01) {
        // Pointer dead-center on a node — nudge along +x so a void still opens
        targetX = p.homeX + maxD * strength
        targetY = p.homeY
      }
    }

    let ax = (targetX - p.x) * spring
    let ay = (targetY - p.y) * spring

    p.vx = (p.vx + ax * dt) * damp
    p.vy = (p.vy + ay * dt) * damp
    p.x += p.vx * dt
    p.y += p.vy * dt

    // Soft clamp so lattice never washes the title
    const ox = p.x - p.homeX
    const oy = p.y - p.homeY
    const od = Math.hypot(ox, oy)
    if (od > maxD) {
      const s = maxD / od
      p.x = p.homeX + ox * s
      p.y = p.homeY + oy * s
      p.vx *= 0.45
      p.vy *= 0.45
    }
  }
}

function getIdleTarget() {
  // Slow Lissajous / weak breath after leave delay — amp < 4px
  const cx = width * 0.62
  const cy = height * 0.42
  return {
    x: cx + Math.sin(idleT * 0.28) * IDLE_AMP * 1.1,
    y: cy + Math.sin(idleT * 0.41 + 1.1) * IDLE_AMP
  }
}

function injectRippleImpulse(dt) {
  if (rippleAge < 0) return
  if (rippleAge >= RIPPLE_DURATION) {
    rippleAge = -1
    return
  }
  rippleAge += dt
  const t = Math.min(1, rippleAge / RIPPLE_DURATION)
  const waveR = 24 + t * RIPPLE_RADIUS
  const strength = (1 - t) * (1 - t) * 0.55
  const maxD = maxDisplacement()
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]
    const dx = p.homeX - rippleX
    const dy = p.homeY - rippleY
    const dist = Math.hypot(dx, dy)
    const band = Math.abs(dist - waveR)
    if (band < 36 && dist > 0.01) {
      // Brief outward nudge in velocity; spring integration damps it
      const f = falloffNear(band, 36) * strength * maxD * 18
      p.vx += (dx / dist) * f * dt
      p.vy += (dy / dist) * f * dt
    }
  }
}

function step(dt) {
  // Impulse first so spring integration below damps it in the same frame
  injectRippleImpulse(dt)

  if (pointerActive) {
    idleSinceLeave = 0
    idleArmed = false
    // Mobile: slightly softer dent, still a clear hollow (not a static lattice)
    const strength = width < 734 ? 0.82 : 1
    applyForceAt(pointerX, pointerY, strength, dt)
  } else {
    idleSinceLeave += dt
    if (idleSinceLeave >= IDLE_DELAY_S) {
      if (!idleArmed) {
        idleArmed = true
        idleT = 0
      }
      idleT += dt
      const { x, y } = getIdleTarget()
      // Very weak virtual pointer — breath only, not a second dent
      applyForceAt(x, y, IDLE_FORCE, dt)
    } else {
      // Pure spring settle after release
      applyForceAt(-1e6, -1e6, 0, dt)
    }
  }
}

/**
 * Rank by home-space distance so the rim tracks the hollow shape
 * (displaced positions alone collapse to a few bright tip dots).
 */
function nearestIndices(px, py, count) {
  const scored = []
  const hlSq = HIGHLIGHT_RADIUS * HIGHLIGHT_RADIUS
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]
    const dSq = (p.homeX - px) ** 2 + (p.homeY - py) ** 2
    if (dSq > hlSq) continue
    scored.push({ i, dSq })
  }
  scored.sort((a, b) => a.dSq - b.dSq)
  const set = new Set()
  const list = []
  for (let k = 0; k < Math.min(count, scored.length); k++) {
    set.add(scored[k].i)
    list.push(scored[k])
  }
  return { set, list }
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, width, height)
  const colors = themeColors()

  let focusX = pointerX
  let focusY = pointerY
  let highlight = pointerActive
  if (!highlight && idleArmed && idleSinceLeave >= IDLE_DELAY_S) {
    const idle = getIdleTarget()
    focusX = idle.x
    focusY = idle.y
    highlight = true
  }

  const near = highlight ? nearestIndices(focusX, focusY, NEAR_COUNT) : { set: new Set(), list: [] }

  // Resting lattice — very faint so near cluster pops
  ctx.fillStyle = colors.rest
  ctx.beginPath()
  for (let i = 0; i < particles.length; i++) {
    if (near.set.has(i)) continue
    const p = particles[i]
    ctx.moveTo(p.x + p.r, p.y)
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
  }
  ctx.fill()

  // Near-pointer rim: emphasize displaced ring so the hollow reads as a shape
  if (near.list.length) {
    for (let k = 0; k < near.list.length; k++) {
      const { i, dSq } = near.list[k]
      const p = particles[i]
      const dist = Math.sqrt(dSq)
      const closeness = 1 - Math.min(1, dist / (HIGHLIGHT_RADIUS * 0.9))
      const offset = Math.hypot(p.x - p.homeX, p.y - p.homeY)
      const maxD = maxDisplacement()
      const pushed = Math.min(1, offset / Math.max(8, maxD * 0.55))
      // Prefer the pushed rim over the tip — form a ring around the void
      const boost = pointerActive
        ? 1.45 + closeness * 0.55 + pushed * 1.55
        : 1.08 + closeness * 0.4
      const rr = p.r * boost
      // Even rim weight so the hollow reads as a ring, not one hotspot
      const core = pointerActive ? pushed > 0.25 : k < 3
      ctx.fillStyle = core ? colors.nearCore : colors.near
      // Idle highlight stays soft so breath ≠ dent
      ctx.globalAlpha = pointerActive
        ? 0.62 + pushed * 0.35 + closeness * 0.08
        : 0.14 + closeness * 0.12
      ctx.beginPath()
      ctx.arc(p.x, p.y, rr, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }
}

function drawStatic() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)
  const colors = themeColors()
  ctx.fillStyle = colors.rest
  ctx.beginPath()
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]
    p.x = p.homeX
    p.y = p.homeY
    ctx.moveTo(p.x + p.r, p.y)
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
  }
  ctx.fill()
}

function frame(ts) {
  if (!running) return
  if (!lastTs) lastTs = ts
  let dt = (ts - lastTs) / 1000
  lastTs = ts
  if (dt > 0.05) dt = 0.05
  if (dt < 0) dt = 0

  step(dt)
  draw()
  rafId = requestAnimationFrame(frame)
}

function shouldRun() {
  return !reducedMotion && visible && pageVisible
}

function start() {
  if (running || !shouldRun()) return
  running = true
  lastTs = 0
  rafId = requestAnimationFrame(frame)
}

function stop() {
  running = false
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = 0
  }
}

function syncLifecycle() {
  if (reducedMotion) {
    stop()
    drawStatic()
    return
  }
  if (shouldRun()) start()
  else stop()
}

function pointerInHero(clientX, clientY) {
  const root = rootRef.value
  if (!root) return null
  const rect = root.getBoundingClientRect()
  const x = clientX - rect.left
  const y = clientY - rect.top
  if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null
  return { x, y }
}

function onPointerMove(e) {
  const hit = pointerInHero(e.clientX, e.clientY)
  if (!hit) {
    if (pointerActive) {
      pointerActive = false
      idleSinceLeave = 0
      idleArmed = false
    }
    return
  }
  pointerX = hit.x
  pointerY = hit.y
  pointerActive = true
}

function onPointerLeave() {
  if (pointerActive) {
    pointerActive = false
    idleSinceLeave = 0
    idleArmed = false
  }
}

function onVisibility() {
  pageVisible = document.visibilityState === 'visible'
  syncLifecycle()
}

function onReducedMotionChange() {
  reducedMotion = mediaQuery ? mediaQuery.matches : false
  syncLifecycle()
}

function maybeStartFirstVisitRipple() {
  if (reducedMotion || rippleDone) return
  try {
    if (sessionStorage.getItem(FIRST_VISIT_KEY)) {
      rippleDone = true
      return
    }
    sessionStorage.setItem(FIRST_VISIT_KEY, '1')
  } catch {
    // sessionStorage blocked — still fire once this session
  }
  rippleDone = true
  rippleX = width * 0.55
  rippleY = height * 0.4
  rippleAge = 0
}

watch(isDark, () => {
  if (reducedMotion || !running) drawStatic()
})

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion = mediaQuery.matches
  mediaQuery.addEventListener('change', onReducedMotionChange)

  rebuildGrid()
  maybeStartFirstVisitRipple()

  resizeObserver = new ResizeObserver(() => {
    rebuildGrid()
  })
  if (rootRef.value) resizeObserver.observe(rootRef.value)

  intersectionObserver = new IntersectionObserver(
    entries => {
      visible = entries.some(e => e.isIntersecting)
      syncLifecycle()
    },
    { threshold: 0.05 }
  )
  if (rootRef.value) intersectionObserver.observe(rootRef.value)

  document.addEventListener('visibilitychange', onVisibility)
  // pointermove + pointerdown: mouse + touch (mobile must not be a static lattice)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('pointerdown', onPointerMove, { passive: true })
  window.addEventListener('pointerleave', onPointerLeave)
  window.addEventListener('blur', onPointerLeave)

  pageVisible = document.visibilityState === 'visible'
  syncLifecycle()
})

onUnmounted(() => {
  stop()
  if (resizeObserver) resizeObserver.disconnect()
  if (intersectionObserver) intersectionObserver.disconnect()
  if (mediaQuery) mediaQuery.removeEventListener('change', onReducedMotionChange)
  document.removeEventListener('visibilitychange', onVisibility)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerdown', onPointerMove)
  window.removeEventListener('pointerleave', onPointerLeave)
  window.removeEventListener('blur', onPointerLeave)
})
</script>

<style scoped>
.hero-particle-field {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.hero-particle-canvas {
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
