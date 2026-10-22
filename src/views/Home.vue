<template>
  <div class="home">
    <div
      class="home-atmosphere"
      aria-hidden="true"
    >
      <div class="home-mesh" />
      <div class="home-snow" />
    </div>

    <section class="home-stage">
      <div
        v-if="latestNote"
        class="float-card float-card--notes reveal"
        @click="goToPost(latestNote)"
      >
        <header class="float-card-head">
          <span class="float-card-title">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            ><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
            {{ $t('home.latestNotes') }}
          </span>
          <span class="float-card-meta">{{ noteRelative }} ›</span>
        </header>
        <div class="float-card-cover">
          <CoverArt
            :seed="latestNote.id"
            :category="latestNote.category"
            :image="latestNote.image"
            size="md"
          />
        </div>
        <h3>{{ latestNote.title }}</h3>
        <p>{{ latestNote.excerpt }}</p>
        <span class="tag tag-accent">{{ $t('home.noteTag') }}</span>
      </div>

      <article class="float-card float-card--hero reveal reveal-delay-1">
        <p class="hero-hello">
          {{ $t('home.hello') }}
        </p>
        <h1 class="hero-headline">
          {{ $t('home.headline') }}
        </h1>
        <p class="hero-sub">
          {{ $t('home.sub') }}
        </p>
        <p class="hero-role">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          ><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle
            cx="12"
            cy="13"
            r="4"
          /></svg>
          {{ $t('home.roleLine') }}
        </p>
        <div class="hero-actions">
          <button
            class="btn btn-primary"
            type="button"
            @click="$router.push('/projects')"
          >
            <span aria-hidden="true">✨</span>
            {{ $t('home.exploreWork') }}
          </button>
          <button
            class="btn btn-ghost hero-ghost"
            type="button"
            @click="$router.push('/blog')"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            ><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
            {{ $t('home.readNotes') }}
          </button>
        </div>
        <div
          class="hero-orb"
          aria-hidden="true"
        >
          <span /><span /><span />
        </div>
      </article>

      <div
        v-if="featuredProject"
        class="float-card float-card--project reveal reveal-delay-2"
        @click="$router.push('/projects')"
      >
        <header class="float-card-head">
          <span class="float-card-title">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            ><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
            {{ $t('home.projectProgress') }}
          </span>
          <span class="float-card-meta">{{ featuredProject.year }} ›</span>
        </header>
        <div class="float-card-cover">
          <CoverArt
            :seed="featuredProject.id"
            category="sensor"
            size="md"
          />
        </div>
        <h3>{{ featuredProject.title }}</h3>
        <p>{{ featuredProject.description }}</p>
        <div
          class="progress-track"
          aria-hidden="true"
        >
          <div
            class="progress-fill"
            style="width: 62%"
          />
        </div>
        <div class="progress-row">
          <span>{{ $t('home.progressLabel', { n: 62 }) }}</span>
          <span>{{ $t('home.coreContribution') }}</span>
        </div>
      </div>

      <div
        class="float-card float-card--life reveal reveal-delay-3"
        @click="$router.push('/life')"
      >
        <header class="float-card-head">
          <span class="float-card-title">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            ><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle
              cx="12"
              cy="13"
              r="4"
            /></svg>
            {{ $t('home.lifeMoments') }}
          </span>
          <span class="float-card-meta">{{ $t('home.lastWeek') }} ›</span>
        </header>
        <div class="float-card-cover float-card-cover--life">
          <CoverArt
            seed="life-home"
            category="notes"
            size="md"
          />
        </div>
        <p class="life-caption">
          {{ $t('home.lifeCaption') }}
        </p>
        <span class="tag tag-accent">{{ $t('home.lifeTag') }}</span>
      </div>
    </section>

    <section
      v-if="continuePost"
      class="continue-section"
    >
      <div class="container-wide">
        <article
          class="continue-card reveal"
          @click="goToPost(continuePost)"
        >
          <div class="continue-body">
            <span class="section-eyebrow">{{ $t('home.continue.eyebrow') }}</span>
            <h3>{{ continuePost.title }}</h3>
            <p>{{ $t('home.continue.cta') }}</p>
          </div>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          ><line
            x1="5"
            y1="12"
            x2="19"
            y2="12"
          /><polyline points="12 5 19 12 12 19" /></svg>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useReveal } from '@/composables/useReveal'
