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
              :class="{ active: selectedCategory === 'all' && !selectedYear && !selectedMonth }"
              @click="resetFilters"
            >
              {{ $t('life.all') }}
            </button>
            <button
              v-for="cat in categoryChips"
              :key="cat.id"
              type="button"
              class="chip"
              :class="{ active: selectedCategory === cat.id }"
              @click="selectedCategory = selectedCategory === cat.id ? 'all' : cat.id"
            >
              {{ cat.label }}
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
            role="button"
            tabindex="0"
            :aria-label="$t('life.openDetail')"
            @click="openDetail(post)"
            @keydown.enter.prevent="openDetail(post)"
            @keydown.space.prevent="openDetail(post)"
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
              <div class="life-footer">
                <span>{{ cardDate(post) }}</span>
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

    <Teleport to="body">
      <Transition name="life-sheet">
        <div
          v-if="activePost"
          class="life-sheet-overlay"
          @click.self="closeDetail"
        >
          <div
            class="life-sheet"
            role="dialog"
            aria-modal="true"
            :aria-label="activePost.title"
          >
            <button
              type="button"
              class="life-sheet-close"
              :aria-label="$t('life.closeDetail')"
              @click="closeDetail"
            >
              ×
            </button>
            <div class="life-sheet-cover">
              <CoverArt
                :seed="activePost.id"
                :category="activePost.category"
                :image="activePost.image"
                size="lg"
              />
            </div>
            <div class="life-sheet-body">
              <p class="life-sheet-date">
                {{ cardDate(activePost) }}
              </p>
              <h2>{{ activePost.title }}</h2>
              <p class="life-sheet-desc">
                {{ activePost.description }}
              </p>
              <div
                v-if="postTags(activePost).length"
                class="life-tags"
              >
                <span
                  v-for="tag in postTags(activePost)"
                  :key="tag"
                  class="tag tag-accent"
                >{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useReveal } from '@/composables/useReveal'
import { useDebouncedRef } from '@/composables/useDebouncedRef'
import CoverArt from '@/components/CoverArt.vue'

const route = useRoute()
const router = useRouter()
const { t, tm, locale } = useI18n()
const selectedCategory = ref('all')
const selectedYear = ref(null)
const selectedMonth = ref(null)
const searchInput = ref('')
const searchQuery = useDebouncedRef(searchInput, 200)
const activePost = ref(null)
const { observe } = useReveal()

const posts = computed(() => {
  const items = tm('life.posts')
  return Array.isArray(items) ? items : []
})

const categoryChips = computed(() => {
  const seen = new Set()
  const chips = []
  posts.value.forEach(post => {
    if (!post.category || seen.has(post.category)) return
    seen.add(post.category)
    const key = `life.categories.${post.category}`
    const label = t(key)
    chips.push({ id: post.category, label: label !== key ? label : post.category })
  })
  return chips
})

const years = computed(() => {
  const set = new Set()
  posts.value.forEach(post => {
    if (post.date) set.add(String(new Date(post.date).getFullYear()))
  })
  return Array.from(set).sort((a, b) => Number(b) - Number(a))
})

const monthChips = computed(() => {
  const labels = locale.value === 'en'
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    : ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const months = new Set()
  posts.value.forEach(post => {
    if (!post.date) return
    const d = new Date(post.date)
    if (selectedYear.value && String(d.getFullYear()) !== selectedYear.value) return
    months.add(d.getMonth() + 1)
  })
  return Array.from(months)
    .sort((a, b) => b - a)
    .map(value => ({ value, label: labels[value - 1] }))
})

const cardDate = post => {
  if (!post?.date) return ''
  const match = String(post.date).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return String(post.date)
  const [, y, m, d] = match
  if (locale.value === 'en') return `${y}-${m}-${d}`
  return `${y}年${Number(m)}月${Number(d)}日`
}

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

const syncDetailToRoute = post => {
  const query = { ...route.query }
  if (post) query.id = String(post.id)
  else delete query.id
  router.replace({ query })
}

const openDetail = post => {
  activePost.value = post
  syncDetailToRoute(post)
}

const closeDetail = () => {
  activePost.value = null
  syncDetailToRoute(null)
}

const resetFilters = () => {
  selectedCategory.value = 'all'
  selectedYear.value = null
  selectedMonth.value = null
  searchInput.value = ''
}

