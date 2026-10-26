<template>
  <div class="home">
    <div
      class="home-wash"
      aria-hidden="true"
    />
    <div
      class="home-grain"
      aria-hidden="true"
    />

    <section class="hero">
      <div class="hero-copy reveal">
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

      <figure class="hero-frame reveal reveal-delay-2">
        <img
          src="/images/drone-white.jpg"
          :alt="$t('home.heroAlt')"
        >
      </figure>
    </section>

    <section
      class="index"
      :aria-label="$t('home.latestNotes')"
    >
      <router-link
        class="index-col reveal"
        :to="noteTo"
        :aria-label="latestNote?.title || $t('home.indexNotes')"
      >
        <header class="index-head">
          <span class="index-name">{{ $t('home.indexNotes') }}</span>
          <span
            v-if="noteRelative"
            class="index-date"
          >{{ noteRelative }}</span>
        </header>
        <div class="index-cover">
          <img
            :src="noteCover"
            alt=""
          >
        </div>
        <h2 v-if="latestNote?.title">
          {{ latestNote.title }}
        </h2>
        <p
          v-if="noteTagLabel"
          class="index-tag"
        >
          {{ noteTagLabel }}
        </p>
      </router-link>

      <router-link
        v-if="featuredProject"
        class="index-col reveal reveal-delay-1"
        to="/projects"
        :aria-label="featuredProject.title"
      >
        <header class="index-head">
          <span class="index-name">{{ $t('home.indexWork') }}</span>
          <span
            v-if="featuredProject.year"
            class="index-date"
          >{{ featuredProject.year }}</span>
        </header>
        <div class="index-cover">
          <img
            :src="featuredProject.image || '/images/drone-studio.jpg'"
            alt=""
          >
        </div>
        <h2>{{ featuredProject.title }}</h2>
        <p
          v-if="projectTagLabel"
          class="index-tag"
        >
          {{ projectTagLabel }}
        </p>
      </router-link>

      <router-link
        class="index-col reveal reveal-delay-2"
        to="/life"
        :aria-label="lifeCaptionText"
      >
        <header class="index-head">
          <span class="index-name">{{ $t('home.indexLife') }}</span>
          <span class="index-date">{{ lifeMeta }}</span>
        </header>
        <div class="index-cover">
          <img
            :src="lifeImage"
            alt=""
          >
        </div>
        <h2>{{ lifeCaptionText }}</h2>
        <p
          v-if="lifeTagText"
          class="index-tag"
        >
          {{ lifeTagText }}
        </p>
      </router-link>
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
import { getDesignTag } from '@/utils/categoryLabel'
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
const projectTagLabel = computed(() => {
  const project = featuredProject.value
  if (!project) return ''
  if (Array.isArray(project.tags) && project.tags.length) return project.tags[0]
  return project.role || ''
})

const noteCover = computed(() => getPostCover(latestNote.value))
const noteTagLabel = computed(() => (
  latestNote.value ? getDesignTag(latestNote.value, locale.value).label : ''
))

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
const lifeTagText = computed(() => latestLife.value?.tags?.[0] || '')
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
  --paper: #f3eef8;
  --ink: #1c1830;
  --ink-soft: rgba(40, 32, 72, 0.72);
  --ink-faint: rgba(70, 56, 120, 0.52);
  --line: rgba(125, 106, 214, 0.28);
  --violet: #6d5bc8;
  --violet-ink: #ffffff;
  position: relative;
  padding-top: var(--nav-height);
  background: var(--paper);
  color: var(--ink);
  min-height: 100vh;
}

html.dark .home {
  --paper: #0c0a14;
  --ink: #f4f1fb;
  --ink-soft: rgba(244, 241, 251, 0.74);
  --ink-faint: rgba(210, 198, 255, 0.58);
  --line: rgba(184, 164, 243, 0.32);
  --violet: #c4b2f6;
  --violet-ink: #1a1428;
}

.home-wash {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 52% 44% at 8% 12%, rgba(183, 164, 243, 0.55), transparent 68%),
    radial-gradient(ellipse 40% 36% at 92% 78%, rgba(125, 106, 214, 0.22), transparent 70%);
}

