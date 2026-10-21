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
        <p class="about-eyebrow">
          {{ $t('about.eyebrow') }}
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

        <div class="about-actions no-print">
          <button
            class="btn btn-primary"
            type="button"
            @click="$router.push('/contact')"
          >
            {{ $t('about.contactCta') }}
          </button>
          <button
            class="btn btn-ghost about-ghost"
            type="button"
            @click="printResume"
          >
            {{ $t('about.resumeCta') }}
          </button>
        </div>
      </div>

      <div class="about-right">
        <div
          class="resume-rail"
          aria-hidden="true"
        />
        <article
          v-for="(job, idx) in workExperience"
          :key="`${job.company}-${job.period}`"
          class="resume-card reveal"
          :class="'reveal-delay-' + (idx + 1)"
          :style="{ '--offset': `${(idx % 2 === 0 ? -12 : 18)}px` }"
        >
          <button
            type="button"
            class="resume-card-toggle"
            :aria-expanded="expandedId === job.company + job.period"
            @click="toggleExpand(job)"
          >
            <div class="resume-card-top">
              <h3>{{ job.company }} <span class="resume-years">{{ job.period }}</span></h3>
              <svg
                class="resume-chevron"
                :class="{ open: expandedId === job.company + job.period }"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            <p class="resume-duty">
              {{ job.position }}
            </p>
          </button>
          <div
            v-show="expandedId === job.company + job.period"
            class="resume-detail"
          >
            <p>{{ job.description }}</p>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useReveal } from '@/composables/useReveal'

const { t, tm } = useI18n()
useReveal()

const expandedId = ref(null)

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

const toggleExpand = job => {
  const id = job.company + job.period
  expandedId.value = expandedId.value === id ? null : id
}

const printResume = () => {
  window.print()
}
</script>

<style scoped>
.about {
  position: relative;
  padding-top: var(--nav-height);
  min-height: 100vh;
  background: var(--color-hero-bg);
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
  font-size: clamp(48px, 8vw, 72px);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.05;
  margin-bottom: 12px;
}

.about-name .accent {
  color: var(--color-accent);
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
  font-size: 16px;
  line-height: 1.65;
  color: var(--color-text-secondary);
  max-width: 28em;
  margin-bottom: 24px;
}

.skill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 14px 16px;
  border-radius: var(--radius-lg);
  background: var(--color-accent-light);
  margin-bottom: 28px;
  max-width: 420px;
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

.about-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.about-ghost {
  border: 1px solid var(--color-hero-ghost-border);
  color: var(--color-hero-ghost-text);
  background: transparent;
  min-height: 42px;
  padding: 11px 18px;
}

.about-right {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-left: 28px;
}

.resume-rail {
  position: absolute;
  left: 8px;
  top: 12px;
  bottom: 12px;
  width: 0;
  border-left: 1.5px dashed var(--color-accent-border);
}

.resume-card {
  position: relative;
  margin-left: var(--offset, 0);
  background: var(--color-card-bg);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md), var(--color-card-glow);
  padding: 0;
  overflow: hidden;
}

.resume-card::before {
  content: '';
  position: absolute;
  left: -24px;
  top: 22px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-light);
}

.resume-card-toggle {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 18px 20px;
  cursor: pointer;
  color: inherit;
  font: inherit;
}

.resume-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 6px;
}

.resume-card-top h3 {
  font-size: 17px;
  font-weight: 600;
}

.resume-years {
  font-weight: 400;
  color: var(--color-text-tertiary);
  font-size: 14px;
}

.resume-duty {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.resume-chevron {
  flex-shrink: 0;
  color: var(--color-text-tertiary);
  transition: transform var(--duration-base) var(--ease-out);
}

.resume-chevron.open {
  transform: rotate(180deg);
}

.resume-detail {
  padding: 0 20px 18px;
  border-top: 1px solid var(--color-divider);
}

.resume-detail p {
  margin: 12px 0 0;
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.55;
}

@media (max-width: 860px) {
  .about-editorial {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .about-right {
    padding-left: 24px;
  }

  .resume-card {
    margin-left: 0 !important;
  }
}

@media print {
  .about-atmosphere,
  .about-actions,
  .resume-chevron {
    display: none !important;
  }

  .resume-detail {
    display: block !important;
  }
}
</style>
