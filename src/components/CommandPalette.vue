<template>
  <Teleport to="body">
    <Transition name="cmd-palette">
      <div
        v-if="open"
        class="cmd-overlay"
        @click.self="close"
      >
        <div
          class="cmd-panel"
          role="dialog"
          aria-modal="true"
          :aria-label="$t('command.title')"
        >
          <div class="cmd-input-wrap">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            ><circle
              cx="11"
              cy="11"
              r="8"
            /><line
              x1="21"
              y1="21"
              x2="16.65"
              y2="16.65"
            /></svg>
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
            >
            <kbd class="cmd-kbd">esc</kbd>
          </div>
          <div class="cmd-scroll">
            <template v-if="groupedResults.length">
              <section
                v-for="group in groupedResults"
                :key="group.id"
                class="cmd-group"
              >
                <h3 class="cmd-group-title">
                  {{ group.label }}
                </h3>
                <ul
                  class="cmd-list"
                  role="listbox"
                >
                  <li
                    v-for="item in group.items"
                    :key="item.key"
                    role="option"
                    :class="{ 'is-active': flatIndex(item) === activeIndex }"
                    @click="go(item)"
                    @mouseenter="activeIndex = flatIndex(item)"
                  >
                    <span class="cmd-item-label">{{ item.label }}</span>
                    <span class="cmd-item-hint">{{ item.hint }}</span>
                  </li>
                </ul>
              </section>
            </template>
            <p
              v-else
              class="cmd-empty"
            >
              {{ $t('command.empty') }}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useBlogStore } from '@/stores/blogStore'
import { useCareer } from '@/composables/useCareer'

const router = useRouter()
const { t } = useI18n()
const blogStore = useBlogStore()
const { projects } = useCareer()

const open = ref(false)
const query = ref('')
const activeIndex = ref(0)
const inputRef = ref(null)

const navItems = computed(() => [
  { key: 'nav-home', path: '/', label: t('nav.home'), hint: t('command.groups.pages'), kind: 'page' },
  { key: 'nav-blog', path: '/blog', label: t('nav.blog'), hint: t('command.groups.pages'), kind: 'page' },
  { key: 'nav-projects', path: '/projects', label: t('nav.projects'), hint: t('command.groups.pages'), kind: 'page' },
  { key: 'nav-life', path: '/life', label: t('nav.life'), hint: t('command.groups.pages'), kind: 'page' },
  { key: 'nav-about', path: '/about', label: t('nav.about'), hint: t('command.groups.pages'), kind: 'page' },
  { key: 'nav-contact', path: '/contact', label: t('nav.contact'), hint: t('command.groups.pages'), kind: 'page' }
])

const noteItems = computed(() => blogStore.posts.map(post => ({
  key: `note-${post.id}`,
  path: `/blog/${post.id}/${encodeURIComponent(post.slug)}`,
  label: post.title,
  hint: t('command.groups.notes'),
  kind: 'note',
  search: [post.title, post.excerpt, ...(post.tags || [])].join(' ')
})))

const projectItems = computed(() => projects.value.map(project => ({
  key: `project-${project.id}`,
  path: '/projects',
  label: project.title,
  hint: project.company || t('command.groups.projects'),
  kind: 'project',
  search: [project.title, project.role, project.description, project.company, ...(project.tags || [])].join(' ')
})))

const allItems = computed(() => [
  ...navItems.value,
  ...noteItems.value,
  ...projectItems.value
])

const filteredItems = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return navItems.value
  return allItems.value.filter(item => {
    const hay = `${item.label} ${item.hint} ${item.search || ''} ${item.path}`.toLowerCase()
    return hay.includes(q)
  }).slice(0, 24)
})

const groupedResults = computed(() => {
  const order = [
    { id: 'page', label: t('command.groups.pages') },
    { id: 'note', label: t('command.groups.notes') },
    { id: 'project', label: t('command.groups.projects') }
  ]
  return order
    .map(group => ({
      ...group,
      items: filteredItems.value.filter(item => item.kind === group.id)
    }))
    .filter(group => group.items.length)
})

const flatItems = computed(() => groupedResults.value.flatMap(group => group.items))

const flatIndex = item => flatItems.value.findIndex(entry => entry.key === item.key)

watch(query, () => {
  activeIndex.value = 0
})

watch(filteredItems, () => {
  if (activeIndex.value >= flatItems.value.length) activeIndex.value = 0
})

const close = () => {
  open.value = false
  query.value = ''
  activeIndex.value = 0
}

const show = async () => {
  open.value = true
  await blogStore.ensureLoaded()
  nextTick(() => inputRef.value?.focus())
}

const go = item => {
  if (!item) return
  close()
  router.push(item.path)
}

const selectCurrent = () => {
  go(flatItems.value[activeIndex.value])
}

const moveSelection = delta => {
  const len = flatItems.value.length
  if (!len) return
  activeIndex.value = (activeIndex.value + delta + len) % len
}

const onKeydown = e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
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
  width: min(560px, 100%);
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

.cmd-scroll {
  max-height: min(420px, 56vh);
  overflow-y: auto;
  padding: var(--space-2) var(--space-2) var(--space-3);
}

.cmd-group + .cmd-group {
  margin-top: 6px;
}

.cmd-group-title {
  margin: 6px 10px 4px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
}

.cmd-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.cmd-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 14px;
  color: var(--color-text);
  transition: background var(--duration-fast) var(--ease-out);
}

.cmd-item-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cmd-list li.is-active,
.cmd-list li:hover {
  background: var(--color-accent-light);
}

.cmd-item-hint {
  flex: 0 0 auto;
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.cmd-empty {
  margin: 0;
  padding: 24px 12px;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 14px;
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
