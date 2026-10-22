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
      <div class="container-wide">
        <h1 class="reveal">
          {{ $t('life.title') }}
        </h1>
        <div class="life-controls reveal reveal-delay-1">
          <div
            class="filter-chips"
            role="tablist"
          >
            <button
              type="button"
              class="chip"
              :class="{ active: !selectedYear && !selectedMonth }"
              @click="resetFilters"
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
              v-for="month in monthChips"
              :key="month.value"
              type="button"
              class="chip"
              :class="{ active: selectedMonth === month.value }"
              @click="selectedMonth = selectedMonth === month.value ? null : month.value"
            >
              {{ month.label }}
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

    <section class="section life-body">
      <div class="container-wide">
        <div
          v-if="filteredPosts.length > 0"
          :key="`${selectedCategory}-${selectedYear}-${selectedMonth}-${searchQuery}`"
          class="life-grid"
        >
          <article
            v-for="(post, index) in filteredPosts"
            :key="post.id"
            class="life-card reveal"
            :class="'reveal-delay-' + ((index % 3) + 1)"
          >
            <div class="life-cover">
              <CoverArt
                :seed="post.id"
                :category="post.category"
                :image="post.image"
                size="lg"
              />
            </div>
            <div class="life-card-body">
              <h3>{{ post.title }}</h3>
              <p class="life-desc">
                {{ post.description }}
              </p>
              <div
                v-if="postTags(post).length"
                class="life-tags"
              >
                <span
                  v-for="tag in postTags(post)"
                  :key="tag"
                  class="tag tag-accent"
                >{{ tag }}</span>
              </div>
              <div
                v-if="archiveOn"
                class="life-footer"
              >
                <span>{{ post.date }}</span>
              </div>
            </div>
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
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useReveal } from '@/composables/useReveal'
import { useDebouncedRef } from '@/composables/useDebouncedRef'
import CoverArt from '@/components/CoverArt.vue'

const route = useRoute()
const { t, tm, locale } = useI18n()
const selectedCategory = ref('all')
const selectedYear = ref(null)
const selectedMonth = ref(null)
const archiveOn = computed(() => route.query.archive === '1')
const searchInput = ref('')
const searchQuery = useDebouncedRef(searchInput, 200)
const { observe } = useReveal()

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

const monthChips = computed(() => {
  const labels = locale.value === 'en' ? ['Mar', 'Feb', 'Jan'] : ['3月', '2月', '1月']
  return [3, 2, 1].map((value, index) => ({ value, label: labels[index] }))
})

const filteredPosts = computed(() => {
  const q = String(searchQuery.value || '').toLowerCase().trim()
  return posts.value.filter(post => {
    const catOk = selectedCategory.value === 'all' || post.category === selectedCategory.value
    const postDate = post.date ? new Date(post.date) : null
    const yearOk = !selectedYear.value || (postDate && String(postDate.getFullYear()) === selectedYear.value)
    const monthOk = !selectedMonth.value || (postDate && postDate.getMonth() + 1 === selectedMonth.value)
    if (!catOk || !yearOk || !monthOk) return false
    if (!q) return true
    const hay = [post.title, post.description, ...(post.tags || [])].join(' ').toLowerCase()
    return hay.includes(q)
  })
})

const postTags = post => {
  if (Array.isArray(post.tags) && post.tags.length) return post.tags
  const key = `life.categories.${post.category}`
  const label = t(key)
  return label && label !== key ? [label] : []
}

const resetFilters = () => {
  selectedCategory.value = 'all'
  selectedYear.value = null
  selectedMonth.value = null
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
  background: transparent;
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
.life-body {
  position: relative;
  z-index: 1;
}

.life-body.section {
  padding-top: 0;
  padding-bottom: 80px;
}

.life-header {
  padding: var(--space-12) 0 var(--space-6);
}

.life-header h1 {
  font-size: clamp(36px, 5vw, 48px);
  margin-bottom: var(--space-6);
}

.life-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  justify-content: flex-start;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 8px 16px;
  border-radius: var(--radius-full);
  border: none;
  background: var(--color-pill-bg);
  box-shadow: var(--shadow-xs);
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out),
              color var(--duration-fast) var(--ease-out),
              border-color var(--duration-fast) var(--ease-out);
}

.chip.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-accent-contrast);
}

html.dark .chip:not(.active) {
  background: transparent;
  border-color: var(--color-accent-border);
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  width: min(260px, 100%);
  padding: 10px 16px;
  border-radius: var(--radius-full);
  background: var(--color-card-bg);
  border: 1px solid var(--color-card-border);
  color: var(--color-text-tertiary);
  box-shadow: var(--shadow-sm), var(--color-card-glow);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--color-text);
  font-size: 14px;
  font-family: var(--font-sans);
  outline: none;
  min-width: 0;
}

.life-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.life-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm), var(--color-card-glow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.life-cover {
  height: 168px;
  margin: 12px 12px 0;
  border-radius: 16px;
  overflow: hidden;
}

.life-card-body {
  padding: 18px 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.life-card-body h3 {
  font-size: 18px;
  line-height: 1.3;
}

.life-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.life-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
  padding-top: 8px;
}

.life-footer {
  padding-top: 4px;
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.empty-state {
  text-align: center;
  padding: 64px 16px;
  color: var(--color-text-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

@media (max-width: 960px) {
  .life-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 640px) {
  .life-grid {
    grid-template-columns: 1fr;
  }

  .life-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-wrap {
    min-width: 0;
  }
}
</style>
