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
        <div class="projects-grid">
          <article
            v-for="(project, index) in projectList"
            :key="project.id"
            class="project-card reveal"
            :class="['reveal-delay-' + (index + 1), { 'project-card--featured': index === 0 }]"
          >
            <div class="project-card-header">
              <span class="project-company">{{ project.company }}</span>
              <span class="project-year">{{ project.year }}</span>
            </div>
            <h2>{{ project.title }}</h2>
            <p class="project-desc">{{ project.description }}</p>
            <div class="project-tags">
              <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useReveal } from '@/composables/useReveal'
import { useCareer } from '@/composables/useCareer'

const { projects: projectList } = useCareer()
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
  font-size: clamp(36px, 5vw, 52px);
  letter-spacing: -0.03em;
  margin-bottom: var(--space-3);
}

.projects-hero-sub {
  font-size: 18px;
  color: var(--color-text-secondary);
  line-height: 1.58;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-5);
}

.project-card {
  padding: var(--space-8);
  border-radius: var(--radius-xl);
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

.project-card h2 {
  font-size: 22px;
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

@media (hover: hover) and (pointer: fine) {
  .project-card:hover {
    border-color: rgba(0, 113, 227, 0.25);
    transform: translateY(-2px);
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
