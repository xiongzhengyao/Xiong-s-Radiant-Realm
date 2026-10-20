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
  // Quieter mist — lower sat so covers don’t read as terminal glow
  const sat = boosted ? 18 : 14
  const lightA = boosted ? 42 : 36
  const lightB = boosted ? 32 : 28
  const baseLight = boosted ? 13 : 10
  const baseLightEnd = boosted ? 9 : 7
  return {
    background: `
      radial-gradient(ellipse 80% 70% at ${20 + art.variant * 15}% ${30 + art.variant * 10}%,
        hsla(${art.hue}, ${sat}%, ${lightA}%, ${boosted ? 0.78 : 0.7}) 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at ${75 - art.variant * 10}% ${65}%,
        hsla(${art.hue2}, ${Math.max(sat - 4, 8)}%, ${lightB}%, ${boosted ? 0.58 : 0.5}) 0%, transparent 50%),
      linear-gradient(155deg,
        hsl(${art.hue}, 12%, ${baseLight}%) 0%,
        hsl(${art.hue2}, 10%, ${baseLightEnd}%) 100%)
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
  const shapeAlpha = boosted ? 0.14 : 0.1
  const borderAlpha = boosted ? 0.1 : 0.06
  return {
    left: o.x,
    top: o.y,
    width: o.w,
    height: o.h,
    transform: `rotate(${art.rotate + index * 18}deg) scale(${art.scale})`,
    background: `linear-gradient(135deg, hsla(${art.hue2}, 14%, 58%, ${shapeAlpha}), hsla(${art.hue}, 10%, 44%, ${shapeAlpha * 0.35}))`,
    borderColor: `rgba(232, 238, 242, ${borderAlpha})`
  }
}
