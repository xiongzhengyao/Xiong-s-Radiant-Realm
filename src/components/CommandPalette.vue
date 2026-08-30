<template>
  <Teleport to="body">
    <Transition name="cmd-palette">
      <div v-if="open" class="cmd-overlay" @click.self="close">
        <div class="cmd-panel" role="dialog" aria-modal="true" :aria-label="$t('command.title')">
          <div class="cmd-input-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              ref="inputRef"
              v-model="query"
              type="search"
              class="cmd-input"
              :placeholder="$t('command.placeholder')"
              @keydown.down.prevent="moveSelection(1)"
              @keydown.up.prevent="moveSelection(-1)"
              @keydown.enter.prevent="selectCurrent"
              @keydown.esc.prevent="close"
            />
            <kbd class="cmd-kbd">esc</kbd>
          </div>
          <ul class="cmd-list" role="listbox">
            <li
              v-for="(item, index) in filteredItems"
              :key="item.path"
              role="option"
              :class="{ 'is-active': index === activeIndex }"
              @click="go(item)"
              @mouseenter="activeIndex = index"
            >
              <span class="cmd-item-label">{{ $t(item.label) }}</span>
              <span class="cmd-item-hint">{{ item.hint }}</span>
            </li>
            <li v-if="!filteredItems.length" class="cmd-empty">{{ $t('command.empty') }}</li>
          </ul>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

const open = ref(false)
const query = ref('')
const activeIndex = ref(0)
const inputRef = ref(null)

const navItems = [
  { path: '/', label: 'nav.home', hint: 'Home' },
  { path: '/about', label: 'nav.about', hint: 'About' },
  { path: '/projects', label: 'nav.projects', hint: 'Projects' },
  { path: '/blog', label: 'nav.blog', hint: 'Blog' },
  { path: '/life', label: 'nav.life', hint: 'Life' },
  { path: '/contact', label: 'nav.contact', hint: 'Contact' }
]

const filteredItems = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return navItems
  return navItems.filter(item => {
    const label = t(item.label).toLowerCase()
    return label.includes(q) || item.hint.toLowerCase().includes(q) || item.path.includes(q)
  })
})

watch(query, () => {
  activeIndex.value = 0
})

const close = () => {
  open.value = false
  query.value = ''
  activeIndex.value = 0
}

const show = () => {
  open.value = true
  nextTick(() => inputRef.value?.focus())
}

const go = item => {
  close()
  router.push(item.path)
}

const selectCurrent = () => {
  const item = filteredItems.value[activeIndex.value]
  if (item) go(item)
}

const moveSelection = delta => {
  const len = filteredItems.value.length
  if (!len) return
  activeIndex.value = (activeIndex.value + delta + len) % len
}

const onKeydown = e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    open.value ? close() : show()
  }
}

defineExpose({ show, close })

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.cmd-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 12vh var(--space-4) var(--space-4);
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
}

.cmd-panel {
  width: min(520px, 100%);
  background: var(--color-bg-elevated, var(--color-bg));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl, 16px);
  box-shadow: var(--shadow-lg, 0 24px 48px rgba(0, 0, 0, 0.2));
  overflow: hidden;
}

.cmd-input-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.cmd-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  color: var(--color-text);
  outline: none;
  font-family: var(--font-sans);
}

.cmd-kbd {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--color-bg-secondary);
  color: var(--color-text-tertiary);
  border: 1px solid var(--color-border);
}

.cmd-list {
  list-style: none;
  margin: 0;
  padding: var(--space-2);
  max-height: 320px;
  overflow-y: auto;
}

.cmd-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 14px;
  color: var(--color-text);
  transition: background var(--duration-fast) var(--ease-out);
}

.cmd-list li.is-active,
.cmd-list li:hover {
  background: var(--color-accent-light);
}

.cmd-item-hint {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.cmd-empty {
  justify-content: center;
  color: var(--color-text-secondary);
  cursor: default;
}

.cmd-palette-enter-active,
.cmd-palette-leave-active {
  transition: opacity 180ms var(--ease-out);
}

.cmd-palette-enter-active .cmd-panel,
.cmd-palette-leave-active .cmd-panel {
  transition: transform 180ms var(--ease-out), opacity 180ms var(--ease-out);
}

.cmd-palette-enter-from,
.cmd-palette-leave-to {
  opacity: 0;
}

.cmd-palette-enter-from .cmd-panel,
.cmd-palette-leave-to .cmd-panel {
  transform: scale(0.96) translateY(-8px);
  opacity: 0;
}
</style>
