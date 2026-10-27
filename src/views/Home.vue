<template>
  <div class="home">
    <section
      class="title-card"
      aria-label="Snowhush"
    >
      <div
        class="title-still"
        aria-hidden="true"
      >
        <img
          src="/images/drone-white.jpg"
          alt=""
        >
        <div class="title-veil" />
      </div>

      <div class="title-copy reveal">
        <p class="kicker">
          <span>Snowhush</span>
          <span
            class="kicker-slash"
            aria-hidden="true"
          >/</span>
          <span>{{ $t('home.kicker') }}</span>
        </p>
        <h1>{{ $t('home.headline') }}</h1>
        <p class="lede">
          {{ $t('home.sub') }}
        </p>
        <div class="hero-actions">
          <router-link
            class="text-link"
            to="/projects"
          >
            {{ $t('home.ctaWork') }}
          </router-link>
          <router-link
            class="text-link text-link--quiet"
            to="/blog"
          >
            {{ $t('home.ctaNotes') }}
          </router-link>
        </div>
      </div>
    </section>

    <section
      class="chapters"
      :aria-label="$t('home.latestNotes')"
    >
      <p class="chapters-label reveal">
        Cont. · 续映
      </p>
      <div class="chapters-rail">
        <router-link
          class="chapter reveal"
          :to="noteTo"
          :aria-label="latestNote?.title || $t('home.indexNotes')"
        >
          <div class="chapter-still">
            <img
              :src="noteCover"
              alt=""
            >
          </div>
          <div class="chapter-meta">
            <span class="chapter-name">{{ $t('home.indexNotes') }}</span>
            <span
              v-if="noteRelative"
              class="chapter-date"
            >{{ noteRelative }}</span>
          </div>
          <h2 v-if="latestNote?.title">
            {{ latestNote.title }}
          </h2>
        </router-link>

        <router-link
          v-if="featuredProject"
          class="chapter reveal reveal-delay-1"
          to="/projects"
          :aria-label="featuredProject.title"
        >
          <div class="chapter-still">
            <img
              :src="featuredProject.image || '/images/drone-studio.jpg'"
              alt=""
            >
          </div>
          <div class="chapter-meta">
            <span class="chapter-name">{{ $t('home.indexWork') }}</span>
            <span
              v-if="featuredProject.year"
              class="chapter-date"
            >{{ featuredProject.year }}</span>
          </div>
          <h2>{{ featuredProject.title }}</h2>
        </router-link>

        <router-link
          class="chapter reveal reveal-delay-2"
          to="/life"
          :aria-label="lifeCaptionText"
        >
          <div class="chapter-still">
            <img
              :src="lifeImage"
              alt=""
            >
          </div>
          <div class="chapter-meta">
            <span class="chapter-name">{{ $t('home.indexLife') }}</span>
            <span class="chapter-date">{{ lifeMeta }}</span>
          </div>
          <h2>{{ lifeCaptionText }}</h2>
        </router-link>
      </div>
    </section>

    <section
      v-if="continuePost"
      class="continue"
    >
      <router-link
        class="continue-line reveal"
        :to="continueTo"
        :aria-label="continuePost.title"
      >
        <span class="continue-label">{{ $t('home.continue.eyebrow') }}</span>
        <span class="continue-title">{{ continuePost.title }}</span>
        <span
          class="continue-cta"
          aria-hidden="true"
        >→</span>
      </router-link>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useReveal } from '@/composables/useReveal'
import { useBlogStore } from '@/stores/blogStore'
import { useCareer } from '@/composables/useCareer'
import { useReadHistory } from '@/composables/useReadHistory'
import { getPostCover } from '@/utils/postCover'
import { formatRelativeDate } from '@/utils/relativeTime'

const { t, tm, locale } = useI18n()
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

const noteCover = computed(() => getPostCover(latestNote.value))

const noteRelative = computed(() => {
  if (latestNote.value?.dateLabel) return latestNote.value.dateLabel
  if (!latestNote.value?.date) return ''
  return formatRelativeDate(latestNote.value.date, locale.value)
})

const noteTo = computed(() => {
  const post = latestNote.value
  if (!post) return '/blog'
  return `/blog/${post.id}/${encodeURIComponent(post.slug)}`
})

const continueTo = computed(() => {
  const post = continuePost.value
  if (!post) return '/blog'
  return `/blog/${post.id}/${encodeURIComponent(post.slug)}`
})

const lifePosts = computed(() => {
  const items = tm('life.posts')
  if (!Array.isArray(items)) return []
  return [...items].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
})

const latestLife = computed(() => lifePosts.value[0] || null)
const lifeImage = computed(() => latestLife.value?.image || '/images/city.jpg')
const lifeCaptionText = computed(() => latestLife.value?.title || t('home.lifeCaption'))
const lifeMeta = computed(() => (
  latestLife.value?.date
    ? formatRelativeDate(latestLife.value.date, locale.value)
    : t('home.lastWeek')
))

