const CATEGORY_HUE = {
  embedded: 220,
  linux: 200,
  sensor: 280,
  notes: 160,
  travel: 250,
  food: 340,
  reading: 190,
  photography: 310,
  thoughts: 170
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
  const baseHue = CATEGORY_HUE[category] ?? hash % 360
  const hue2 = (baseHue + 40 + (hash % 30)) % 360
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
  const sat = boosted ? 62 : 55
  const lightA = boosted ? 52 : 45
  const lightB = boosted ? 44 : 38
  const baseLight = boosted ? 16 : 12
  const baseLightEnd = boosted ? 12 : 8
  return {
    background: `
      radial-gradient(ellipse 80% 70% at ${20 + art.variant * 15}% ${30 + art.variant * 10}%,
        hsla(${art.hue}, ${sat}%, ${lightA}%, ${boosted ? 0.95 : 0.9}) 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at ${75 - art.variant * 10}% ${65}%,
        hsla(${art.hue2}, ${sat - 5}%, ${lightB}%, ${boosted ? 0.85 : 0.75}) 0%, transparent 50%),
      linear-gradient(155deg,
        hsl(${art.hue}, 38%, ${baseLight}%) 0%,
        hsl(${art.hue2}, 32%, ${baseLightEnd}%) 100%)
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
  const shapeAlpha = boosted ? 0.35 : 0.25
  const borderAlpha = boosted ? 0.14 : 0.08
  return {
    left: o.x,
    top: o.y,
    width: o.w,
    height: o.h,
    transform: `rotate(${art.rotate + index * 18}deg) scale(${art.scale})`,
    background: `linear-gradient(135deg, hsla(${art.hue2}, 70%, 60%, ${shapeAlpha}), hsla(${art.hue}, 60%, 50%, ${shapeAlpha * 0.3}))`,
    borderColor: `rgba(255, 255, 255, ${borderAlpha})`
  }
}
