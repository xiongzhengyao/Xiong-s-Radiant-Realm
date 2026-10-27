<template>
  <div class="about">
    <div
      class="about-atmosphere"
      aria-hidden="true"
    >
      <div class="about-mesh" />
    </div>

    <section class="about-board">
      <aside class="about-side">
        <div class="profile-card reveal">
          <p class="page-kicker profile-kicker">
            {{ $t('about.eyebrow') }}
          </p>
          <div class="profile-head">
            <div class="avatar-wrap">
              <img
                v-if="!imageError"
                class="avatar"
                :src="profileImage"
                :alt="nameFull"
                @error="imageError = true"
              >
              <div
                v-else
                class="avatar-fallback"
              >
                ZY
              </div>
            </div>
            <div>
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
            </div>
          </div>
          <p class="about-bio">
            {{ $t('about.intro') }}
          </p>
          <ul class="profile-meta">
            <li>{{ $t('about.profile.location') }}</li>
            <li>{{ $t('about.profile.years', { n: careerYears }) }}</li>
            <li>
              <a :href="`mailto:${email}`">{{ email }}</a>
            </li>
          </ul>
          <div class="profile-actions no-print">
            <button
              type="button"
              class="btn btn-primary"
              @click="$router.push('/contact')"
            >
              {{ $t('about.contactCta') }}
            </button>
            <button
              type="button"
              class="btn btn-outline"
              @click="printResume"
            >
              {{ $t('about.resumeCta') }}
            </button>
          </div>
        </div>

        <div class="skills-panel reveal reveal-delay-1">
          <h2>{{ $t('about.sections.skills') }}</h2>
          <div
            v-for="group in skillGroups"
            :key="group.name"
            class="skill-group"
          >
            <h3>{{ group.name }}</h3>
            <p class="skill-line">
              {{ group.items.join(' · ') }}
            </p>
          </div>
        </div>
      </aside>

      <div class="about-main">
        <section class="timeline-section">
          <header class="section-head reveal">
            <p>{{ $t('about.experience.eyebrow') }}</p>
            <h2>{{ $t('about.sections.experience') }}</h2>
          </header>
          <ol class="timeline">
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
                <h3>{{ job.position }}</h3>
                <p class="timeline-org">
                  {{ job.company }}
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

        <section class="timeline-section">
          <header class="section-head reveal">
            <h2>{{ $t('about.sections.education') }}</h2>
          </header>
          <ol class="timeline">
            <li
              v-for="(edu, idx) in educationHistory"
              :key="`${edu.school}-${edu.period}`"
              class="timeline-item reveal"
              :class="'reveal-delay-' + (idx + 1)"
            >
              <time class="timeline-time">{{ edu.period }}</time>
              <span
                class="timeline-dot"
                aria-hidden="true"
              />
              <article class="timeline-card">
                <h3>{{ edu.degree }}</h3>
                <p class="timeline-org">
                  {{ edu.school }} · {{ edu.major }}
                </p>
                <p
                  v-if="edu.details"
                  class="timeline-detail"
                >
                  {{ edu.details }}
                </p>
              </article>
            </li>
          </ol>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useReveal } from '@/composables/useReveal'
import { APP_CONFIG } from '@/utils/constants'
import { getCareerYears } from '@/utils/careerYears'

const { t, tm } = useI18n()
useReveal()

const email = APP_CONFIG.EMAIL
const profileImage = APP_CONFIG.IMAGES.PROFILE
const imageError = ref(false)

const nameFull = computed(() => t('about.profile.name'))
const accentChar = computed(() => t('about.profile.nameAccent'))
const nameChars = computed(() => Array.from(nameFull.value))
const careerYears = computed(() => getCareerYears())

const asList = value => (Array.isArray(value) ? value : [])

const skillGroups = computed(() => asList(tm('about.skillGroups')))
const workExperience = computed(() => asList(tm('about.work')))
const educationHistory = computed(() => asList(tm('about.education')))

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


.about-board {
  position: relative;
  z-index: 1;
  max-width: var(--max-width-wide);
  margin: 0 auto;
  padding: 48px 28px calc(var(--cinema-letterbox) + 96px);
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  gap: 36px;
  align-items: start;
}