const onKeydown = e => {
  if (e.key === 'Escape' && activePost.value) closeDetail()
}

watch(monthChips, chips => {
  if (selectedMonth.value && !chips.some(chip => chip.value === selectedMonth.value)) {
    selectedMonth.value = null
  }
})

watch(
  () => route.query.id,
  id => {
    if (!id) {
      activePost.value = null
      return
    }
    const post = posts.value.find(item => String(item.id) === String(id))
    activePost.value = post || null
  },
  { immediate: true }
)

onMounted(() => {
  observe()
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

watch(filteredPosts, () => {
  nextTick(() => observe())
})

watch(activePost, post => {
  document.body.style.overflow = post ? 'hidden' : ''
})
</script>

<style scoped>
.life {
  position: relative;
  padding-top: var(--nav-height);
  min-height: 100vh;
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
    radial-gradient(ellipse 50% 40% at 18% 20%, var(--color-mesh-1) 0%, transparent 55%),
    radial-gradient(ellipse 40% 35% at 85% 70%, var(--color-mesh-2) 0%, transparent 50%);
}

.life-snow {
  position: absolute;
  inset: 0;
  opacity: 0.35;
  background-image:
    radial-gradient(1.5px 1.5px at 12% 18%, rgba(255, 255, 255, 0.7) 0%, transparent 100%),
    radial-gradient(1px 1px at 40% 62%, rgba(255, 255, 255, 0.55) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 72% 28%, rgba(255, 255, 255, 0.65) 0%, transparent 100%),
    radial-gradient(1px 1px at 88% 74%, rgba(255, 255, 255, 0.5) 0%, transparent 100%);
}

html:not(.dark) .life-snow {
  opacity: 0;
}

.life-header,
.life-body {
  position: relative;
  z-index: 1;
}

.life-header {
  padding: 36px 0 8px;
}

.life-header h1 {
  font-size: clamp(36px, 5vw, 52px);
  margin: 0 0 20px;
  letter-spacing: -0.03em;
}

.life-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
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
  border: 1px solid var(--color-accent-border);
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
  cursor: pointer;
  transition: transform 0.16s var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .life-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md), var(--color-card-glow);
  }
}

.life-card:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
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
  padding-top: 4px;
}

.life-footer {
  margin-top: auto;
  padding-top: 8px;
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

.life-sheet-overlay {
  position: fixed;
  inset: 0;
  z-index: 2800;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.48);
  backdrop-filter: blur(6px);
}

.life-sheet {
  position: relative;
  width: min(640px, 100%);
  max-height: min(860px, 92vh);
  overflow: auto;
  background: var(--color-card-bg);
  border: 1px solid var(--color-card-border);
  border-radius: 24px;
  box-shadow: var(--shadow-lg), var(--color-card-glow);
}

.life-sheet-close {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 2;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}

.life-sheet-cover {
  height: min(320px, 42vh);
  overflow: hidden;
}

.life-sheet-cover :deep(.cover-art) {
  width: 100%;
  height: 100%;
  min-height: 100%;
}

.life-sheet-cover :deep(.cover-art-img),
.life-sheet-cover :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.life-sheet-body {
  padding: 24px 28px 28px;
}

.life-sheet-date {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.life-sheet-body h2 {
  margin: 0 0 12px;
  font-size: clamp(24px, 3vw, 32px);
  line-height: 1.25;
}

.life-sheet-desc {
  margin: 0 0 16px;
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-text-secondary);
}

.life-sheet-enter-active,
.life-sheet-leave-active {
  transition: opacity 180ms var(--ease-out);
}

.life-sheet-enter-active .life-sheet,
.life-sheet-leave-active .life-sheet {
  transition: transform 180ms var(--ease-out), opacity 180ms var(--ease-out);
}

.life-sheet-enter-from,
.life-sheet-leave-to {
  opacity: 0;
}

.life-sheet-enter-from .life-sheet,
.life-sheet-leave-to .life-sheet {
  transform: translateY(12px) scale(0.98);
  opacity: 0;
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

  .life-sheet-overlay {
    padding: 12px;
    align-items: flex-end;
  }

  .life-sheet {
    max-height: 88vh;
    border-radius: 20px 20px 12px 12px;
  }
}
</style>
