<template>
  <div class="about">
    <section class="about-hero">
      <div class="about-hero-mesh" aria-hidden="true" />
      <div class="container-wide">
        <div class="about-intro reveal">
          <span class="section-eyebrow">{{ $t('about.eyebrow') }}</span>
          <h1>{{ $t('about.title') }}</h1>
          <p class="about-intro-desc">{{ $t('about.intro') }}</p>
        </div>

        <div class="about-grid">
          <aside class="about-sidebar reveal">
            <div class="profile-card">
              <div class="avatar-wrapper">
                <img
                  v-if="!imageError"
                  class="avatar"
                  src="/images/profile.jpg"
                  :alt="$t('about.profile.name')"
                  @error="handleImageError"
                />
                <div v-else class="avatar-fallback">ZY</div>
              </div>
              <h2>{{ $t('about.profile.name') }}</h2>
              <p class="profile-title">{{ $t('about.profile.title') }}</p>
              <p class="profile-bio">{{ $t('about.profile.bio') }}</p>

              <div class="profile-meta">
                <span class="meta-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ $t('about.profile.location') }}
                </span>
                <span class="meta-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  {{ $t('about.profile.years') }}
                </span>
                <a class="meta-item meta-link" :href="`mailto:${email}`">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  {{ email }}
                </a>
              </div>

              <button class="btn btn-primary btn-glow profile-cta" @click="$router.push('/contact')">
                {{ $t('about.contactCta') }}
              </button>
              <a
                :href="resumeUrl"
                class="btn btn-outline resume-btn"
                download
                target="_blank"
                rel="noopener"
              >
                {{ $t('about.resumeCta') }}
              </a>
            </div>

            <div class="skills-panel">
              <h3>{{ $t('about.sections.skills') }}</h3>
              <div
                v-for="(group, idx) in skillGroups"
                :key="group.name"
                class="skill-group reveal"
                :class="'reveal-delay-' + (idx + 1)"
              >
                <h4>{{ group.name }}</h4>
                <div class="skill-tags">
                  <span class="tag" v-for="skill in group.items" :key="skill">{{ skill }}</span>
                </div>
              </div>
            </div>
          </aside>

          <main class="about-main">
            <section class="timeline-section reveal">
              <div class="timeline-header-row">
                <span class="section-eyebrow">{{ $t('about.experience.eyebrow') }}</span>
                <h2>{{ $t('about.sections.experience') }}</h2>
              </div>
              <div class="timeline">
                <div
                  v-for="(exp, idx) in workExperience"
                  :key="idx"
                  class="timeline-item reveal"
                  :class="'reveal-delay-' + (idx + 1)"
                >
                  <div class="timeline-marker" />
                  <div class="timeline-card">
                    <div class="timeline-card-top">
                      <div>
                        <div class="timeline-title-row">
                          <h3>{{ exp.position }}</h3>
                        </div>
                        <p class="timeline-company">{{ exp.company }}</p>
                      </div>
                      <span class="timeline-period">{{ exp.period }}</span>
                    </div>
                    <p class="timeline-desc">{{ exp.description }}</p>
                  </div>
                </div>
              </div>
            </section>

            <section class="timeline-section reveal">
              <div class="timeline-header-row">
                <span class="section-eyebrow">{{ $t('about.education.eyebrow') }}</span>
                <h2>{{ $t('about.sections.education') }}</h2>
              </div>
              <div class="timeline">
                <div
                  v-for="(edu, idx) in educationHistory"
                  :key="idx"
                  class="timeline-item reveal"
                  :class="'reveal-delay-' + (idx + 1)"
                >
                  <div class="timeline-marker timeline-marker--muted" />
                  <div class="timeline-card">
                    <div class="timeline-card-top">
                      <div>
                        <h3>{{ edu.degree }}</h3>
                        <p class="timeline-company">{{ edu.school }} · {{ edu.major }}</p>
                      </div>
                      <span class="timeline-period">{{ edu.period }}</span>
                    </div>
                    <p class="timeline-desc">{{ edu.details }}</p>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useReveal } from '@/composables/useReveal'
import { APP_CONFIG } from '@/utils/constants'

const { tm } = useI18n()
const email = APP_CONFIG.EMAIL
const resumeUrl = APP_CONFIG.RESUME
const imageError = ref(false)
const handleImageError = () => { imageError.value = true }

const skillGroups = computed(() => tm('about.skillGroups'))
const workExperience = computed(() => tm('about.work'))
const educationHistory = computed(() => tm('about.education'))

useReveal()
</script>

<style scoped>
.about {
  padding-top: var(--nav-height);
  background: var(--color-bg);
}

