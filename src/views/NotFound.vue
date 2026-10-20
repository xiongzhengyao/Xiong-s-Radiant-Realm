<template>
  <div class="not-found">
    <div class="not-found-mesh" aria-hidden="true" />
    <div class="not-found-inner reveal is-visible">
      <p class="not-found-code">404</p>
      <h1>{{ $t('notFound.title') }}</h1>
      <p class="not-found-desc">{{ $t('notFound.desc') }}</p>
      <div class="not-found-actions">
        <button class="btn btn-primary" @click="$router.push('/')">{{ $t('notFound.home') }}</button>
        <button class="btn btn-outline" @click="goBack">{{ $t('notFound.back') }}</button>
      </div>
      <div class="not-found-quick">
        <p class="quick-label">{{ $t('notFound.quickLinks') }}</p>
        <div class="quick-grid">
          <router-link v-for="link in quickLinks" :key="link.path" :to="link.path" class="quick-link">
            {{ $t(link.label) }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { setPageMetaOverride, clearPageMetaOverride, usePageMeta } from '@/composables/usePageMeta'

const router = useRouter()
usePageMeta()

const quickLinks = [
  { path: '/blog', label: 'nav.blog' },
  { path: '/projects', label: 'nav.projects' },
  { path: '/about', label: 'nav.about' },
  { path: '/contact', label: 'nav.contact' }
]

const goBack = () => {
  if (window.history.length > 1) router.back()
  else router.push('/')
}

onMounted(() => {
  setPageMetaOverride({ title: '404' })
})

onUnmounted(() => {
  clearPageMetaOverride()
})
</script>

<style scoped>
.not-found {
  padding-top: var(--nav-height);
  min-height: calc(100vh - var(--nav-height));
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-12) var(--space-6);
  position: relative;
  overflow: hidden;
}

.not-found-mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 40% at 50% 40%, var(--color-mesh-1) 0%, transparent 55%);
  pointer-events: none;
}

.not-found-inner {
  position: relative;
  max-width: 480px;
}

.not-found-code {
  font-size: clamp(80px, 15vw, 120px);
  font-weight: 600;
  letter-spacing: -0.06em;
  background: linear-gradient(180deg, var(--color-text-tertiary) 0%, transparent 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: var(--space-4);
}

.not-found-inner h1 {
  font-size: 28px;
  margin-bottom: var(--space-3);
}

.not-found-desc {
  font-size: 17px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: var(--space-8);
}

.not-found-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: var(--space-10);
}

.not-found-quick {
  padding-top: var(--space-8);
  border-top: 1px solid var(--color-border);
}

.quick-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-4);
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-2);
}

.quick-link {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 14px;
  transition: border-color var(--duration-fast) var(--ease-out),
              color var(--duration-fast) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .quick-link:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
}
</style>