onMounted(async () => {
  await blogStore.ensureLoaded()
  await nextTick()
  observe()
})

watch([latestNote, continuePost, featuredProject, latestLife], () => {
  nextTick(() => observe())
})
</script>

<style scoped>
.home {
  --ink: #f3efe8;
  --ink-soft: rgba(243, 239, 232, 0.78);
  --ink-faint: rgba(243, 239, 232, 0.48);
  --violet: var(--cinema-violet-soft, #c4b2f6);
  --violet-ink: #120e1c;
  position: relative;
  color: var(--ink);
  background: #07060c;
  min-height: 100vh;
  padding-bottom: calc(var(--cinema-letterbox) + 48px);
}

.title-card {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: flex-end;
  padding:
    calc(var(--nav-height) + 24px)
    clamp(20px, 4vw, 48px)
    calc(var(--cinema-letterbox) + 48px);
  overflow: hidden;
}

.title-still {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.title-still img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 40%;
  display: block;
  animation: kenburns 18s var(--ease-cinema, ease) both;
  transform-origin: 55% 40%;
}

.title-veil {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(5, 4, 10, 0.82) 0%, rgba(5, 4, 10, 0.35) 48%, rgba(5, 4, 10, 0.55) 100%),
    linear-gradient(0deg, rgba(5, 4, 10, 0.88) 0%, rgba(5, 4, 10, 0.2) 42%, rgba(88, 40, 160, 0.22) 100%);
}

.title-copy {
  position: relative;
  z-index: 1;
  max-width: 18em;
}

.kicker {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 18px;
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--violet);
}

.kicker-slash {
  opacity: 0.5;
}

.title-copy h1 {
  margin: 0 0 16px;
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: clamp(44px, 7vw, 84px);
  line-height: 1.08;
  letter-spacing: -0.035em;
  color: var(--ink);
  text-wrap: balance;
}

.lede {
  margin: 0 0 28px;
  font-size: 16px;
  line-height: 1.65;
  color: var(--ink-soft);
  max-width: 28em;
}

.hero-actions {
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
  border: 1px solid var(--violet);
  border-radius: 2px;
  background: var(--violet);
  color: var(--violet-ink);
  font-size: 12px;
  letter-spacing: 0.18em;
  text-decoration: none;
  text-transform: uppercase;
}

.text-link--quiet {
  background: transparent;
  color: var(--violet);
}

.text-link:focus-visible,
.chapter:focus-visible,
.continue-line:focus-visible {
  outline: 2px solid var(--violet);
  outline-offset: 3px;
}

.chapters {
  position: relative;
  z-index: 1;
  max-width: 1320px;
  margin: 0 auto;
  padding: 28px clamp(20px, 4vw, 48px) 12px;
}

.chapters-label {
  margin: 0 0 18px;
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--violet);
}

.chapters-rail {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.chapter {
  display: block;
  color: inherit;
  text-decoration: none;
}

.chapter-still {
  aspect-ratio: 2.39 / 1;
  overflow: hidden;
  border-radius: 2px;
  background: #120e1c;
}

.chapter-still img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 1.2s var(--ease-cinema, ease);
}

.chapter-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
}

.chapter-name {
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--violet);
}

.chapter-date {
  font-size: 12px;
  color: var(--ink-faint);
}

.chapter h2 {
  margin: 8px 0 0;
  font-family: var(--font-serif);
  font-size: clamp(18px, 1.6vw, 24px);
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.02em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (hover: hover) and (pointer: fine) {
  .chapter:hover .chapter-still img {
    transform: scale(1.04);
  }

  .text-link--quiet:hover {
    background: rgba(196, 178, 246, 0.12);
  }
}

.continue {
  max-width: 1320px;
  margin: 8px auto 0;
  padding: 0 clamp(20px, 4vw, 48px);
}

.continue-line {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 18px;
  padding: 20px 0;
  border-top: 1px solid rgba(196, 178, 246, 0.22);
  color: inherit;
  text-decoration: none;
}

.continue-label {
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--violet);
}

.continue-title {
  font-family: var(--font-serif);
  font-size: 18px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.continue-cta {
  color: var(--ink-faint);
}

@keyframes kenburns {
  from { transform: scale(1); }
  to { transform: scale(1.06); }
}

@media (max-width: 860px) {
  .title-copy {
    max-width: none;
  }

  .chapters-rail {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .chapter-still {
    aspect-ratio: 16 / 9;
  }

  .continue-line {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .continue-label {
    grid-column: 1 / -1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .title-still img {
    animation: none;
  }

  .chapter-still img,
  .text-link {
    transition: none;
  }
}
</style>
