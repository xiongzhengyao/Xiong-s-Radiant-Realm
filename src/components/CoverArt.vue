<template>
  <div
    class="cover-art"
    :class="[`cover-art--${size}`, isDark ? 'cover-art--dark' : 'cover-art--light']"
  >
    <img
      v-if="image"
      :src="image"
      :alt="label || ''"
      loading="lazy"
      class="cover-art-img"
    />
    <template v-else>
      <div class="cover-art-bg" :style="bgStyle" />
      <div class="cover-art-noise" aria-hidden="true" />
      <div class="cover-art-lines" aria-hidden="true" />
      <span
        v-for="(_, i) in 3"
        :key="i"
        class="cover-art-shape"
        :style="shapeStyles[i]"
        aria-hidden="true"
      />
      <span v-if="label" class="cover-art-label">{{ label }}</span>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getCoverArt, coverGradientStyle, coverShapeStyle } from '@/utils/coverArt'
import { useTheme } from '@/composables/useTheme'

const props = defineProps({
  seed: { type: [String, Number], required: true },
  category: { type: String, default: '' },
  label: { type: String, default: '' },
  image: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
    validator: v => ['sm', 'md', 'lg', 'featured'].includes(v)
  }
})

const { isDark } = useTheme()
const art = computed(() => getCoverArt(props.seed, props.category))
const theme = computed(() => (isDark.value ? 'dark' : 'light'))
const bgStyle = computed(() =>
  coverGradientStyle(art.value, { theme: theme.value, boosted: isDark.value })
)
const shapeStyles = computed(() =>
  [0, 1, 2].map(i => coverShapeStyle(art.value, i, { theme: theme.value, boosted: isDark.value }))
)
</script>

<style scoped>
.cover-art {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

/* Theme-aware base — light cool mist / dark near-black night */
.cover-art--light {
  background: var(--color-cover-bg, #e8eef2);
}

.cover-art--dark {
  background: var(--color-cover-bg, #0a0a0c);
}

.cover-art-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cover-art-bg {
  position: absolute;
  inset: 0;
}

.cover-art-noise {
  position: absolute;
  inset: 0;
  opacity: 0.28;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E");
  mix-blend-mode: multiply;
  pointer-events: none;
}

.cover-art--dark .cover-art-noise {
  opacity: 0.55;
  mix-blend-mode: overlay;
}

.cover-art-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(94, 122, 138, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(94, 122, 138, 0.06) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
}

.cover-art--dark .cover-art-lines {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
}

.cover-art-shape {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(94, 122, 138, 0.1);
  pointer-events: none;
}

.cover-art--dark .cover-art-shape {
  border-color: rgba(255, 255, 255, 0.08);
}

.cover-art-label {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  /* Light: soft dark-on-mist chip — not pure black glass */
  background: rgba(11, 15, 18, 0.08);
  color: var(--color-accent, #5E7A8A);
  backdrop-filter: blur(8px);
  z-index: 1;
}

.cover-art--dark .cover-art-label {
  background: rgba(0, 0, 0, 0.35);
  color: rgba(255, 255, 255, 0.9);
}

.cover-art--sm { min-height: 72px; }
.cover-art--md { min-height: 180px; }
.cover-art--lg { min-height: 240px; }
.cover-art--featured { min-height: 280px; }
</style>
