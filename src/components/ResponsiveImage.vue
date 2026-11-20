<template>
  <picture class="responsive-picture">
    <source
      v-if="webpSrc"
      :srcset="webpSrc"
      type="image/webp"
    >
    <img
      :src="src"
      :alt="alt"
      :loading="loading || undefined"
      :fetchpriority="fetchpriority || undefined"
      :class="[imgClass, fit === 'intrinsic' ? 'is-intrinsic' : '']"
      decoding="async"
      @error="$emit('error', $event)"
    >
  </picture>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  loading: { type: String, default: 'lazy' },
  fetchpriority: { type: String, default: '' },
  imgClass: { type: String, default: '' },
  fit: { type: String, default: 'cover' }
})

defineEmits(['error'])

const webpSrc = computed(() => {
  const src = props.src || ''
  if (!/\.(jpe?g|png)$/i.test(src)) return ''
  return src.replace(/\.(jpe?g|png)$/i, '.webp')
})
</script>

<style scoped>
.responsive-picture {
  display: block;
  width: 100%;
  height: 100%;
}

.responsive-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.responsive-picture img.is-intrinsic {
  height: auto;
  object-fit: fill;
}
</style>
