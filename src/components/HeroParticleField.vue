<template>
  <div ref="rootRef" class="hero-particle-field" aria-hidden="true">
    <canvas ref="canvasRef" class="hero-particle-canvas" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

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
const SPRING = 28
const DAMPING = 0.82
const REPULSE_RADIUS = 150
const REPULSE_STRENGTH = 5600
/** Max dent in px; also capped at ~0.62× spacing in rebuild */
const MAX_DISPLACEMENT_PX = 56
const MAX_DISPLACEMENT_FRAC = 0.62
/** Near-home ring size so the hollow reads as a shape, not 2–3 dots */
const NEAR_COUNT = 14
/** Visual highlight radius (home-space) — slightly wider than force for a fuller rim */
const HIGHLIGHT_RADIUS = 175
const IDLE_DELAY_S = 2.4
/** Soft breath only — must not read as a second dent */
const IDLE_AMP = 1.8
const IDLE_FORCE = 0.06
const RIPPLE_DURATION = 0.85
const RIPPLE_RADIUS = 160
const FIRST_VISIT_KEY = 'hero-particle-ripple-v1'

/**
 * Hero band stays dark in both site themes (see --color-hero-bg).
 * Always paint with dark-bottom params so light chrome never washes the lattice.
 * Hierarchy: resting lattice (visible outline) ≪ near teal rim < terminal accent < white title.
 */
function themeColors() {
  return {
    // ~0.20 so the hollow outline is legible at a glance (was 0.12)
    rest: 'rgba(125, 211, 220, 0.20)',
    near: 'rgba(94, 234, 212, 0.70)',
    nearCore: 'rgba(94, 234, 212, 0.88)'
  }
}

function spacingForArea(w) {
  const mobile = w < 734
  // Desktop ~one node per 80–120px; mobile ~30–40% sparser
  return mobile ? 130 : 100
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
      // Slight radius variation keeps lattice from looking stamped
      const r = 0.85 + ((col * 7 + row * 13) % 5) * 0.18
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
 * Steeper near / flatter far: use falloff^3 so the dent is local.
 * @param {number} dist
 * @param {number} radius
 */
function falloffNear(dist, radius) {
  const t = 1 - dist / radius
  if (t <= 0) return 0
  return t * t * t
}

function applyForceAt(px, py, strength, dt) {
  const radius = REPULSE_RADIUS
  const radiusSq = radius * radius
  const spring = SPRING
  const damp = Math.pow(DAMPING, dt * 60)
  const maxD = maxDisplacement()

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]
    const dx = p.x - px
    const dy = p.y - py
    const distSq = dx * dx + dy * dy

    let ax = 0
    let ay = 0

    if (distSq < radiusSq && distSq > 0.01) {
      const dist = Math.sqrt(distSq)
      const force = (REPULSE_STRENGTH * falloffNear(dist, radius) * strength) / dist
      ax += (dx / dist) * force
      ay += (dy / dist) * force
    }

    // Spring back to home
    ax += (p.homeX - p.x) * spring
    ay += (p.homeY - p.y) * spring

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
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]
    const dx = p.x - rippleX
    const dy = p.y - rippleY
    const dist = Math.hypot(dx, dy)
    const band = Math.abs(dist - waveR)
    if (band < 36 && dist > 0.01) {
      const f = falloffNear(band, 36) * strength * 2200
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

  // Near-pointer rim: larger radius + opacity so the dent reads as a form
  if (near.list.length) {
    for (let k = 0; k < near.list.length; k++) {
      const { i, dSq } = near.list[k]
      const p = particles[i]
      const dist = Math.sqrt(dSq)
      const closeness = 1 - Math.min(1, dist / (HIGHLIGHT_RADIUS * 0.9))
      // Outer rim slightly larger than inner tip — reads as a ring around the hollow
      const rim = Math.min(1, dist / (spacing * 0.55))
      const boost = pointerActive
        ? 1.7 + closeness * 1.15 + rim * 0.35
        : 1.15 + closeness * 0.55
      const rr = p.r * boost
      const core = k < 5
      ctx.fillStyle = core ? colors.nearCore : colors.near
      // Idle highlight stays soft so breath ≠ dent
      ctx.globalAlpha = pointerActive
        ? 0.92 + closeness * 0.08
        : 0.18 + closeness * 0.16
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
