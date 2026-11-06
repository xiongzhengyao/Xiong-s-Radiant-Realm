<template>
  <nav
    v-if="!hideForArticle"
    class="mobile-tabbar"
    :style="{ '--tab-count': tabs.length }"
    :aria-label="$t('nav.mobileNav')"
  >
    <router-link
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
      class="tabbar-item"
      :class="{ 'router-link-active': isActive(tab.path) }"
    >
      <span
        class="tabbar-icon"
        v-html="tab.icon"
      />
      <span class="tabbar-label">{{ $t(tab.label) }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { isNavActive, tabItems } from '@/modules'

const route = useRoute()

/** Article reading uses its own mini bar — avoid double bottom chrome */
const hideForArticle = computed(() => Boolean(route.meta.articleReading))

const tabs = tabItems()

const isActive = path => isNavActive(path, route)
</script>

<style scoped>
.mobile-tabbar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  height: calc(56px + env(safe-area-inset-bottom, 0px));
  padding-bottom: env(safe-area-inset-bottom, 0px);
  background: var(--color-nav-bg);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-top: 1px solid var(--color-border);
  grid-template-columns: repeat(var(--tab-count, 5), 1fr);
}

.tabbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  text-decoration: none;
  color: var(--color-text-tertiary);
  font-size: 10px;
  font-weight: 600;
  transition: color var(--duration-fast) var(--ease-out);
}

.tabbar-item.router-link-active {
  color: var(--color-accent);
}

.tabbar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 734px) {
  .mobile-tabbar {
    display: grid;
  }
}
</style>
