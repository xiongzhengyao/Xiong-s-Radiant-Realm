<template>
  <div class="home">
    <!-- Hero: Editorial split -->
    <section class="hero">
      <div class="hero-noise" aria-hidden="true" />
      <div class="hero-mesh" aria-hidden="true" />
      <!-- Hero follows theme via --color-hero-bg: cool mist in light, snow-night in dark. -->
      <HeroParticleField />

      <div class="container-wide hero-grid">
        <div class="hero-copy">
          <p class="hero-eyebrow animate-fade-in-up" style="animation-delay: 0.04s">{{ $t('home.eyebrow') }}</p>
          <h1 class="hero-title animate-fade-in-up" style="animation-delay: 0.08s">
            {{ $t('home.welcome') }}
          </h1>
          <p class="hero-slogan animate-fade-in-up" style="animation-delay: 0.14s">
            {{ $t('home.slogan') }}
          </p>

          <div class="hero-actions animate-fade-in-up" style="animation-delay: 0.22s">
            <button class="btn btn-primary btn-glow" @click="$router.push('/blog')">
              {{ $t('home.viewBlog') }}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
            <button class="btn btn-ghost" @click="$router.push('/projects')">
              {{ $t('home.viewProjects') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Continue Reading -->
    <section v-if="continuePost" class="continue-section">
      <div class="container-wide">
        <article class="continue-card reveal" @click="goToPost(continuePost)">
          <div class="continue-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          <div class="continue-body">
            <span class="section-eyebrow">{{ $t('home.continue.eyebrow') }}</span>
            <h3>{{ continuePost.title }}</h3>
            <p>{{ $t('home.continue.cta') }}</p>
          </div>
          <svg class="continue-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </article>
      </div>
    </section>

    <!-- Expertise Bento -->
    <section class="section expertise-section">
      <div class="container-wide">
        <div class="section-intro reveal">
          <span class="section-eyebrow">{{ $t('home.expertise.eyebrow') }}</span>
          <h2>{{ $t('home.skills.title') }}</h2>
          <p class="section-desc">{{ $t('home.expertise.desc') }}</p>
        </div>

        <div class="bento-grid">
          <article
            v-for="(skill, index) in skills"
            :key="skill.key"
            class="bento-card reveal"
            :class="['bento-card--' + skill.key, 'reveal-delay-' + (index + 1)]"
          >
            <span class="bento-index">0{{ index + 1 }}</span>
            <h3>{{ $t(`home.skills.${skill.key}.name`) }}</h3>
            <p>{{ $t(`home.skills.${skill.key}.description`) }}</p>
            <div class="bento-glow" aria-hidden="true" />
          </article>
        </div>
      </div>
    </section>

    <!-- Editorial Journal -->
    <section class="section journal-section" v-if="recentPosts.length">
      <div class="container-wide">
        <div class="section-intro section-intro--row reveal">
          <div>
            <span class="section-eyebrow">{{ $t('home.blog.eyebrow') }}</span>
            <h2>{{ $t('home.blog.title') }}</h2>
          </div>
          <button class="btn btn-outline journal-all-btn" @click="$router.push('/blog')">
            {{ $t('home.blog.readMore') }}
          </button>
        </div>

        <div class="journal-layout">
          <article
            v-if="featuredPost"
            class="journal-featured reveal"
            @click="goToPost(featuredPost)"
          >
            <div class="journal-cover">
              <CoverArt
                :seed="featuredPost.id"
                :category="featuredPost.category"
                :label="categoryLabel(featuredPost.category)"
                size="lg"
              />
            </div>
            <div class="journal-featured-body">
              <time>{{ featuredPost.date }}</time>
              <h3>{{ featuredPost.title }}</h3>
              <p>{{ featuredPost.excerpt }}</p>
              <span class="journal-meta">{{ $t('home.blog.readTime', { n: featuredPost.readingTime }) }}</span>
            </div>
          </article>

          <div class="journal-list">
            <article
              v-for="(post, index) in sidebarPosts"
              :key="post.id"
              class="journal-item reveal"
              :class="'reveal-delay-' + (index + 1)"
              @click="goToPost(post)"
            >
              <div class="journal-item-cover">
                <CoverArt
                  :seed="post.id"
                  :category="post.category"
                  size="sm"
                />
              </div>
              <div class="journal-item-body">
                <span class="journal-item-cat">{{ categoryLabel(post.category) }}</span>
                <h4>{{ post.title }}</h4>
                <span class="journal-meta">{{ post.date }} · {{ $t('home.blog.readTime', { n: post.readingTime }) }}</span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Band -->
    <section class="cta-band">
      <div class="cta-band-inner container-wide reveal">
        <div class="cta-band-copy">
          <span class="section-eyebrow cta-eyebrow">{{ $t('home.cta.eyebrow') }}</span>
          <h2>{{ $t('home.cta.title') }}</h2>
          <p>{{ $t('home.cta.subtitle') }}</p>
        </div>
        <button class="btn btn-primary btn-glow cta-btn" @click="$router.push('/contact')">
          {{ $t('home.cta.button') }}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
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
import { getCategoryLabel } from '@/utils/categoryLabel'
import CoverArt from '@/components/CoverArt.vue'
import HeroParticleField from '@/components/HeroParticleField.vue'
import { useReadHistory } from '@/composables/useReadHistory'

const router = useRouter()
const { locale } = useI18n()
const blogStore = useBlogStore()
const { continueReading } = useReadHistory()

const { observe } = useReveal()

const continuePost = computed(() => {
  const entry = continueReading.value
  if (!entry) return null
  return blogStore.getPostById(entry.id)
})

const recentPosts = computed(() => blogStore.getRecentPosts(3))
const featuredPost = computed(() => recentPosts.value[0] || null)
const sidebarPosts = computed(() => recentPosts.value.slice(1))

// Journal / continue cards mount after ensureLoaded — re-observe late .reveal nodes
onMounted(async () => {
  await blogStore.ensureLoaded()
  await nextTick()
  observe()
})

watch([recentPosts, continuePost], () => {
  nextTick(() => observe())
})


const categoryLabel = category => getCategoryLabel(category, locale.value)

const goToPost = post => {
  router.push(`/blog/${post.id}/${encodeURIComponent(post.slug)}`)
}

const skills = [
  { key: 'camera' },
  { key: 'embedded' },
  { key: 'writing' }
]
</script>

<style scoped>
.home {
  padding-top: var(--nav-height);
}

/* ─── Hero ─── */
.hero {
  position: relative;
  min-height: var(--hero-min-height);
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--color-hero-bg);
  color: var(--color-hero-text);
  overflow: hidden;
  /* ~96px bottom so next section title sits 80–120px below first screen */
  padding: var(--space-16) 0 var(--space-24);
}

.hero-noise {
  position: absolute;
  inset: 0;
  z-index: 0;
  /* Soft grain — lighter on mist so lattice / title stay primary */
  opacity: 0.1;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
  pointer-events: none;
  mix-blend-mode: multiply;
}

/* Must stay compound — bare html.dark { opacity } washes the whole page */
html.dark .hero-noise {
  opacity: 0.10;
  mix-blend-mode: overlay;
}

.hero-mesh {
  position: absolute;
  inset: 0;
  z-index: 0;
  /* Softened ~25% vs prior 0.55 */
  opacity: 0.4;
  background:
    radial-gradient(ellipse 70% 55% at 15% 45%, var(--color-mesh-1) 0%, transparent 55%),
    radial-gradient(ellipse 50% 45% at 85% 25%, var(--color-mesh-2) 0%, transparent 50%),
    radial-gradient(ellipse 40% 35% at 70% 80%, var(--color-mesh-3) 0%, transparent 45%);
  pointer-events: none;
}

.hero-grid {
  position: relative;
  z-index: 2;
  max-width: 720px;
}

.hero-eyebrow {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-mist);
  margin-bottom: var(--space-5);
}

