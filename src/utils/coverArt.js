/* 雪夜静默 — low-saturation cool hues only */
const CATEGORY_HUE = {
  embedded: 205,
  linux: 198,
  sensor: 210,
  notes: 195,
  travel: 215,
  food: 200,
  reading: 190,
  photography: 208,
  thoughts: 202
}

export function hashSeed(seed) {
  const str = String(seed ?? '')
  let hash = 0
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  }
  return hash
}

export function getCoverArt(seed, category = '') {
  const hash = hashSeed(`${seed}-${category}`)
  const baseHue = CATEGORY_HUE[category] ?? 198 + (hash % 24)
  const hue2 = (baseHue + 12 + (hash % 16)) % 360
  const variant = hash % 3
  return {
    hue: baseHue,
    hue2,
    variant,
    rotate: (hash % 60) - 30,
    scale: 0.85 + (hash % 20) / 100
  }
}

export function coverGradientStyle(art, options = {}) {
  const { boosted = false } = options
  // Low-sat cool tones — mist / ice, not neon
  const sat = boosted ? 28 : 22
  const lightA = boosted ? 48 : 42
  const lightB = boosted ? 38 : 32
  const baseLight = boosted ? 14 : 11
  const baseLightEnd = boosted ? 10 : 8
  return {
    background: `
      radial-gradient(ellipse 80% 70% at ${20 + art.variant * 15}% ${30 + art.variant * 10}%,
        hsla(${art.hue}, ${sat}%, ${lightA}%, ${boosted ? 0.9 : 0.82}) 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at ${75 - art.variant * 10}% ${65}%,
        hsla(${art.hue2}, ${sat - 4}%, ${lightB}%, ${boosted ? 0.75 : 0.65}) 0%, transparent 50%),
      linear-gradient(155deg,
        hsl(${art.hue}, 18%, ${baseLight}%) 0%,
        hsl(${art.hue2}, 14%, ${baseLightEnd}%) 100%)
    `
  }
}

export function coverShapeStyle(art, index, options = {}) {
  const { boosted = false } = options
  const offsets = [
    { x: '65%', y: '20%', w: '45%', h: '45%' },
    { x: '10%', y: '55%', w: '35%', h: '35%' },
    { x: '40%', y: '70%', w: '28%', h: '28%' }
  ]
  const o = offsets[index % 3]
  const shapeAlpha = boosted ? 0.22 : 0.16
  const borderAlpha = boosted ? 0.12 : 0.07
  return {
    left: o.x,
    top: o.y,
    width: o.w,
    height: o.h,
    transform: `rotate(${art.rotate + index * 18}deg) scale(${art.scale})`,
    background: `linear-gradient(135deg, hsla(${art.hue2}, 24%, 62%, ${shapeAlpha}), hsla(${art.hue}, 18%, 48%, ${shapeAlpha * 0.35}))`,
    borderColor: `rgba(232, 238, 242, ${borderAlpha})`
  }
}
