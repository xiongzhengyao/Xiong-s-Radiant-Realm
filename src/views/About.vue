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

      <div class="about-right">
        <div
          class="resume-rail"
          aria-hidden="true"
        />
        <article
          v-for="(job, idx) in workExperience"
          :key="`${job.company}-${job.period}`"
          class="resume-card reveal"
          :class="['reveal-delay-' + (idx + 1), { 'is-mid': idx === 1 }]"
          :style="{ '--offset': `${[0, 84, 18][idx] || 0}px` }"
        >
          <h3>{{ job.company }} <span class="resume-years">{{ job.period }}</span></h3>
          <p class="resume-duty">
            {{ job.position }}
          </p>
          <p class="resume-detail">
            {{ job.description }}
          </p>
        </article>
      </div>
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
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 12px 0 0 36px;
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
  border-radius: 22px;
  box-shadow: var(--shadow-md), var(--color-card-glow);
  padding: 22px 24px;
  max-width: 280px;
}

.resume-card.is-mid::before {
  content: '';
  position: absolute;
  left: -32px;
  top: 28px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(183, 164, 243, 0.28);
}

html.dark .resume-card.is-mid::before {
  background: #d7c6ff;
}

.resume-card h3 {
  font-size: 20px;
  font-weight: 650;
  margin-bottom: 6px;
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
  display: none;
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
    margin-top: 8px;
    font-size: 13px;
    color: var(--color-text-secondary);
  }
}
</style>