.hero-title {
  font-family: var(--font-sans);
  font-size: clamp(28px, 4.2vw, 44px);
  font-weight: 600;
  line-height: 1.28;
  letter-spacing: -0.02em;
  max-width: 18em;
  margin-bottom: var(--space-4);
  color: var(--color-hero-text);
}

.hero-slogan {
  font-family: var(--font-mono);
  font-size: 14px;
  letter-spacing: 0.04em;
  color: var(--color-mist);
  margin-bottom: 0;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
  margin-top: var(--space-8);
}

.hero .btn-primary {
  font-size: 15px;
  padding: 12px 22px;
  border-radius: var(--radius-md);
  /* CTA tokens: ice-blue fill + near-black text in both themes */
  background: var(--color-cta-bg);
  color: var(--color-cta-text);
}

/* Secondary CTA — theme tokens: mist-readable on light, ice on snow-night */
.btn-ghost {
  font-size: 15px;
  padding: 12px 22px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-hero-ghost-border);
  background: transparent;
  color: var(--color-hero-ghost-text);
  cursor: pointer;
  font-family: var(--font-mono);
  /* Color + light press: shared .btn-ghost motion in apple-design.css */
}

@media (hover: hover) and (pointer: fine) {
  .btn-ghost:hover {
    background: var(--color-hero-ghost-hover-bg);
    border-color: var(--color-hero-ghost-hover-border);
    color: var(--color-hero-ghost-hover-text);
  }
}

/* Continue reading */
.continue-section {
  padding: var(--space-8) 0 0;
}

.continue-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5) var(--space-6);
  background: var(--color-accent-light);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  /* Hover / press: shared .continue-card motion in apple-design.css */
}

.continue-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  border-radius: var(--radius-md);
  color: var(--color-accent);
}

.continue-body {
  flex: 1;
  min-width: 0;
}