html.dark .home-wash {
  background:
    radial-gradient(ellipse 55% 46% at 16% 8%, rgba(124, 70, 210, 0.42), transparent 64%),
    radial-gradient(ellipse 42% 38% at 88% 82%, rgba(88, 36, 168, 0.36), transparent 70%);
}

.home-grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.045;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}

.hero {
  position: relative;
  z-index: 1;
  max-width: 1180px;
  margin: 0 auto;
  min-height: calc(100vh - var(--nav-height));
  padding: clamp(36px, 6vh, 72px) 28px 64px;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(260px, 0.86fr);
  gap: clamp(28px, 4vw, 56px);
  align-items: center;
}

.kicker {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--violet);
}

.kicker-slash {
  opacity: 0.55;
}

.hero h1 {
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: clamp(48px, 5.4vw, 72px);
  line-height: 1.12;
  letter-spacing: -0.035em;
  color: var(--ink);
  max-width: 8em;
  margin-bottom: 18px;
}

.lede {
  font-size: 16px;
  line-height: 1.65;
  color: var(--ink-soft);
  max-width: 28em;
  margin-bottom: 28px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 28px;
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
  font-size: 13px;
  letter-spacing: 0.14em;
  text-decoration: none;
  transition: transform 0.12s ease, background 0.2s ease, color 0.2s ease;
}

.text-link--quiet {
  background: transparent;
  color: var(--violet);
}

.text-link:active {
  transform: scale(0.98);
}

.text-link:focus-visible,
.index-col:focus-visible,
.continue-line:focus-visible {
  outline: 2px solid var(--violet);
  outline-offset: 3px;
}

.hero-frame {
  margin: 0;
  padding-left: clamp(20px, 3vw, 48px);
  border-left: 1px solid var(--line);
}

.hero-frame img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  object-position: center 42%;
  border-radius: 10px;
  transition: transform 0.8s ease;
}

@media (hover: hover) and (pointer: fine) {
  .hero-frame:hover img,
  .index-col:hover .index-cover img {
    transform: scale(1.04);
  }

  .text-link--quiet:hover {
    background: rgba(125, 106, 214, 0.1);
  }

  html.dark .text-link--quiet:hover {
    background: rgba(196, 178, 246, 0.12);
  }
}

.index {
  position: relative;
  z-index: 1;
  max-width: 1180px;
  margin: 0 auto;
  padding: 8px 28px 28px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
  border-top: 1px solid var(--line);
}

.index-col {
  display: block;
  color: inherit;
  text-decoration: none;
  padding-top: 22px;
}

.index-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.index-name {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--violet);
}

.index-date {
  font-size: 12px;
  color: var(--ink-faint);
}

.index-cover {
  height: 160px;
  margin: 14px 0 14px;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(26, 24, 20, 0.06);
}

.index-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.8s ease;
}

.index-col h2 {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.02em;
  color: var(--ink);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.index-tag {
  margin-top: 8px;
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--ink-faint);
}

.continue {
  position: relative;
  z-index: 1;
  max-width: 1180px;
  margin: 12px auto 72px;
  padding: 0 28px;
}

.continue-line {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 18px;
  padding: 18px 0;
  border-top: 1px solid var(--line);
  color: inherit;
  text-decoration: none;
}

.continue-label {
  font-size: 11px;
  letter-spacing: 0.18em;
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

@media (max-width: 860px) {
  .hero {
    grid-template-columns: 1fr;
    min-height: 0;
    padding: 28px 20px 36px;
    gap: 28px;
  }

  .hero h1 {
    font-size: clamp(40px, 12vw, 56px);
  }

  .hero-frame {
    border-left: 0;
    padding-left: 0;
    padding-top: 8px;
  }

  .hero-frame img {
    aspect-ratio: 4 / 5;
    max-height: 46vh;
    width: 100%;
    object-fit: cover;
  }

  .index {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 0 20px 12px;
  }

  .index-cover {
    height: 180px;
  }

  .continue {
    padding: 0 20px;
    margin-bottom: 48px;
  }

  .continue-line {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .continue-label {
    grid-column: 1 / -1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-frame img,
  .index-cover img,
  .text-link {
    transition: none;
  }
}
</style>
