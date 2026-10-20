<template>
  <div class="life">
    <section class="life-hero">
      <div class="life-hero-mesh" aria-hidden="true" />
      <div class="container-wide life-hero-inner">
        <span class="section-eyebrow reveal">{{ $t('life.eyebrow') }}</span>
        <h1 class="reveal reveal-delay-1">{{ $t('life.title') }}</h1>
        <p class="life-hero-sub reveal reveal-delay-2">{{ $t('life.subtitle') }}</p>
      </div>
    </section>

    <section class="filter-bar">
      <div class="container-wide">
        <div class="filter-pills">
          <button
            class="pill"
            :class="{ active: selectedCategory === 'all' }"
            @click="selectedCategory = 'all'"
          >
            {{ $t('life.all') }}
          </button>
          <button
            v-for="category in categories"
            :key="category.name"
            class="pill"
            :class="{ active: selectedCategory === category.name }"
            @click="selectedCategory = category.name"
          >
            {{ $t(`life.categories.${category.name}`) }}
          </button>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container-wide">
        <div v-if="filteredPosts.length > 0" class="life-grid" :key="selectedCategory">
          <article
            v-for="(post, idx) in filteredPosts"
            :key="post.id"
            class="life-card reveal life-card-stagger"
            :class="{ featured: idx === 0 }"
            :style="{ animationDelay: `${Math.min(idx, 8) * 40}ms` }"
          >
            <div class="life-card-image">
              <CoverArt
                :seed="post.id"
                :category="post.category"
                size="lg"
              />
              <div class="life-card-date">
                <span class="date-day">{{ getDay(post.date) }}</span>
                <span class="date-month">{{ getMonth(post.date) }}</span>
              </div>
            </div>
            <div class="life-card-body">
              <div class="life-card-tags">
                <span class="tag tag-accent" v-for="tag in post.tags" :key="tag">{{ tag }}</span>
              </div>
              <h3>{{ post.title }}</h3>
              <p>{{ post.description }}</p>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          <p>{{ $t('life.empty') }}</p>
          <button class="btn btn-outline" @click="selectedCategory = 'all'">{{ $t('life.viewAll') }}</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useReveal } from '@/composables/useReveal'
import CoverArt from '@/components/CoverArt.vue'

const { locale, tm } = useI18n()
const selectedCategory = ref('all')
const { observe } = useReveal()

const categories = [
  { name: 'travel' },
  { name: 'food' },
  { name: 'reading' },
  { name: 'photography' },
  { name: 'thoughts' }
]

const posts = computed(() => {
  const items = tm('life.posts')
  return Array.isArray(items) ? items : []
})

const filteredPosts = computed(() => {
  if (selectedCategory.value === 'all') return posts.value
  return posts.value.filter(post => post.category === selectedCategory.value)
})

const getDay = dateStr => new Date(dateStr).getDate().toString().padStart(2, '0')

const getMonth = dateStr =>
  new Intl.DateTimeFormat(locale.value === 'zh' ? 'zh-CN' : 'en-US', {
    month: 'short'
  }).format(new Date(dateStr))

onMounted(() => observe())

watch(filteredPosts, () => {
  nextTick(() => observe())
})
</script>

<style scoped>
.life {
  padding-top: var(--nav-height);
  min-height: 100vh;
  background: var(--color-bg);
}

.life-hero {
  position: relative;
  padding: var(--space-16) 0 var(--space-8);
  overflow: hidden;
}

.life-hero-mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 45% 40% at 75% 30%, var(--color-mesh-3) 0%, transparent 50%),
    radial-gradient(ellipse 40% 35% at 15% 70%, var(--color-mesh-1) 0%, transparent 45%);
  pointer-events: none;
}

.life-hero-inner {
  position: relative;
  max-width: 640px;
}

.life-hero-inner h1 {
  font-size: clamp(36px, 5vw, 52px);
  letter-spacing: -0.03em;
  margin-bottom: var(--space-3);
}

.life-hero-sub {
  font-size: 18px;
  color: var(--color-text-secondary);
  line-height: 1.58;
}

.filter-bar {
  position: sticky;
  top: var(--nav-height);
  z-index: 50;
  padding: var(--space-4) 0;
  background: var(--color-nav-bg);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--color-divider);
}

.filter-pills {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  justify-content: flex-start;
}

.pill {
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 600;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-family: var(--font-sans);
  transition: background var(--duration-fast) var(--ease-out),
              color var(--duration-fast) var(--ease-out),
              border-color var(--duration-fast) var(--ease-out),
              transform 0.12s var(--ease-out);
  white-space: nowrap;
}

.pill:active {
  transform: scale(0.97);
  transition: transform 0.1s var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .pill:hover {
    border-color: var(--color-text-tertiary);
    color: var(--color-text);
  }
}

.pill.active {
  background: var(--color-text);
  color: var(--color-bg);
  border-color: var(--color-text);
}

.life-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6);
}

.life-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform var(--duration-base) var(--ease-out);
}

@keyframes lifeStaggerIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.life-card-stagger {
  animation: lifeStaggerIn 0.2s var(--ease-out) both;
}

@media (hover: hover) and (pointer: fine) {
  .life-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
}

.life-card.featured {
  grid-column: 1 / -1;
}

.life-card.featured .life-card-image {
  height: 360px;
}

.life-card-image {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
}

.life-card-date {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  z-index: 2;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 48px;
}

.date-day {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  line-height: 1.2;
}

.date-month {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
}

.life-card-body {
  padding: var(--space-5) var(--space-6) var(--space-6);
}

.life-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.life-card-body h3 {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: var(--space-2);
  color: var(--color-text);
}

.life-card-body p {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.empty-state {
  text-align: center;
  padding: var(--space-16) 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.empty-state p {
  color: var(--color-text-tertiary);
  font-size: 17px;
}

@media (prefers-reduced-motion: reduce) {
  .life-card-stagger {
    animation: none;
  }
}

@media (max-width: 734px) {
  .life-grid {
    grid-template-columns: 1fr;
  }

  .life-card.featured .life-card-image {
    height: 240px;
  }

  .filter-pills {
    overflow-x: auto;
    flex-wrap: nowrap;
    justify-content: flex-start;
    padding-bottom: var(--space-1);
  }
}
</style>
