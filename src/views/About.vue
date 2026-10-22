<template>
  <div class="about">
    <div
      class="about-atmosphere"
      aria-hidden="true"
    >
      <div class="about-mesh" />
      <div class="about-stars" />
    </div>

    <section class="about-editorial">
      <div class="about-left reveal">
        <h1 class="about-name">
          <template
            v-for="(ch, i) in nameChars"
            :key="i"
          >
            <span :class="{ accent: ch === accentChar }">{{ ch }}</span>
          </template>
        </h1>
        <p class="about-title">
          {{ $t('about.profile.title') }}
        </p>
        <p class="about-bio">
          {{ $t('about.intro') }}
        </p>

        <div class="skill-row">
          <span
            v-for="skill in skillsFlat"
            :key="skill"
            class="tag tag-accent"
          >{{ skill }}</span>
        </div>

        <div class="education-block">
          <h3>{{ $t('about.educationLabel') }}</h3>
          <p>{{ $t('about.educationSummary') }}</p>
        </div>

        <p class="about-links no-print">
          <button
            type="button"
            @click="$router.push('/contact')"
          >
            {{ $t('about.contactCta') }}
          </button>
          <button
            type="button"
            @click="printResume"
          >
            {{ $t('about.resumeCta') }}
          </button>
        </p>
      </div>

      <ol class="about-right timeline">
        <li
          v-for="(job, idx) in workExperience"
          :key="`${job.company}-${job.period}`"
          class="timeline-item reveal"
          :class="['reveal-delay-' + (idx + 1), { 'is-current': idx === 0 }]"
        >
          <time class="timeline-time">{{ job.period }}</time>
          <span
            class="timeline-dot"
            aria-hidden="true"
          />
          <article class="timeline-card">
            <h3>{{ job.company }}</h3>
            <p class="timeline-role">
              {{ job.position }}
            </p>
            <p
              v-if="job.description && job.description !== job.position"
              class="timeline-detail"
            >
              {{ job.description }}
            </p>
          </article>
        </li>
      </ol>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useReveal } from '@/composables/useReveal'

const { t, tm } = useI18n()
useReveal()

const nameFull = computed(() => t('about.profile.name'))
const accentChar = computed(() => t('about.profile.nameAccent'))
const nameChars = computed(() => Array.from(nameFull.value))

const skillsFlat = computed(() => {
  const items = tm('about.skillsFlat')
  return Array.isArray(items) ? items : ['C/C++', 'Python', 'ARM', 'Sensor', 'Linux']
})

const workExperience = computed(() => {
  const items = tm('about.work')
  return Array.isArray(items) ? items : []
})

const printResume = () => {
  window.print()
}
</script>

<style scoped>
.about {
  position: relative;
  padding-top: var(--nav-height);
  min-height: 100vh;
  background: transparent;
  overflow: hidden;
}

.about-atmosphere {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.about-mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 40% at 20% 25%, var(--color-mesh-1) 0%, transparent 60%),
    radial-gradient(ellipse 45% 35% at 80% 70%, var(--color-mesh-2) 0%, transparent 55%);
}

