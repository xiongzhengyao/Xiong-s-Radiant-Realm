<template>
  <div class="about">
    <div
      class="about-atmosphere"
      aria-hidden="true"
    >
      <div class="about-mesh" />
    </div>

    <section class="about-hero">
      <div class="about-copy reveal">
        <p class="page-kicker">
          {{ $t('about.eyebrow') }}
        </p>
        <h1 class="about-name">
          <template
            v-for="(ch, i) in nameChars"
            :key="i"
          >
            <span :class="{ accent: ch === accentChar }">{{ ch }}</span>
          </template>
        </h1>
        <p class="page-lede about-lede">
          {{ $t('about.intro') }}
        </p>
        <p class="about-role">
          {{ $t('about.profile.title') }}
        </p>
        <ul class="about-meta">
          <li>{{ $t('about.profile.location') }}</li>
          <li>{{ $t('about.profile.years') }}</li>
          <li>
            <a :href="`mailto:${email}`">{{ email }}</a>
          </li>
        </ul>
        <div class="about-actions no-print">
          <router-link
            class="text-link"
            to="/contact"
          >
            {{ $t('about.contactCta') }}
          </router-link>
          <button
            type="button"
            class="text-link text-link--quiet"
            @click="printResume"
          >
            {{ $t('about.resumeCta') }}
          </button>
        </div>
      </div>

      <figure class="about-portrait reveal reveal-delay-2">
        <img
          v-if="!imageError"
          :src="profileImage"
          :alt="nameFull"
          @error="imageError = true"
        >
        <div
          v-else
          class="about-portrait-fallback"
          aria-hidden="true"
        >
          ZY
        </div>
      </figure>
    </section>

    <section
      v-if="skillsFlat.length"
      class="about-skills reveal"
      :aria-label="$t('about.sections.skills')"
    >
      <p class="skills-kicker">
        {{ $t('about.sections.skills') }}
      </p>
      <p class="skills-line">
        {{ skillsFlat.join(' · ') }}
      </p>
    </section>

    <section class="about-path">
      <header class="path-head reveal">
        <p class="page-kicker">
          {{ $t('about.experience.eyebrow') }}
        </p>
        <h2>{{ $t('about.sections.experience') }}</h2>
      </header>
      <ol class="path-index">
        <li
          v-for="(job, idx) in workExperience"
          :key="`${job.company}-${job.period}`"
          class="reveal"
          :class="['reveal-delay-' + Math.min(idx + 1, 3), { 'is-current': idx === 0 }]"
        >
          <time>{{ job.period }}</time>
          <div class="path-copy">
            <h3>{{ job.position }}</h3>
            <p
              v-if="job.description && job.description !== job.position"
              class="path-detail"
            >
              {{ job.description }}
            </p>
          </div>
          <span class="path-org">{{ job.company }}</span>
        </li>
      </ol>
    </section>

    <section class="about-path about-path--edu">
      <header class="path-head reveal">
        <h2>{{ $t('about.sections.education') }}</h2>
      </header>
      <ol class="path-index">
        <li
          v-for="(edu, idx) in educationHistory"
          :key="`${edu.school}-${edu.period}`"
          class="reveal"
          :class="'reveal-delay-' + Math.min(idx + 1, 3)"
        >
          <time>{{ edu.period }}</time>
          <div class="path-copy">
            <h3>{{ edu.degree }}</h3>
            <p class="path-detail">
              {{ edu.school }} · {{ edu.major }}
            </p>
            <p
              v-if="edu.details"
              class="path-detail path-detail--soft"
            >
              {{ edu.details }}
            </p>
          </div>
        </li>
      </ol>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useReveal } from '@/composables/useReveal'
import { APP_CONFIG } from '@/utils/constants'

const { t, tm } = useI18n()
useReveal()

const email = APP_CONFIG.EMAIL
const profileImage = APP_CONFIG.IMAGES.PROFILE
const imageError = ref(false)

const nameFull = computed(() => t('about.profile.name'))
const accentChar = computed(() => t('about.profile.nameAccent'))
const nameChars = computed(() => Array.from(nameFull.value))