.about-hero {
  position: relative;
  padding: var(--space-16) 0 var(--space-20);
  overflow: hidden;
}

.about-hero-mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 40% at 10% 20%, var(--color-mesh-1) 0%, transparent 50%),
    radial-gradient(ellipse 40% 35% at 90% 10%, var(--color-mesh-2) 0%, transparent 45%);
  pointer-events: none;
}

.about-intro {
  position: relative;
  max-width: 640px;
  margin-bottom: var(--space-12);
}

.about-intro h1 {
  font-size: clamp(36px, 5vw, 56px);
  letter-spacing: -0.03em;
  margin-bottom: var(--space-3);
}

.about-intro-desc {
  font-size: 18px;
  line-height: 1.58;
  color: var(--color-text-secondary);
}

.about-grid {
  position: relative;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--space-10);
  align-items: start;
}

.about-sidebar {
  position: sticky;
  top: calc(var(--nav-height) + var(--space-6));
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.profile-card {
  padding: var(--space-8);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  text-align: center;
}

.avatar-wrapper {
  width: 112px;
  height: 112px;
  border-radius: var(--radius-full);
  overflow: hidden;
  margin: 0 auto var(--space-5);
  box-shadow: var(--shadow-md);
  border: 2px solid var(--color-border);
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 700;
  color: var(--color-text-tertiary);
  background: var(--color-bg-secondary);
}

.profile-card h2 {
  font-size: 22px;
  margin-bottom: var(--space-1);
}

.profile-title {
  font-size: 15px;
  color: var(--color-accent);
  font-weight: 500;
  margin-bottom: var(--space-4);
}

.profile-bio {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.55;
  margin-bottom: var(--space-5);
}

.profile-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
  text-align: left;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 13px;
  color: var(--color-text-secondary);
}

.meta-link {
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .meta-link:hover {
    color: var(--color-accent);
  }
}

.meta-item svg {
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.profile-cta {
  width: 100%;
  justify-content: center;
  margin-bottom: var(--space-3);
}

.resume-btn {
  width: 100%;
  justify-content: center;
  display: inline-flex;
  align-items: center;
  padding: 12px 20px;
  font-size: 15px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: border-color var(--duration-fast) var(--ease-out),
              color var(--duration-fast) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .resume-btn:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
}

.skills-panel {
  padding: var(--space-6);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
}

.skills-panel > h3 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: var(--space-5);
}

.skill-group + .skill-group {
  margin-top: var(--space-5);
  padding-top: var(--space-5);
  border-top: 1px solid var(--color-border);
}

.skill-group h4 {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-2);
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.about-main {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.timeline-section h2 {
  font-size: clamp(24px, 3vw, 32px);
  letter-spacing: -0.02em;
  margin-top: var(--space-2);
  margin-bottom: var(--space-8);
}

.timeline {
  position: relative;
  padding-left: var(--space-8);
}

.timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 8px;
  bottom: 8px;
  width: 1px;
  background: linear-gradient(180deg, var(--color-accent), var(--color-border));
}

.timeline-item {
  position: relative;
  padding-bottom: var(--space-6);
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: calc(-1 * var(--space-8) + 2px);
  top: 10px;
  width: 11px;
  height: 11px;
  border-radius: var(--radius-full);
  background: var(--color-accent);
  border: 2px solid var(--color-bg);
  box-shadow: 0 0 0 2px var(--color-accent);
}

.timeline-marker--muted {
  background: var(--color-text-tertiary);
  box-shadow: 0 0 0 2px var(--color-text-tertiary);
}

.timeline-card {
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  transition: border-color var(--duration-base) var(--ease-out),
              transform var(--duration-base) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .timeline-card:hover {
    border-color: rgba(0, 113, 227, 0.2);
    transform: translateX(4px);
  }
}

.timeline-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-4);
  margin-bottom: var(--space-3);
}

.timeline-card-top h3 {
  font-size: 18px;
  font-weight: 600;
}

.timeline-title-row h3 {
  margin: 0;
}

.timeline-company {
  font-size: 14px;
  color: var(--color-accent);
  margin-top: 2px;
  font-weight: 500;
}

.timeline-period {
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--color-text-tertiary);
  white-space: nowrap;
  flex-shrink: 0;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: var(--color-bg-secondary);
}

.timeline-desc {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

@media (max-width: 968px) {
  .about-grid {
    grid-template-columns: 1fr;
  }

  .about-sidebar {
    position: static;
  }
}

@media (max-width: 734px) {
  .about-hero {
    padding: var(--space-10) 0 var(--space-12);
  }

  .timeline-card-top {
    flex-direction: column;
    gap: var(--space-2);
  }
}
</style>
