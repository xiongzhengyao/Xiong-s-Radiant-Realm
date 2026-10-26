<template>
  <div class="projects">
    <div
      class="projects-atmosphere"
      aria-hidden="true"
    >
      <div class="projects-mesh" />
    </div>

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
        <template v-if="featuredProject">
          <article class="project-feature reveal">
            <div class="project-feature-cover">
              <CoverArt
                :seed="featuredProject.id"
                :category="coverCategory(featuredProject)"
                :image="featuredProject.image"
                size="lg"
              />
            </div>
            <div class="project-feature-copy">
              <p class="project-feature-meta">
                <span v-if="featuredProject.year">{{ featuredProject.year }}</span>
                <span v-if="featuredProject.role || featuredProject.company">{{ featuredProject.role || featuredProject.company }}</span>
              </p>
              <h2>{{ featuredProject.title }}</h2>
              <p v-if="featuredProject.description">
                {{ featuredProject.description }}
              </p>
              <p
                v-if="featuredProject.tags && featuredProject.tags[0]"
                class="project-feature-tag"
              >
                {{ featuredProject.tags[0] }}
              </p>
              <a
                v-if="featuredProject.url"
                :href="featuredProject.url"
                class="project-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ $t('projects.viewOnGithub') }}
              </a>
              <span
                v-else-if="featuredProject.private"
                class="project-private"
              >{{ $t('projects.privateRepo') }}</span>
            </div>
          </article>
          <ol
            v-if="restProjects.length"
            class="project-index"
          >
            <li
              v-for="project in restProjects"
              :key="project.id"
            >
              <template v-if="project.url">
                <a
                  class="project-index-row"
                  :href="project.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span class="project-index-year">{{ project.year }}</span>
                  <h3>{{ project.title }}</h3>
                  <span
                    v-if="project.tags && project.tags[0]"
                    class="project-index-tag"
                  >{{ project.tags[0] }}</span>
                </a>
              </template>
              <div
                v-else
                class="project-index-row is-static"
              >
                <span class="project-index-year">{{ project.year }}</span>
                <h3>{{ project.title }}</h3>
                <span
                  v-if="project.tags && project.tags[0]"
                  class="project-index-tag"
                >{{ project.tags[0] }}</span>
              </div>
            </li>
          </ol>
        </template>
        <div
          v-else
          class="empty-state"
        >
          <p>{{ showArchive ? $t('projects.archiveEmpty') : $t('projects.empty') }}</p>
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
  // Default: company work. Archive: personal / open-source tools.
  const pool = projects.value.filter(project => (
    showArchive.value ? project.group === 'personal' : project.group === 'company'
  ))
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

const featuredProject = computed(() => filteredProjects.value[0] || null)
const restProjects = computed(() => filteredProjects.value.slice(1))

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
  padding: 40px 0 18px;
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
  box-shadow: none;
  color: var(--color-text-tertiary);
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-sans);
  cursor: pointer;
}

.chip.active {
  background: transparent;
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}

html.dark .chip:not(.active) {
  background: transparent;
  border-color: transparent;
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  width: min(180px, 100%);
  padding: 6px 0;
  border-radius: 0;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(125, 106, 214, 0.35);
  color: var(--color-text-tertiary);
  box-shadow: none;
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

.project-feature {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(260px, 0.78fr);
  gap: clamp(28px, 4vw, 56px);
  align-items: center;
  margin-bottom: 72px;
}

.project-feature-cover {
  width: 100%;
  height: min(62vh, 560px);
  border-radius: 12px;
  overflow: hidden;
}

.project-feature-copy {
  padding-bottom: 8px;
}

.project-feature-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0 0 12px;
  font-size: 13px;
  letter-spacing: 0.04em;
  color: var(--color-accent);
}

.project-feature h2 {
  font-family: var(--font-serif);
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;
  margin: 0 0 10px;
}

.project-feature-copy > p {
  margin: 0 0 10px;
  font-size: 15px;
  line-height: 1.65;
  color: var(--color-text-secondary);
}

.project-feature-tag {
  font-size: 13px;
  letter-spacing: 0.04em;
  color: var(--color-text-tertiary);
}

.project-index {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid rgba(125, 106, 214, 0.28);
}

.project-index li {
  border-bottom: 1px solid rgba(125, 106, 214, 0.2);
}

.project-index-row {
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr) auto;
  gap: 16px;
  align-items: baseline;
  padding: 20px 0;
  color: inherit;
  text-decoration: none;
}

a.project-index-row:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
}

@media (hover: hover) and (pointer: fine) {
  a.project-index-row:hover h3 {
    color: var(--color-accent);
  }
}

.project-index-year,
.project-index-tag {
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.project-index h3 {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.3;
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

@media (max-width: 860px) {
  .project-feature {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .project-feature-cover {
    aspect-ratio: 4 / 5;
    max-height: 70vh;
  }

  .project-index-row {
    grid-template-columns: 88px minmax(0, 1fr);
  }

  .project-index-tag {
    display: none;
  }
}

@media (max-width: 640px) {

  .projects-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-wrap {
    min-width: 0;
  }
}
</style>