.continue-body h3 {
  font-size: 17px;
  margin: var(--space-1) 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.continue-body p {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0;
}

.continue-arrow {
  flex-shrink: 0;
  color: var(--color-accent);
}

/* ─── Expertise Bento ─── */
.expertise-section {
  background: var(--color-bg);
}

.section-desc {
  font-size: 17px;
  color: var(--color-text);
  margin-top: var(--space-3);
  line-height: 1.58;
  max-width: 520px;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
  gap: var(--space-4);
}

.bento-card {
  position: relative;
  padding: var(--space-8);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  overflow: hidden;
  /* Hover / press: shared .bento-card motion in apple-design.css */
}

.bento-card--camera {
  grid-row: span 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 320px;
}

.bento-index {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--color-accent);
  margin-bottom: var(--space-6);
}

.bento-card h3 {
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-2);
}

.bento-card p {
  font-size: 15px;
  line-height: 1.55;
  color: var(--color-text);
}

.bento-glow {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0;
  transition: opacity var(--duration-slow) var(--ease-out);
  pointer-events: none;
}

.bento-card--camera .bento-glow { background: var(--color-cta-bg); top: -40px; right: -40px; }
.bento-card--embedded .bento-glow { background: var(--color-mist); bottom: -60px; left: -20px; }
.bento-card--writing .bento-glow { background: var(--color-cta-bg); top: -30px; left: 50%; }

@media (hover: hover) and (pointer: fine) {
  .bento-card:hover .bento-glow {
    opacity: 0.07;
  }
}

/* ─── Journal ─── */
.journal-section {
  background: var(--color-bg-secondary);
}

.section-intro--row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-6);
  max-width: none;
}

.journal-all-btn {
  flex-shrink: 0;
  margin-bottom: var(--space-2);
}

.journal-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: var(--space-6);
  align-items: start;
}

.journal-featured {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  /* Hover / press: shared .journal-featured motion in apple-design.css */
}

.journal-cover {
  height: 240px;
  position: relative;
  overflow: hidden;
}

.journal-item-cover {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-md);
  flex-shrink: 0;
  overflow: hidden;
}

.journal-featured-body {
  padding: var(--space-6) var(--space-6) var(--space-8);
}

.journal-featured-body time {
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.journal-featured-body h3 {
  font-size: clamp(22px, 2.5vw, 28px);
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: var(--space-2) 0 var(--space-3);
  line-height: 1.2;
}

.journal-featured-body p {
  font-size: 15px;
  line-height: 1.55;
  color: var(--color-text);
  margin-bottom: var(--space-4);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.journal-meta {
  font-size: 13px;
  color: var(--color-accent);
}

.journal-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.journal-item {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  /* Hover / press: shared .journal-item motion in apple-design.css */
}

.journal-item-cover {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-md);
  flex-shrink: 0;
  overflow: hidden;
}

.journal-item-body {
  flex: 1;
  min-width: 0;
}

.journal-item-cat {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.journal-item-body h4 {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: var(--space-1) 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}


/* ─── CTA Band ─── */
.cta-band {
  padding: var(--space-20) var(--space-6);
  background: var(--color-bg);
}

.cta-band-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-8);
  padding: var(--space-12) var(--space-10);
  border-radius: var(--radius-lg);
  background: var(--color-hero-bg);
  color: var(--color-hero-text);
  border: 1px solid var(--color-hero-cta-border);
  position: relative;
  overflow: hidden;
}

.cta-band-inner::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 80% at 100% 50%, var(--color-mesh-1) 0%, transparent 60%);
  pointer-events: none;
}

.cta-band-copy {
  position: relative;
  max-width: 520px;
}

.cta-eyebrow {
  /* Align with Hero mist labels (not ad-hoc white/50) */
  color: var(--color-mist);
}

.cta-band-copy h2 {
  color: var(--color-hero-text);
  font-size: clamp(24px, 3vw, 36px);
  letter-spacing: -0.02em;
  margin-bottom: var(--space-3);
}

.cta-band-copy p {
  color: var(--color-hero-muted);
  font-size: 16px;
  line-height: 1.55;
}

.cta-btn {
  position: relative;
  flex-shrink: 0;
  font-size: 16px;
  padding: 14px 28px;
}

/* ─── Responsive ─── */
@media (max-width: 1068px) {
  .hero-grid {
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }

  .hero-title {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-actions {
    justify-content: center;
  }

  .journal-layout {
    grid-template-columns: 1fr;
  }

  .section-intro--row {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 734px) {
  .hero {
    padding-top: var(--space-10);
    min-height: auto;
  }

  .bento-grid {
    grid-template-columns: 1fr;
  }

  .bento-card--camera {
    grid-row: auto;
    min-height: auto;
  }

  .cta-band-inner {
    flex-direction: column;
    align-items: flex-start;
    padding: var(--space-8);
  }

  .cta-btn {
    width: 100%;
    justify-content: center;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .hero .btn-primary,
  .btn-ghost {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
}

</style>
