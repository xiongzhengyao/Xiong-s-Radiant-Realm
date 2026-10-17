<template>
  <div class="projects">
    <section class="projects-hero">
      <div class="projects-hero-mesh" aria-hidden="true" />
      <div class="container-wide projects-hero-inner">
        <span class="section-eyebrow reveal">{{ $t('projects.eyebrow') }}</span>
        <h1 class="reveal reveal-delay-1">{{ $t('projects.title') }}</h1>
        <p class="projects-hero-sub reveal reveal-delay-2">{{ $t('projects.subtitle') }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container-wide">
        <div class="projects-group">
          <h2 class="projects-group-title reveal">{{ $t('projects.groups.company') }}</h2>
          <div class="projects-grid">
            <article
              v-for="(project, index) in companyProjects"
              :key="project.id"
              class="project-card reveal"
              :class="['reveal-delay-' + (index + 1), { 'project-card--featured': index === 0 }]"
            >
              <div class="project-card-header">
                <span class="project-company">{{ project.company }}</span>
                <span class="project-year">{{ project.year }}</span>
              </div>
              <h3>{{ project.title }}</h3>
              <p class="project-desc">{{ project.description }}</p>
              <div class="project-tags">
                <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </article>
          </div>
        </div>

        <div class="projects-group projects-group--personal">
          <h2 class="projects-group-title reveal">{{ $t('projects.groups.personal') }}</h2>
          <div class="projects-grid">
            <article
              v-for="(project, index) in personalProjects"
              :key="project.id"
              class="project-card reveal"
              :class="'reveal-delay-' + (index + 1)"
            >
              <div class="project-card-header">
                <span class="project-company">{{ project.company }}</span>
                <span class="project-year">{{ project.year }}</span>
              </div>
              <h3>{{ project.title }}</h3>
              <p class="project-desc">{{ project.description }}</p>
              <div class="project-tags">
                <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <div class="project-footer">
                <a
                  v-if="project.url"
                  :href="project.url"
                  class="project-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ $t('projects.viewOnGithub') }}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
                <span v-else-if="project.private" class="project-private">{{ $t('projects.privateRepo') }}</span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useReveal } from '@/composables/useReveal'
import { useCareer } from '@/composables/useCareer'

const { companyProjects, personalProjects } = useCareer()
useReveal()
</script>

<style scoped>
.projects {
  padding-top: var(--nav-height);
  min-height: 100vh;
  background: var(--color-bg);
}

.projects-hero {
  position: relative;
  padding: var(--space-16) 0 var(--space-8);
  overflow: hidden;
}

.projects-hero-mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 45% at 70% 30%, var(--color-mesh-1) 0%, transparent 55%),
    radial-gradient(ellipse 40% 35% at 20% 80%, var(--color-mesh-2) 0%, transparent 50%);
  pointer-events: none;
}

.projects-hero-inner {
  position: relative;
  max-width: 640px;
}

.projects-hero-inner h1 {
  font-family: var(--font-mono);
  font-size: clamp(36px, 5vw, 52px);
  letter-spacing: -0.03em;
  margin-bottom: var(--space-3);
}

.projects-hero-sub {
  font-size: 18px;
  color: var(--color-text-secondary);
  line-height: 1.58;
}

.projects-group + .projects-group {
  margin-top: var(--space-16);
}

.projects-group-title {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-5);
}

.project-card {
  padding: var(--space-8);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  transition: border-color var(--duration-base) var(--ease-out),
              transform var(--duration-base) var(--ease-out);
}

.project-card--featured {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-4) var(--space-8);
  align-items: start;
}

.project-card--featured .project-desc {
  grid-column: 1;
}

.project-card--featured .project-tags {
  grid-column: 1;
}

.project-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.project-company {
  font-size: 11px;
  font-family: var(--font-mono);
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.project-year {
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--color-text-tertiary);
}

.project-card h3 {
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-3);
}

.project-desc {
  font-size: 15px;
  line-height: 1.55;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-4);
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.project-footer {
  margin-top: var(--space-5);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.project-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-accent);
}

.project-private {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-tertiary);
}

@media (hover: hover) and (pointer: fine) {
  .project-card:hover {
    border-color: var(--color-accent-border);
    transform: translateY(-2px);
  }

  .project-link:hover {
    color: var(--color-accent-hover);
  }
}

@media (max-width: 734px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }

  .project-card--featured {
    grid-template-columns: 1fr;
  }
}
</style>
