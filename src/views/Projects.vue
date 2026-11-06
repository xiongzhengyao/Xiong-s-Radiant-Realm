<template>
  <div class="projects">
    <section class="projects-header">
      <div class="container-wide">
        <p class="page-kicker">
          {{ $t('projects.eyebrow') }}
        </p>
        <h1 class="page-title reveal">
          {{ $t('projects.title') }}
        </h1>
        <p class="page-lede">
          {{ $t('projects.subtitle') }}
        </p>
        <p class="archive-note reveal">
          {{ $t('projects.archiveHint') }}
        </p>
        <div class="projects-controls reveal reveal-delay-1">
          <div
            class="filter-chips"
            role="tablist"
            :aria-label="$t('projects.groups.all')"
          >
            <button
              v-for="group in groupKeys"
              :key="group"
              type="button"
              class="chip"
              :class="{ active: selectedGroup === group }"
              @click="selectedGroup = group"
            >
              {{ $t(`projects.groups.${group}`) }}
            </button>
          </div>
          <div
            class="filter-chips"
            role="tablist"
          >
            <button
              type="button"
              class="chip"
              :class="{ active: selectedChip === 'all' }"
              @click="selectedChip = 'all'"
            >
              {{ $t('projects.all') }}
            </button>
            <button
              v-for="chip in chipKeys"
              :key="chip"
              type="button"
              class="chip"
              :class="{ active: selectedChip === chip }"
              @click="selectedChip = chip"
            >
              {{ $t(`projects.chips.${chip}`) }}
            </button>
          </div>
          <div class="search-wrap">
            <input
              v-model="searchInput"
              type="search"
              class="search-input"
              :placeholder="$t('projects.searchPlaceholder')"
            >
          </div>
        </div>
      </div>
    </section>

    <section class="reel">
      <template v-if="filteredProjects.length">
        <article
          v-for="(project, idx) in filteredProjects"
          :id="`project-${project.id}`"
          :key="project.id"
          class="reel-scene reveal"
          :class="[
            'reveal-delay-' + Math.min(idx + 1, 3),
            { 'is-focused': focusedId === project.id }
          ]"
        >
          <div
            class="reel-still"
            role="link"
            tabindex="0"
            :aria-label="project.title"
            @click="openProject(project)"
            @keydown.enter.prevent="openProject(project)"
          >
            <CoverArt
              :seed="project.id"
              :category="coverCategory(project)"
              :image="project.image"
              size="lg"
            />
            <div class="reel-veil" />
          </div>
          <div class="reel-caption">
            <p class="reel-meta">
              <span v-if="project.year">{{ project.year }}</span>
              <span v-if="project.role || project.company">{{ project.role || project.company }}</span>
              <span class="reel-group">{{ $t(`projects.groups.${project.group === 'personal' ? 'personal' : 'company'}`) }}</span>
            </p>
            <h2>{{ project.title }}</h2>
            <p
              v-if="project.description"
              class="reel-desc"
            >
              {{ project.description }}
            </p>
            <p
              v-if="project.tags && project.tags[0]"
              class="reel-tag"
            >
              {{ project.tags[0] }}
            </p>
            <div class="reel-actions">
              <button
                v-if="project.case"
                type="button"
                class="project-link project-link--button"
                @click.stop="openProject(project)"
              >
                {{ focusedId === project.id ? $t('projects.caseClose') : $t('projects.caseOpen') }}
              </button>
              <a
                v-if="project.url"
                :href="project.url"
                class="project-link"
                target="_blank"
                rel="noopener noreferrer"
                @click.stop
              >
                {{ $t('projects.viewOnGithub') }}
              </a>
              <span
                v-else-if="project.private"
                class="project-private"
              >{{ $t('projects.privateRepo') }}</span>
            </div>
          </div>
          <div
            v-if="focusedId === project.id && project.case"
            class="case-panel"
          >
            <div class="case-grid">
              <div>
                <p class="case-label">
                  {{ $t('projects.caseProblem') }}
                </p>
                <p>{{ project.case.problem }}</p>
              </div>
              <div>
                <p class="case-label">
                  {{ $t('projects.caseApproach') }}
                </p>
                <p>{{ project.case.approach }}</p>
              </div>
              <div>
                <p class="case-label">
                  {{ $t('projects.caseResult') }}
                </p>
                <p>{{ project.case.result }}</p>
              </div>
            </div>
          </div>
        </article>
      </template>
      <div
        v-else
        class="empty-state"
      >
        <p>{{ selectedGroup === 'personal' ? $t('projects.archiveEmpty') : $t('projects.empty') }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReveal } from '@/composables/useReveal'
