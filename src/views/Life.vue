<template>
  <div class="life">
    <div
      class="life-atmosphere"
      aria-hidden="true"
    >
      <div class="life-mesh" />
      <div class="life-snow" />
    </div>

    <section class="life-header">
      <div class="container-wide life-header-row">
        <h1 class="reveal">
          {{ $t('life.title') }}
        </h1>
        <div class="life-controls reveal reveal-delay-1">
          <div class="filter-chips">
            <button
              type="button"
              class="chip"
              :class="{ active: selectedCategory === 'all' }"
              @click="selectedCategory = 'all'"
            >
              {{ $t('life.all') }}
            </button>
            <button
              v-for="year in years"
              :key="year"
              type="button"
              class="chip"
              :class="{ active: selectedYear === year }"
              @click="selectedYear = selectedYear === year ? null : year"
            >
              {{ year }}
            </button>
            <button
              v-for="category in categories"
              :key="category.name"
              type="button"
              class="chip"
              :class="{ active: selectedCategory === category.name }"
              @click="selectedCategory = category.name"
            >
              {{ $t(`life.categories.${category.name}`) }}
            </button>
          </div>
          <div class="search-wrap">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            ><circle
              cx="11"
              cy="11"
              r="8"
            /><line
              x1="21"
              y1="21"
              x2="16.65"
              y2="16.65"
            /></svg>
            <input
              v-model="searchInput"
              type="search"
              class="search-input"
              :placeholder="$t('life.searchPlaceholder')"
            >
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container-wide">
        <div
          v-if="filteredPosts.length > 0"
          :key="`${selectedCategory}-${selectedYear}-${searchQuery}`"
          class="life-grid"
        >
          <article
            v-for="(post, idx) in filteredPosts"
            :key="post.id"
            class="life-card reveal"
            :style="{ animationDelay: `${Math.min(idx, 8) * 40}ms` }"
          >
            <div class="life-card-image">
              <CoverArt
                :seed="post.id"
                :category="post.category"
                :image="post.image"
                size="lg"
              />
            </div>
            <p class="life-caption">
              {{ post.title || post.description }}
            </p>
          </article>
        </div>

        <div
          v-else
          class="empty-state"
        >
          <p>{{ $t('life.empty') }}</p>
          <button
            class="btn btn-outline"
            type="button"
            @click="resetFilters"
          >
            {{ $t('life.viewAll') }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useReveal } from '@/composables/useReveal'
import { useDebouncedRef } from '@/composables/useDebouncedRef'
import CoverArt from '@/components/CoverArt.vue'

const { tm } = useI18n()
const selectedCategory = ref('all')
const selectedYear = ref(null)
const searchInput = ref('')
const searchQuery = useDebouncedRef(searchInput, 200)
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

const years = computed(() => {
  const set = new Set()
  posts.value.forEach(post => {
    if (post.date) set.add(String(new Date(post.date).getFullYear()))
  })
  const list = Array.from(set).sort((a, b) => Number(b) - Number(a))
  return list.length ? list : ['2024', '2023']
})

const filteredPosts = computed(() => {
  const q = String(searchQuery.value || '').toLowerCase().trim()
  return posts.value.filter(post => {
    const catOk = selectedCategory.value === 'all' || post.category === selectedCategory.value
    const yearOk = !selectedYear.value || String(new Date(post.date).getFullYear()) === selectedYear.value
    if (!catOk || !yearOk) return false
    if (!q) return true
    const hay = [post.title, post.description, ...(post.tags || [])].join(' ').toLowerCase()
    return hay.includes(q)
  })
})

const resetFilters = () => {
  selectedCategory.value = 'all'
  selectedYear.value = null
  searchInput.value = ''
}

onMounted(() => observe())

watch(filteredPosts, () => {
  nextTick(() => observe())
})
</script>

<style scoped>
.life {
  position: relative;
  padding-top: var(--nav-height);
  min-height: 100vh;
  background: var(--color-bg);
  overflow: hidden;
}

.life-atmosphere {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.life-mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 45% 40% at 75% 30%, var(--color-mesh-3) 0%, transparent 50%),
    radial-gradient(ellipse 40% 35% at 15% 70%, var(--color-mesh-1) 0%, transparent 45%);
}

.life-snow {
  position: absolute;
  inset: 0;
  opacity: 0;
  background-image:
    radial-gradient(1.5px 1.5px at 20% 30%, #fff 0%, transparent 100%),
    radial-gradient(1px 1px at 60% 50%, #fff 0%, transparent 100%),
    radial-gradient(2px 2px at 85% 75%, #fff 0%, transparent 100%);
}

html.dark .life-snow {
  opacity: 0.4;
}

.life-header,
.section {
  position: relative;
  z-index: 1;
}

.life-header {
  padding: var(--space-12) 0 var(--space-6);
}

.life-header-row {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.life-header h1 {
  font-size: clamp(32px, 5vw, 44px);
}

.life-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  justify-content: space-between;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 8px 14px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-sans);
  cursor: pointer;
}

.chip.active {
  background: var(--color-surface);
  border-color: var(--color-border);
  color: var(--color-text);
  box-shadow: var(--shadow-xs);
}

html.dark .chip.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-accent-contrast);
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: min(280px, 100%);
  padding: 10px 16px;
  border-radius: var(--radius-full);
  background: var(--color-input-bg);
  border: 1px solid var(--color-input-border);
  color: var(--color-text-tertiary);
  box-shadow: var(--color-card-glow);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--color-text);
  font-size: 14px;
  font-family: var(--font-sans);
  outline: none;
}

.life-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.life-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm), var(--color-card-glow);
  overflow: hidden;
}

.life-card-image {
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.life-caption {
  margin: 0;
  padding: 12px 14px 14px;
  font-size: 14px;
  color: var(--color-text);
  line-height: 1.4;
}

.empty-state {
  text-align: center;
  padding: 80px 16px;
  color: var(--color-text-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

@media (max-width: 1100px) {
  .life-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 734px) {
  .life-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  .life-controls {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