import { useBlogStore } from '@/stores/blogStore'
import { useCareer } from '@/composables/useCareer'
import { useReadHistory } from '@/composables/useReadHistory'
import CoverArt from '@/components/CoverArt.vue'

const router = useRouter()
const { t } = useI18n()
const blogStore = useBlogStore()
const { companyProjects } = useCareer()
const { continueReading } = useReadHistory()
const { observe } = useReveal()

const continuePost = computed(() => {
  const entry = continueReading.value
  if (!entry) return null
  return blogStore.getPostById(entry.id)
})

const latestNote = computed(() => blogStore.getRecentPosts(1)[0] || null)
const featuredProject = computed(() => companyProjects.value[0] || null)

const noteRelative = computed(() => {
  if (!latestNote.value?.date) return t('home.daysAgo', { n: 2 })
  const days = Math.max(1, Math.round((Date.now() - new Date(latestNote.value.date).getTime()) / 86400000))
  return t('home.daysAgo', { n: Math.min(days, 99) })
})

const goToPost = post => {
  router.push(`/blog/${post.id}/${encodeURIComponent(post.slug)}`)
}

onMounted(async () => {
  await blogStore.ensureLoaded()
  await nextTick()
  observe()
})

watch([latestNote, continuePost, featuredProject], () => {
  nextTick(() => observe())
})
</script>

<style scoped>
.home {
  position: relative;
  padding-top: var(--nav-height);
  min-height: calc(100vh - var(--nav-height));
  background: var(--color-hero-bg);
  overflow: hidden;
}

.home-atmosphere {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.home-mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 55% 45% at 18% 30%, var(--color-mesh-1) 0%, transparent 60%),
    radial-gradient(ellipse 45% 40% at 82% 70%, var(--color-mesh-2) 0%, transparent 55%),
    radial-gradient(ellipse 40% 30% at 50% 100%, var(--color-mesh-3) 0%, transparent 50%);
  opacity: 0.85;
}

.home-snow {
  position: absolute;
  inset: 0;
  opacity: 0.35;
  background-image:
    radial-gradient(1.5px 1.5px at 12% 18%, rgba(255, 255, 255, 0.55) 0%, transparent 100%),
    radial-gradient(1px 1px at 42% 36%, rgba(255, 255, 255, 0.4) 0%, transparent 100%),
    radial-gradient(2px 2px at 78% 22%, rgba(255, 255, 255, 0.35) 0%, transparent 100%),
    radial-gradient(1px 1px at 64% 68%, rgba(255, 255, 255, 0.45) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 28% 76%, rgba(255, 255, 255, 0.3) 0%, transparent 100%);
  animation: snow-drift 28s linear infinite;
}

html:not(.dark) .home-snow {
  opacity: 0.12;
  filter: blur(18px);
  background-image:
    radial-gradient(120px 80px at 20% 40%, rgba(124, 108, 240, 0.08) 0%, transparent 70%),
    radial-gradient(160px 100px at 70% 60%, rgba(124, 108, 240, 0.06) 0%, transparent 70%);
  animation: none;
}

@keyframes snow-drift {
  from { transform: translateY(0); }
  to { transform: translateY(24px); }
}

.home-stage {
  /* Soft-studio F scatter: air between hero & sides (gap > kiss) */
  --stage-side-w: clamp(220px, 21vw, 240px);
  --stage-hero-w: clamp(340px, 38vw, 440px);
  --stage-hero-shift: 24px; /* hero slightly left-of-center */
  --stage-hero-top: calc(50% - 200px);
  /* negative = gap from hero edge; keeps soft float without covering content */
  --stage-gap-notes: 20px;
  --stage-gap-project: 16px;
  --stage-gap-life: 28px;
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(28px, 5vh, 56px) clamp(12px, 2vw, 24px) 72px;
  min-height: var(--hero-min-height);
  height: var(--hero-min-height);
}

.float-card {
  background: var(--color-card-bg);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-card-border);
  box-shadow: var(--shadow-lg), var(--color-card-glow);
  padding: 18px;
  cursor: pointer;
  position: absolute;
  width: var(--stage-side-w);
}

.float-card--hero {
  /* Slightly left-of-center — lowest layer so side edges stay readable */
  left: 50%;
  top: var(--stage-hero-top);
  margin-left: calc(var(--stage-hero-w) / -2 - var(--stage-hero-shift));
  width: var(--stage-hero-w);
  min-height: 380px;
  z-index: 2;
  cursor: default;
  padding: clamp(28px, 4vw, 40px);
  overflow: hidden;
  box-shadow: var(--shadow-xl), var(--color-card-glow);
}