import { useCareer } from '@/composables/useCareer'
import { useDebouncedRef } from '@/composables/useDebouncedRef'
import CoverArt from '@/components/CoverArt.vue'

const props = defineProps({
  id: { type: String, default: '' }
})

const route = useRoute()
const router = useRouter()
const { projects } = useCareer()
const { observe } = useReveal()

const groupFromRoute = () => {
  if (route.query.archive === '1' || route.query.group === 'personal') return 'personal'
  if (route.query.group === 'company') return 'company'
  return 'all'
}

const selectedGroup = ref(groupFromRoute())
const selectedChip = ref('all')
const searchInput = ref('')
const searchQuery = useDebouncedRef(searchInput, 200)
const chipKeys = ['firmware', 'tools', 'app']
const groupKeys = ['all', 'company', 'personal']
const focusedId = computed(() => String(props.id || route.params.id || route.query.id || ''))

const filteredProjects = computed(() => {
  const q = String(searchQuery.value || '').toLowerCase().trim()
  return projects.value.filter(project => {
    const groupOk = selectedGroup.value === 'all' || project.group === selectedGroup.value
    const chipOk = selectedChip.value === 'all' || project.chip === selectedChip.value
    if (!groupOk || !chipOk) return false
    if (!q) return true
    const hay = [project.title, project.role, project.description, project.company, ...(project.tags || [])]
      .join(' ')
      .toLowerCase()
    return hay.includes(q)
  })
})

const coverCategory = project => {
  if (project.chip === 'app') return 'notes'
  if (project.chip === 'tools') return 'linux'
  return 'sensor'
}

const openProject = project => {
  if (!project?.id) return
  if (focusedId.value === project.id) {
    router.replace({ name: 'Projects', query: route.query })
    return
  }
  router.push({ name: 'ProjectDetail', params: { id: project.id }, query: route.query })
}

const syncGroupToRoute = group => {
  const query = { ...route.query }
  delete query.archive
  if (group === 'all') delete query.group
  else query.group = group
  router.replace({ name: route.name, params: route.params, query })
}

const focusProject = async () => {
  const id = focusedId.value
  if (!id) return
  await nextTick()
  const el = document.getElementById(`project-${id}`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

watch(selectedGroup, group => {
  syncGroupToRoute(group)
})

watch(
  () => [route.query.group, route.query.archive],
  () => {
    selectedGroup.value = groupFromRoute()
  }
)

watch(filteredProjects, () => {
  nextTick(() => {
    observe()
    focusProject()
  })
})

watch(focusedId, () => {
  focusProject()
})

onMounted(() => {
  observe()
  focusProject()
})
</script>

<style scoped>
.projects {
  position: relative;
  padding-top: var(--nav-height);
  padding-bottom: calc(var(--cinema-letterbox) + 64px);
  min-height: 100vh;
  background: transparent;
}

.projects-header {
  padding: 36px 0 20px;
}

.projects-header h1 {
  margin-bottom: 12px;
}

.archive-note {
  margin: -8px 0 16px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.projects-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  justify-content: flex-start;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 4px 0 6px;
  margin-right: 16px;
  border: none;
  border-bottom: 1px solid transparent;
  border-radius: 0;
  background: transparent;
  color: var(--color-text-tertiary);
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-sans);
  cursor: pointer;
  transition:
    color var(--duration-fast) var(--ease-cinema),
    border-color var(--duration-fast) var(--ease-cinema);
}

.chip.active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}

@media (hover: hover) and (pointer: fine) {
  .chip:hover {
    color: var(--color-text);
  }
}

.search-wrap {
  width: min(180px, 100%);
  padding: 6px 0;
  border-bottom: 1px solid var(--color-input-border);
}

