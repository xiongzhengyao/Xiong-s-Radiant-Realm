<template>
  <div class="projects">
    <div
      class="projects-atmosphere"
      aria-hidden="true"
    >
      <div class="projects-mesh" />
      <div class="projects-snow" />
    </div>

    <section class="projects-header">
      <div class="container-wide">
        <h1 class="reveal">
          {{ $t('projects.title') }}
        </h1>
        <p
          v-if="showArchive"
          class="archive-note reveal"
        >
          {{ $t('projects.archiveHint') }}
        </p>
        <div class="projects-controls reveal reveal-delay-1">
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
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
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
              v-model="searchInput"
              type="search"
              class="search-input"
              :placeholder="$t('projects.searchPlaceholder')"
            >
          </div>
        </div>
      </div>
    </section>

    <section class="section projects-body">
      <div class="container-wide">
        <div
          v-if="filteredProjects.length"
          class="projects-grid"
        >
          <article
            v-for="(project, index) in filteredProjects"
            :key="project.id"
            class="project-card reveal"
            :class="'reveal-delay-' + ((index % 3) + 1)"
          >
            <div class="project-cover">
              <CoverArt
                :seed="project.id"
                :category="coverCategory(project)"
                :image="project.image"
                size="lg"
              />
            </div>
            <div class="project-body">
              <h3>{{ project.title }}</h3>
              <p class="project-role">
                {{ $t('projects.rolePrefix') }}: {{ project.role || project.company }}
              </p>
              <div class="project-tags">
                <span
                  v-for="tag in project.tags"
                  :key="tag"
                  class="tag tag-accent"
                >{{ tag }}</span>
              </div>
              <div
                v-if="project.url || project.private"
                class="project-footer"
              >
                <a
                  v-if="project.url"
                  :href="project.url"
                  class="project-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ $t('projects.viewOnGithub') }}
                </a>
                <span
                  v-else-if="project.private"
                  class="project-private"
                >{{ $t('projects.privateRepo') }}</span>
              </div>
            </div>
          </article>
        </div>
        <div
          v-else
          class="empty-state"
        >
          <p>{{ $t('projects.empty') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useReveal } from '@/composables/useReveal'
import { useCareer } from '@/composables/useCareer'
import { useDebouncedRef } from '@/composables/useDebouncedRef'
import CoverArt from '@/components/CoverArt.vue'

const route = useRoute()
const { projects } = useCareer()
const { observe } = useReveal()
const showArchive = computed(() => route.query.archive === '1')

const selectedChip = ref('all')
const searchInput = ref('')
const searchQuery = useDebouncedRef(searchInput, 200)
const chipKeys = ['firmware', 'tools', 'app']

const filteredProjects = computed(() => {
  const q = String(searchQuery.value || '').toLowerCase().trim()
  const pool = showArchive.value
    ? projects.value.filter(project => project.group === 'personal')
    : projects.value
  return pool.filter(project => {
    const chipOk = selectedChip.value === 'all' || project.chip === selectedChip.value
    if (!chipOk) return false
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

onMounted(() => observe())

watch(filteredProjects, () => {
  nextTick(() => observe())
})
</script>

<style scoped>
.projects {
  position: relative;
  padding-top: var(--nav-height);
  min-height: 100vh;
  background: transparent;
  overflow: hidden;
}

.projects-atmosphere {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.projects-mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 40% at 75% 20%, var(--color-mesh-1) 0%, transparent 55%),
    radial-gradient(ellipse 40% 35% at 15% 80%, var(--color-mesh-2) 0%, transparent 50%);
}

.projects-snow {
  position: absolute;
  inset: 0;
  opacity: 0;
  background-image:
    radial-gradient(1.5px 1.5px at 15% 25%, #fff 0%, transparent 100%),
    radial-gradient(1px 1px at 55% 40%, #fff 0%, transparent 100%),
    radial-gradient(2px 2px at 80% 70%, #fff 0%, transparent 100%);
}

html.dark .projects-snow {
  opacity: 0.4;
}

.projects-header,
.projects-body {
  position: relative;
  z-index: 1;
}

.projects-body.section {
  padding-top: 0;
  padding-bottom: 80px;
}

.projects-header {
  padding: var(--space-12) 0 var(--space-6);
}

.projects-header h1 {
  font-size: clamp(36px, 5vw, 48px);
  margin-bottom: var(--space-6);
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
  padding: 8px 16px;
  border-radius: var(--radius-full);
  border: none;
  background: var(--color-pill-bg);
  box-shadow: var(--shadow-xs);
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out),
              color var(--duration-fast) var(--ease-out),
              border-color var(--duration-fast) var(--ease-out);
}

.chip.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-accent-contrast);
}

html.dark .chip:not(.active) {
  background: transparent;
  border-color: var(--color-accent-border);
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  width: min(260px, 100%);
  padding: 10px 16px;
  border-radius: var(--radius-full);
  background: var(--color-card-bg);
  border: 1px solid var(--color-card-border);
  color: var(--color-text-tertiary);
  box-shadow: var(--shadow-sm), var(--color-card-glow);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--color-text);
  font-size: 14px;
  font-family: var(--font-sans);
  outline: none;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.project-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm), var(--color-card-glow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.project-cover {
  height: 168px;
  margin: 12px 12px 0;
  border-radius: 16px;
  overflow: hidden;
}

.project-body {
  padding: 18px 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.project-body h3 {
  font-size: 18px;
  line-height: 1.3;
}

.project-role {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
  padding-top: 8px;
}

.project-footer {
  padding-top: 4px;
}

.project-link {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-accent);
}

.project-private {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.empty-state {
  text-align: center;
  padding: 64px 16px;
  color: var(--color-text-secondary);
}

@media (max-width: 960px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 640px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }

  .projects-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-wrap {
    min-width: 0;
  }
}
</style>
