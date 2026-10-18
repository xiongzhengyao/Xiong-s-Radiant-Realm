<template>
  <div ref="rootRef" class="hero-particle-field" aria-hidden="true">
    <canvas ref="canvasRef" class="hero-particle-canvas" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useTheme } from '@/composables/useTheme'

const rootRef = ref(null)
const canvasRef = ref(null)
const { isDark } = useTheme()

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
let pointerX = 0
let pointerY = 0
let pointerActive = false
let idleT = 0
let resizeObserver = null
let intersectionObserver = null
let mediaQuery = null

/**
 * @typedef {{ homeX: number, homeY: number, x: number, y: number, vx: number, vy: number, r: number }} Particle
 */

const SPRING = 14
const DAMPING = 0.88
const REPULSE_RADIUS = 120
const REPULSE_STRENGTH = 2800
const MAX_DISPLACEMENT = 38
const IDLE_AMP = 42

function themeColors() {
  if (isDark.value) {
    return {
      rest: 'rgba(125, 211, 220, 0.36)',
      near: 'rgba(94, 234, 212, 0.85)'
    }
  }
  // Light page: hero still dark, but keep particles paler / lower-contrast
  return {
    rest: 'rgba(148, 180, 188, 0.2)',
    near: 'rgba(125, 200, 210, 0.48)'
  }
}

function spacingForArea(w, h) {
  const mobile = w < 734
  // Desktop ~one node per 80–120px; mobile ~30–40% sparser
  const base = mobile ? 130 : 100
  return base
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

  const spacing = spacingForArea(width, height)
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

function getPointerTargets(dt) {
  if (pointerActive) {
    return { x: pointerX, y: pointerY, strength: 1 }
  }
  // Slow Lissajous “virtual pointer” when idle — gentle lattice breath
  idleT += dt
  const cx = width * 0.5
  const cy = height * 0.45
  return {
    x: cx + Math.sin(idleT * 0.35) * IDLE_AMP * 1.4,
    y: cy + Math.sin(idleT * 0.55 + 1.2) * IDLE_AMP,
    strength: 0.35
  }
}

function step(dt) {
  const { x: px, y: py, strength } = getPointerTargets(dt)
  const radius = REPULSE_RADIUS
  const radiusSq = radius * radius
  const spring = SPRING
  const damp = Math.pow(DAMPING, dt * 60)

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]
    const dx = p.x - px
    const dy = p.y - py
    const distSq = dx * dx + dy * dy

    let ax = 0
    let ay = 0

    if (distSq < radiusSq && distSq > 0.01) {
      const dist = Math.sqrt(distSq)
      const falloff = 1 - dist / radius
      const force = (REPULSE_STRENGTH * falloff * falloff * strength) / dist
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

    // Soft clamp displacement so lattice never wanders into title wash
    const ox = p.x - p.homeX
    const oy = p.y - p.homeY
    const od = Math.hypot(ox, oy)
    if (od > MAX_DISPLACEMENT) {
      const s = MAX_DISPLACEMENT / od
      p.x = p.homeX + ox * s
      p.y = p.homeY + oy * s
      p.vx *= 0.5
      p.vy *= 0.5
    }
  }
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, width, height)
  const colors = themeColors()
  const { x: px, y: py } = getPointerTargets(0)
  const nearR = REPULSE_RADIUS * 0.95
  const nearRSq = nearR * nearR

  // Batch resting dots
  ctx.fillStyle = colors.rest
  ctx.beginPath()
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]
    const dx = p.x - px
    const dy = p.y - py
    if (dx * dx + dy * dy < nearRSq) continue
    ctx.moveTo(p.x + p.r, p.y)
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
  }
  ctx.fill()

  // Near-pointer tinted separately (teal brighten, not full wash)
  ctx.fillStyle = colors.near
  ctx.beginPath()
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]
    const dx = p.x - px
    const dy = p.y - py
    const dSq = dx * dx + dy * dy
    if (dSq >= nearRSq) continue
    const falloff = 1 - Math.sqrt(dSq) / nearR
    const boost = 1 + falloff * 0.75
    const rr = p.r * boost
    ctx.moveTo(p.x + rr, p.y)
    ctx.arc(p.x, p.y, rr, 0, Math.PI * 2)
  }
  ctx.fill()
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
  // Normalize / clamp dt for tab switches
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

function onPointerMove(e) {
  const root = rootRef.value
  if (!root) return
  const rect = root.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
    pointerActive = false
    return
  }
  pointerX = x
  pointerY = y
  pointerActive = true
}

function onPointerLeave() {
  pointerActive = false
}

function onVisibility() {
  pageVisible = document.visibilityState === 'visible'
  syncLifecycle()
}

function onReducedMotionChange() {
  reducedMotion = mediaQuery ? mediaQuery.matches : false
  syncLifecycle()
}

watch(isDark, () => {
  if (reducedMotion) drawStatic()
})

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion = mediaQuery.matches
  mediaQuery.addEventListener('change', onReducedMotionChange)

  rebuildGrid()

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
  // Listen on window so canvas can stay pointer-events: none
  window.addEventListener('pointermove', onPointerMove, { passive: true })
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