.about-stars {
  position: absolute;
  inset: 0;
  opacity: 0;
  background-image:
    radial-gradient(1.5px 1.5px at 10% 20%, #fff 0%, transparent 100%),
    radial-gradient(1px 1px at 30% 55%, #fff 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 70% 30%, #fff 0%, transparent 100%),
    radial-gradient(1px 1px at 85% 65%, #fff 0%, transparent 100%),
    radial-gradient(1px 1px at 50% 80%, #fff 0%, transparent 100%);
}

html.dark .about-stars {
  opacity: 0.45;
}

.about-editorial {
  position: relative;
  z-index: 1;
  max-width: var(--max-width-wide);
  margin: 0 auto;
  padding: clamp(40px, 8vh, 80px) 24px 96px;
  display: grid;
  grid-template-columns: minmax(280px, 1fr) minmax(300px, 1fr);
  gap: clamp(40px, 6vw, 80px);
  align-items: start;
}

.about-name {
  font-family: var(--font-serif);
  font-size: clamp(76px, 9vw, 118px);
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1;
  margin-bottom: 18px;
}

.about-name .accent {
  color: #9a8bc4;
}

html.dark .about-name .accent {
  color: #cbb6ff;
}

.about-title {
  font-size: 16px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.about-eyebrow {
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-mist);
  margin-bottom: 18px;
}

.about-bio {
  font-size: 18px;
  line-height: 1.7;
  color: var(--color-text);
  max-width: 16em;
  margin-bottom: 28px;
  white-space: pre-line;
}

.skill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.7);
  margin-bottom: 28px;
  max-width: 460px;
}

html.dark .skill-row {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(196, 181, 253, 0.16);
}

.education-block h3 {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  margin-bottom: 6px;
}

.education-block p {
  font-size: 15px;
  color: var(--color-text);
  margin-bottom: 28px;
}

.about-links {
  display: flex;
  gap: 16px;
  margin-top: -8px;
}

.about-links button {
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  font-size: 13px;
  color: var(--color-text-tertiary);
  cursor: pointer;
}

.about-right {
  --time-col: 132px;
  --dot-col: 18px;
  position: relative;
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
}

.timeline-item {
  position: relative;
  display: grid;
  grid-template-columns: var(--time-col) var(--dot-col) minmax(0, 1fr);
  align-items: start;
}

.timeline-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: calc(var(--time-col) + var(--dot-col) / 2);
  top: 28px;
  bottom: -56px;
  border-left: 1.5px dashed var(--color-accent-border);
  transform: translateX(-0.75px);
}

.timeline-item + .timeline-item {
  margin-top: 28px;
}

.timeline-time {
  padding: 16px 16px 0 0;
  text-align: right;
  font-size: 13px;
  line-height: 1.45;
  letter-spacing: 0.02em;
  color: var(--color-text-tertiary);
}

.timeline-item.is-current .timeline-time {
  color: var(--color-text);
  font-weight: 600;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  margin: 22px auto 0;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(183, 164, 243, 0.32);
  position: relative;
  z-index: 1;
}

.timeline-dot::after {
  content: '';
  position: absolute;
  left: 12px;
  top: 5px;
  width: 16px;
  height: 1.5px;
  background: var(--color-accent-border);
}

.timeline-item.is-current .timeline-dot {
  background: #9b87e8;
  box-shadow: 0 0 0 5px rgba(183, 164, 243, 0.42);
}

html.dark .timeline-dot {
  background: #1a1428;
  box-shadow: 0 0 0 4px rgba(196, 170, 255, 0.28);
}

html.dark .timeline-item.is-current .timeline-dot {
  background: #d7c6ff;
  box-shadow: 0 0 0 5px rgba(196, 170, 255, 0.35);
}

.timeline-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-card-border);
  border-radius: 22px;
  box-shadow: var(--shadow-md), var(--color-card-glow);
  padding: 18px 22px 20px;
  max-width: 420px;
}

.timeline-card h3 {
  font-size: 20px;
  font-weight: 650;
  margin-bottom: 6px;
}

.timeline-role,
.timeline-detail {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.timeline-detail {
  margin-top: 8px;
}

@media (max-width: 860px) {
  .about-editorial {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .about-right {
    --time-col: 0px;
  }

  .timeline-item {
    grid-template-columns: 18px minmax(0, 1fr);
  }

  .timeline-time {
    grid-column: 2;
    grid-row: 1;
    padding: 0 0 8px 14px;
    text-align: left;
  }

  .timeline-dot {
    grid-column: 1;
    grid-row: 1 / span 2;
  }

  .timeline-card {
    grid-column: 2;
    grid-row: 2;
    max-width: none;
    margin-left: 14px;
  }

  .timeline-item:not(:last-child)::before {
    left: 9px;
  }
}

@media print {
  .about-atmosphere,
  .about-actions {
    display: none !important;
  }

  .timeline-detail {
    display: block !important;
  }
}
</style>