.about-side {
  position: sticky;
  top: calc(var(--nav-height) + 20px);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-card,
.skills-panel,
.timeline-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-card-border);
  border-radius: 4px;
  box-shadow: none;
}

.profile-card {
  padding: 22px 22px 20px;
}

.profile-kicker {
  margin: 0 0 14px;
}


.profile-head {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.avatar-wrap {
  width: 84px;
  height: 84px;
  flex: 0 0 84px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid var(--color-card-border);
  background: var(--color-bg-secondary);
}

.avatar,
.avatar-fallback {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-tertiary);
}

.about-name {
  font-family: var(--font-serif);
  font-size: clamp(36px, 4vw, 48px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.05;
  margin: 0 0 8px;
}

.about-name .accent {
  color: var(--color-accent);
}

.about-title {
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  color: var(--color-text-secondary);
}

.about-bio {
  margin: 0 0 14px;
  font-size: 15px;
  line-height: 1.65;
  color: var(--color-text);
  white-space: pre-line;
}

.profile-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  margin: 0 0 16px;
  padding: 0;
  list-style: none;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.profile-meta a {
  color: inherit;
  text-decoration: none;
}

.profile-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.profile-actions .btn {
  min-height: 40px;
  padding: 8px 16px;
}

.skills-panel {
  padding: 18px 20px 8px;
}

.skills-panel > h2,
.section-head h2 {
  font-family: var(--font-serif);
  font-size: clamp(22px, 2.2vw, 28px);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 16px;
}

.skill-group {
  padding: 12px 0 14px;
  border-top: 1px solid var(--color-card-border);
}

.skill-group h3 {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--color-text-tertiary);
}

.skill-line {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  letter-spacing: 0.01em;
  color: var(--color-text-secondary);
}

.about-main {
  display: flex;
  flex-direction: column;
  gap: 36px;
  min-width: 0;
}

.section-head p {
  margin: 0 0 4px;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.timeline {
  --time-col: 118px;
  --dot-col: 18px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.timeline-item {
  position: relative;
  display: grid;
  grid-template-columns: var(--time-col) var(--dot-col) minmax(0, 1fr);
  align-items: start;
}

.timeline-item + .timeline-item {
  margin-top: 16px;
}

.timeline-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: calc(var(--time-col) + var(--dot-col) / 2);
  top: 26px;
  bottom: -42px;
  border-left: 1.5px dashed var(--color-accent-border);
  transform: translateX(-0.75px);
}

.timeline-time {
  padding: 16px 12px 0 0;
  text-align: right;
  font-family: var(--font-serif);
  font-size: 13px;
  line-height: 1.45;
  color: var(--color-text-tertiary);
}

.timeline-item.is-current .timeline-time {
  color: var(--color-text);
  font-weight: 600;
}

.timeline-dot {
  width: 10px;
  height: 10px;
  margin: 20px auto 0;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 0 4px var(--color-accent-light);
  position: relative;
  z-index: 1;
}

.timeline-dot::after {
  content: '';
  position: absolute;
  left: 12px;
  top: 5px;
  width: 14px;
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
  padding: 14px 18px 16px;
}

.timeline-card h3 {
  margin: 0 0 4px;
  font-size: 18px;
  line-height: 1.3;
}

.timeline-org,
.timeline-detail {
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  color: var(--color-text-secondary);
}

.timeline-org {
  color: var(--color-accent);
  font-weight: 600;
}

.timeline-detail {
  margin-top: 6px;
}

@media (max-width: 980px) {
  .about-board {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .about-side {
    position: static;
  }
}

@media (max-width: 640px) {
  .about-name {
    font-size: 36px;
  }

  .timeline {
    --time-col: 0px;
  }

  .timeline-item {
    grid-template-columns: 18px minmax(0, 1fr);
  }

  .timeline-time {
    grid-column: 2;
    grid-row: 1;
    padding: 0 0 8px 12px;
    text-align: left;
  }

  .timeline-dot {
    grid-column: 1;
    grid-row: 1 / span 2;
  }

  .timeline-card {
    grid-column: 2;
    grid-row: 2;
    margin-left: 12px;
  }

  .timeline-item:not(:last-child)::before {
    left: 9px;
    bottom: -34px;
  }
}

@media print {
  .about-atmosphere,
  .profile-actions {
    display: none !important;
  }

  .about-side {
    position: static;
  }
}
</style>