const asList = value => (Array.isArray(value) ? value : [])

const skillsFlat = computed(() => asList(tm('about.skillsFlat')))
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

.about-hero {
  position: relative;
  z-index: 1;
  max-width: 1180px;
  margin: 0 auto;
  padding: clamp(36px, 6vh, 64px) 28px 48px;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(240px, 0.82fr);
  gap: clamp(28px, 4vw, 56px);
  align-items: center;
}

.about-name {
  font-family: var(--font-serif);
  font-size: clamp(48px, 5.4vw, 72px);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.08;
  margin: 0 0 16px;
}

.about-name .accent {
  color: #6d5bc8;
}

html.dark .about-name .accent {
  color: #c4b2f6;
}

.about-lede {
  white-space: pre-line;
  margin-bottom: 18px;
}

.about-role {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

.about-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin: 0 0 28px;
  padding: 0;
  list-style: none;
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.about-meta a {
  color: inherit;
  text-decoration: none;
}

.about-meta a:hover {
  color: var(--color-accent);
}

.about-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.text-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid var(--color-accent);
  border-radius: 2px;
  background: var(--color-accent);
  color: #fff;
  font-size: 13px;
  letter-spacing: 0.14em;
  text-decoration: none;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: transform 0.12s ease, background 0.2s ease, color 0.2s ease;
}

html.dark .text-link {
  color: #1a1428;
}

.text-link--quiet {
  background: transparent;
  color: var(--color-accent);
}

.text-link:active {
  transform: scale(0.98);
}

.text-link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}

.about-portrait {
  margin: 0;
  border-radius: 10px;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  background: var(--color-bg-secondary);
  border-left: 1px solid rgba(125, 106, 214, 0.35);
}

.about-portrait img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

@media (hover: hover) and (pointer: fine) {
  .about-portrait:hover img {
    transform: scale(1.04);
  }
}

.about-portrait-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: var(--font-serif);
  font-size: 48px;
  font-weight: 700;
  color: var(--color-text-tertiary);
}

.about-skills {
  position: relative;
  z-index: 1;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 28px 40px;
  border-top: 1px solid rgba(125, 106, 214, 0.2);
  padding-top: 28px;
}

.skills-kicker {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.skills-line {
  margin: 0;
  max-width: 40em;
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-text-secondary);
}

.about-path {
  position: relative;
  z-index: 1;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 28px 56px;
}

.about-path--edu {
  padding-bottom: 80px;
}

.path-head {
  margin-bottom: 18px;
}

.path-head h2 {
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(28px, 3vw, 36px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.path-index {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid rgba(125, 106, 214, 0.28);
}

.path-index li {
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr) auto;
  gap: 16px;
  align-items: baseline;
  padding: 22px 0;
  border-bottom: 1px solid rgba(125, 106, 214, 0.2);
}

.path-index time,
.path-org {
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.path-index li.is-current time {
  color: var(--color-text);
  font-weight: 600;
}

.path-copy h3 {
  margin: 0 0 6px;
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.path-detail {
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  color: var(--color-text-secondary);
}

.path-detail--soft {
  margin-top: 4px;
  color: var(--color-text-tertiary);
}

.path-org {
  color: #7d6ad6;
  font-weight: 600;
}

html.dark .path-org {
  color: #d2c2ff;
}

@media (max-width: 860px) {
  .about-hero {
    grid-template-columns: 1fr;
    align-items: start;
    padding-bottom: 36px;
  }

  .about-portrait {
    max-width: 420px;
    max-height: 70vh;
  }

  .path-index li {
    grid-template-columns: 96px minmax(0, 1fr);
  }

  .path-org {
    grid-column: 2;
  }
}

@media (max-width: 640px) {
  .about-hero,
  .about-skills,
  .about-path {
    padding-left: 18px;
    padding-right: 18px;
  }

  .path-index li {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .path-index time {
    order: -1;
  }
}

@media print {
  .about-atmosphere,
  .about-actions {
    display: none !important;
  }

  .about-portrait {
    max-height: 280px;
  }
}
</style>
