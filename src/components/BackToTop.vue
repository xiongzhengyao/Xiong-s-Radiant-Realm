<template>
  <button
    v-show="visible"
    class="back-to-top"
    :aria-label="label"
    @click="scrollToTop"
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const visible = ref(false)
const label = t('common.backToTop')

const onScroll = () => {
  visible.value = window.scrollY > 400
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'auto' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  right: var(--space-6);
  bottom: var(--back-to-top-offset, var(--space-6));
  z-index: 900;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: var(--color-nav-bg);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  transition: transform 0.12s var(--ease-out), opacity var(--duration-fast) var(--ease-out);
}

.back-to-top:active {
  transform: scale(0.92);
}

@media (hover: hover) and (pointer: fine) {
  .back-to-top:hover {
    transform: translateY(-2px);
  }
}
</style>