.float-card--notes {
  /* Mid-left, lower than hero top; clear horizontal gap from hero */
  left: calc(50% - var(--stage-hero-w) / 2 - var(--stage-hero-shift) - var(--stage-side-w) - var(--stage-gap-notes));
  top: calc(var(--stage-hero-top) + 108px);
  z-index: 3;
}

.float-card--project {
  /* Upper-right, above hero; clear gap — only soft shadow may touch */
  left: calc(50% + var(--stage-hero-w) / 2 - var(--stage-hero-shift) + var(--stage-gap-project));
  top: calc(var(--stage-hero-top) - 72px);
  z-index: 4;
}

.float-card--life {
  /* Lower-right, gap below project; further right than project (stagger) */
  left: calc(50% + var(--stage-hero-w) / 2 - var(--stage-hero-shift) + var(--stage-gap-life));
  top: calc(var(--stage-hero-top) + 308px);
  z-index: 4;
  width: calc(var(--stage-side-w) + 8px);
}

.float-card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.float-card-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}

.float-card-meta {
  font-size: 12px;
  color: var(--color-text-tertiary);
  white-space: nowrap;
}

.float-card-cover {
  height: 110px;
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: 12px;
}

.float-card-cover--life {
  height: 100px;
}

.float-card h3 {
  font-size: 15px;
  margin-bottom: 6px;
  line-height: 1.35;
}

.float-card p {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 10px;
}

.life-caption {
  -webkit-line-clamp: 2;
  margin-bottom: 10px;
}

.hero-hello {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 10px;
}

.hero-headline {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;
  margin-bottom: 14px;
  max-width: 14em;
}

.hero-sub {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  max-width: 28em;
  margin-bottom: 14px;
  -webkit-line-clamp: unset;
  display: block;
}

.hero-role {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-tertiary);
  margin-bottom: 28px;
  -webkit-line-clamp: unset;
  display: inline-flex;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.hero-ghost {
  background: transparent;
  color: var(--color-hero-ghost-text);
  border: 1px solid var(--color-hero-ghost-border);
  min-height: 42px;
  padding: 11px 18px;
}

@media (hover: hover) and (pointer: fine) {
  .hero-ghost:hover {
    background: var(--color-hero-ghost-hover-bg);
    border-color: var(--color-hero-ghost-hover-border);
    color: var(--color-hero-ghost-hover-text);
  }
}

.hero-orb {
  position: absolute;
  right: -20px;
  bottom: -20px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, var(--color-mesh-1), transparent 68%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  opacity: 0.9;
  pointer-events: none;
}

.hero-orb span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  opacity: 0.55;
}

.progress-track {
  height: 4px;
  border-radius: 4px;
  background: var(--color-bg-secondary);
  margin: 8px 0 8px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  background: var(--color-accent);
}

.progress-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.continue-section {
  position: relative;
  z-index: 1;
  padding: 0 0 64px;
}

.continue-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-radius: var(--radius-lg);
  background: var(--color-card-bg);
  border: 1px solid var(--color-card-border);
  box-shadow: var(--shadow-sm), var(--color-card-glow);
  cursor: pointer;
}

.continue-body h3 {
  font-size: 16px;
  margin: 4px 0;
}

.continue-body p {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0;
}

@media (max-width: 1100px) and (min-width: 761px) {
  .home-stage {
    --stage-side-w: clamp(196px, 19vw, 220px);
    --stage-hero-w: clamp(280px, 36vw, 380px);
    --stage-hero-shift: 12px;
    --stage-gap-notes: 14px;
    --stage-gap-project: 12px;
    --stage-gap-life: 20px;
  }
}

@media (max-width: 760px) {
  .home-stage {
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: auto;
    min-height: 0;
    padding-top: 24px;
    padding-bottom: 48px;
  }

  .float-card {
    position: relative;
    left: auto;
    top: auto;
    margin: 0;
    width: 100%;
    z-index: auto;
  }

  .float-card--hero {
    order: -1;
    min-height: auto;
    width: 100%;
  }

  .hero-orb {
    width: 120px;
    height: 120px;
    opacity: 0.55;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-snow {
    animation: none;
  }
}
</style>
