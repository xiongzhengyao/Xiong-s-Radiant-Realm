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
          <div
            v-if="restProjects.length"
            class="projects-grid"
          >
            <article
              v-for="(project, index) in restProjects"
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
                <p
                  v-if="project.tags && project.tags[0]"
                  class="project-card-tag"
                >
                  {{ project.tags[0] }}
                </p>
              </div>
            </article>
          </div>
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
  opacity: 0;
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
  width: min(260px, 100%);
  padding: 10px 16px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid rgba(125, 106, 214, 0.28);
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
  margin-bottom: 36px;
}

.project-feature-cover {
  width: 100%;
  aspect-ratio: 16 / 8;
  border-radius: 10px;
  overflow: hidden;
}

.project-feature-copy {
  max-width: 40em;
  padding-top: 18px;
}

.project-feature-meta {
  display: flex;
  gap: 12px;
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
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

.project-feature-tag,
.project-card-tag {
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--color-text-tertiary);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.project-card {
  background: transparent;
  border: none;
  box-shadow: none;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.project-cover {
  height: 180px;
  overflow: hidden;
}

.project-body {
  padding: 12px 2px 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.project-body h3 {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 700;
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

@media (max-width: 960px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 640px) {
  .project-feature-cover {
    aspect-ratio: 4 / 3;
  }

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