.search-input {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--color-text);
  font-size: 14px;
  font-family: var(--font-sans);
  outline: none;
}

.reel {
  display: flex;
  flex-direction: column;
  gap: 72px;
  max-width: 1320px;
  margin: 0 auto;
  padding: 28px 24px 0;
}

.reel-scene {
  position: relative;
  scroll-margin-top: calc(var(--nav-height) + 24px);
  border-radius: 2px;
  transition: box-shadow var(--duration-base) var(--ease-cinema);
}

.reel-scene.is-focused {
  box-shadow: 0 0 0 1px rgba(196, 178, 246, 0.45);
}

.reel-still {
  position: relative;
  aspect-ratio: 2.39 / 1;
  overflow: hidden;
  border-radius: 2px;
  background: #0a0812;
}

.reel-still :deep(.cover-art),
.reel-still :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 1.4s var(--ease-cinema, ease);
}

@media (hover: hover) and (pointer: fine) {
  .reel-scene:hover .reel-still :deep(.cover-art),
  .reel-scene:hover .reel-still :deep(img) {
    transform: scale(1.03);
  }
}

.reel-veil {
  position: absolute;
  inset: 0;
  /* Stronger caption track so white airframes stay readable */
  background:
    linear-gradient(90deg, rgba(5, 4, 10, 0.88) 0%, rgba(5, 4, 10, 0.42) 42%, rgba(5, 4, 10, 0.28) 70%, rgba(5, 4, 10, 0.5) 100%),
    linear-gradient(0deg, rgba(5, 4, 10, 0.86) 0%, rgba(5, 4, 10, 0.28) 42%, transparent 62%);
  pointer-events: none;
}

.reel-caption {
  position: absolute;
  left: clamp(16px, 3vw, 36px);
  right: clamp(16px, 3vw, 36px);
  bottom: clamp(16px, 3vw, 32px);
  max-width: 34em;
  color: #f3efe8;
  z-index: 1;
  text-shadow: 0 1px 18px rgba(5, 4, 10, 0.45);
}

.reel-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  margin: 0 0 10px;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(196, 178, 246, 0.9);
}

.reel-group {
  opacity: 0.88;
}

.reel-caption h2 {
  margin: 0 0 12px;
  font-family: var(--font-serif);
  font-size: clamp(28px, 3.6vw, 48px);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.1;
  text-wrap: balance;
  text-shadow: 0 2px 24px rgba(5, 4, 10, 0.55);
}

.reel-desc {
  margin: 0 0 12px;
  font-size: 15px;
  line-height: 1.55;
  color: rgba(243, 239, 232, 0.78);
}

.reel-tag,
.project-private {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.08em;
  color: rgba(243, 239, 232, 0.72);
}

.reel-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 18px;
  margin-top: 8px;
  align-items: center;
}

.project-link {
  display: inline-block;
  margin-top: 0;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--cinema-violet-soft, #c4b2f6);
  text-decoration: none;
  transition: opacity var(--duration-fast) var(--ease-cinema);
}

.project-link--button {
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  font: inherit;
}

@media (hover: hover) and (pointer: fine) {
  .project-link:hover {
    opacity: 0.72;
  }
}

.case-panel {
  margin-top: 18px;
  padding: 22px 24px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: color-mix(in srgb, var(--color-bg) 88%, var(--color-accent) 12%);
  color: var(--color-text);
}

.case-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.case-label {
  margin: 0 0 8px;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.case-grid p:last-child {
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  color: var(--color-text-secondary);
}

@media (max-width: 860px) {
  .case-grid {
    grid-template-columns: 1fr;
  }
}

.empty-state {
  text-align: center;
  padding: 64px 16px;
  color: var(--color-text-secondary);
}

@media (prefers-reduced-motion: reduce) {
  .reel-still :deep(.cover-art),
  .reel-still :deep(img),
  .chip,
  .project-link {
    transition: none;
  }
}

@media (max-width: 720px) {
  .reel-still {
    aspect-ratio: 16 / 9;
  }

  .reel {
    gap: 48px;
    padding: 20px 16px 0;
  }
}
</style>
