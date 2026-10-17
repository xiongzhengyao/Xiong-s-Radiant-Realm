<template>
  <div class="blog">
    <Transition name="blog-view" mode="out-in">
    <!-- Blog list view -->
    <div v-if="!currentPostId" key="list">
      <section class="blog-hero">
        <div class="container-wide">
          <div class="blog-hero-intro reveal">
            <span class="section-eyebrow">{{ $t('blog.eyebrow') }}</span>
            <h1>{{ $t('blog.title') }}</h1>
            <p class="blog-hero-sub">{{ $t('blog.subtitle') }}</p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container-wide">
          <!-- Filters -->
          <div class="blog-filters reveal">
            <div class="filter-pills">
              <button
                class="pill"
                :class="{ active: selectedCategory === 'all' }"
                @click="selectedCategory = 'all'"
              >
                {{ $t('blog.all') }}
              </button>
              <button
                v-for="category in categories"
                :key="category.name"
                class="pill"
                :class="{ active: selectedCategory === category.name }"
                @click="selectedCategory = category.name"
              >
                {{ category.label }}
              </button>
            </div>
            <div class="filter-actions">
              <select v-model="sortBy" class="sort-select" :aria-label="$t('blog.sortLabel')">
                <option value="newest">{{ $t('blog.sortNewest') }}</option>
                <option value="oldest">{{ $t('blog.sortOldest') }}</option>
                <option value="title">{{ $t('blog.sortTitle') }}</option>
              </select>
              <div class="search-wrapper">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                ref="searchInputRef"
                v-model="searchInput"
                type="search"
                :placeholder="$t('blog.searchPlaceholder')"
                class="search-input"
              />
              <button
                v-if="searchInput"
                type="button"
                class="search-clear"
                :aria-label="$t('blog.clearSearch')"
                @click="searchInput = ''"
              >×</button>
            </div>
            </div>
          </div>

          <!-- Tag cloud -->
          <div v-if="popularTags.length" class="tag-cloud reveal">
            <button
              class="tag-cloud-pill"
              :class="{ active: !selectedTag }"
              @click="selectedTag = ''"
            >
              {{ $t('blog.allTags') }}
            </button>
            <button
              v-for="tag in popularTags"
              :key="tag.name"
              class="tag-cloud-pill"
              :class="{ active: selectedTag === tag.name }"
              @click="selectedTag = selectedTag === tag.name ? '' : tag.name"
            >
              {{ tag.name }}
              <span class="tag-count">{{ tag.count }}</span>
            </button>
          </div>

          <!-- Featured post -->
          <article
            v-if="listFeaturedPost"
            class="post-featured reveal"
            @click="showPostDetail(listFeaturedPost)"
          >
            <div class="post-featured-cover">
              <CoverArt
                :seed="listFeaturedPost.id"
                :category="listFeaturedPost.category"
                :label="categoryLabel(listFeaturedPost.category)"
                :image="listFeaturedPost.image"
                size="featured"
              />
            </div>
            <div class="post-featured-body">
              <span class="tag tag-latest">{{ $t('blog.latest') }}</span>
              <div class="post-card-meta">
                <span class="tag tag-accent">{{ categoryLabel(listFeaturedPost.category) }}</span>
                <span>{{ listFeaturedPost.date }}</span>
                <span class="meta-dot" />
                <span>{{ $t('blog.readTime', { n: listFeaturedPost.readingTime }) }}</span>
              </div>
              <h2>{{ listFeaturedPost.title }}</h2>
              <p>{{ listFeaturedPost.excerpt }}</p>
              <span class="read-more-link">{{ $t('blog.readMore') }} →</span>
            </div>
          </article>

          <!-- Post Grid -->
          <div class="post-grid" :key="`${selectedCategory}-${searchQuery}`">
            <article
              v-for="(post, index) in listGridPosts"
              :key="post.id"
              class="post-card post-card-stagger"
              :style="{ animationDelay: `${Math.min(index, 8) * 40}ms` }"
              @click="showPostDetail(post)"
            >
              <div class="post-card-image">
                <CoverArt
                  :seed="post.id"
                  :category="post.category"
                  :label="categoryLabel(post.category)"
                  :image="post.image"
                  size="md"
                />
              </div>
              <div class="post-card-body">
                <div class="post-card-meta">
                  <span class="tag tag-accent post-category-badge">{{ categoryLabel(post.category) }}</span>
                  <span v-if="isRead(post.id)" class="tag tag-read">{{ $t('blog.read') }}</span>
                  <span>{{ post.date }}</span>
                  <span class="meta-dot"></span>
                  <span>{{ $t('blog.readTime', { n: post.readingTime }) }}</span>
                </div>
                <h3>{{ post.title }}</h3>
                <p>{{ post.excerpt }}</p>
                <div v-if="post.keywords?.length" class="post-keywords">
                  <span class="keyword-label">{{ $t('blog.keywords') }}</span>
                  <span class="keyword-item" v-for="keyword in post.keywords.slice(0, 5)" :key="keyword">
                    {{ keyword }}
                  </span>
                </div>
                <div class="post-card-tags">
                  <span class="tag" v-for="tag in post.tags" :key="tag">{{ tag }}</span>
                </div>
              </div>
            </article>
          </div>

          <!-- Empty state -->
          <div v-if="filteredPosts.length === 0" class="empty-state">
            <p>{{ $t('blog.empty') }}</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Blog post detail view — magazine / tech-doc reading layout -->
    <div v-else key="detail" class="post-detail">
      <div class="reading-progress" :style="{ width: readingProgress + '%' }" />
      <span v-if="readingProgress > 2" class="reading-progress-label">{{ $t('blog.readingProgress', { n: Math.round(readingProgress) }) }}</span>

      <div class="article-shell" v-if="currentPost">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <button class="breadcrumb-link" @click="backToList">{{ $t('blog.breadcrumbBlog') }}</button>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">{{ currentPost.title }}</span>
        </nav>

        <div class="article-toolbar">
          <button class="back-btn" @click="backToList">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            {{ $t('blog.backToList') }}
          </button>
          <div class="toolbar-actions">
            <button
              class="toolbar-btn"
              :class="{ 'is-active': isBookmarked(currentPost.id) }"
              @click="toggleBookmarkAction"
            >
              {{ isBookmarked(currentPost.id) ? $t('blog.bookmarked') : $t('blog.bookmark') }}
            </button>
            <button class="toolbar-btn" @click="copyArticleLink">{{ copyLabel }}</button>
            <button class="toolbar-btn" @click="shareArticle">{{ $t('blog.share') }}</button>
            <button class="toolbar-btn" @click="printArticle">{{ $t('blog.print') }}</button>
          </div>
        </div>

        <!-- Reading stage: hero | TOC ; body | TOC (sticky) -->
        <div class="article-reading" :class="{ 'has-toc': tableOfContents.length > 0 }">
          <header class="article-hero">
            <div class="article-meta">
              <span class="tag tag-accent">{{ categoryLabel(currentPost.category) }}</span>
              <time class="meta-item" :datetime="currentPost.date">{{ currentPost.date }}</time>
              <span class="meta-dot" aria-hidden="true" />
              <span class="meta-item">{{ $t('blog.readTime', { n: currentPost.readingTime }) }}</span>
              <template v-if="currentPost.author">
                <span class="meta-dot" aria-hidden="true" />
                <span class="meta-item meta-author">{{ currentPost.author }}</span>
              </template>
            </div>
            <h1 class="article-title">{{ currentPost.title }}</h1>
            <p v-if="currentPost.excerpt" class="article-lead">{{ currentPost.excerpt }}</p>
            <div v-if="currentPost.tags?.length" class="article-tags">
              <span class="tag" v-for="tag in currentPost.tags" :key="tag">{{ tag }}</span>
            </div>
          </header>

          <aside v-if="tableOfContents.length" class="article-toc" aria-label="Table of contents">
            <p class="toc-title">{{ $t('blog.toc') }}</p>
            <nav class="toc-nav">
              <ul>
                <li
                  v-for="item in tableOfContents"
                  :key="item.id"
                  :class="['toc-level-' + item.level, { 'is-active': activeHeadingId === item.id }]"
                >
                  <a :href="'#' + item.id" @click.prevent="scrollToHeading(item.id)">{{ item.text }}</a>
                </li>
              </ul>
            </nav>
          </aside>

          <div class="article article-main">
            <ArticleAuthor />

            <div v-if="currentPost.image" class="article-cover">
              <img :src="currentPost.image" :alt="currentPost.title" />
            </div>

            <div ref="markdownRef" class="rich-markdown article-prose" v-html="renderedContent" />

            <section v-if="relatedPosts.length" class="related-posts">
              <h2 class="related-title">{{ $t('blog.relatedTitle') }}</h2>
              <div class="related-grid">
                <article
                  v-for="post in relatedPosts"
                  :key="post.id"
                  class="related-card"
                  @click="loadPost(post.id)"
                >
                  <span class="tag tag-accent">{{ categoryLabel(post.category) }}</span>
                  <h3>{{ post.title }}</h3>
                  <p>{{ post.excerpt }}</p>
                </article>
              </div>
            </section>

            <footer class="article-footer">
              <div class="article-nav">
                <button v-if="prevPost" class="nav-post-btn" @click="loadPost(prevPost.id)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                  <span>{{ prevPost.title }}</span>
                </button>
                <button v-if="nextPost" class="nav-post-btn next" @click="loadPost(nextPost.id)">
                  <span>{{ nextPost.title }}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>

      <!-- Mobile share bar -->
      <div class="mobile-share-bar" v-if="currentPost">
        <button class="share-bar-btn" @click="backToList">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <span class="share-bar-title">{{ currentPost.title }}</span>
        <button class="share-bar-btn" @click="shareArticle">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        </button>
      </div>
    </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { toast } from '@/utils/toast'
import { useBlogStore } from '@/stores/blogStore'
import { useMarkdown } from '@/composables/useMarkdown'
import { useReveal } from '@/composables/useReveal'
import { getCategoryLabel } from '@/utils/categoryLabel'
import { extractHeadings, injectHeadingIds } from '@/utils/headings'
import { enhanceMarkdownHtml, bindCodeCopyButtons } from '@/utils/enhanceMarkdown'
import { setPageMetaOverride, clearPageMetaOverride } from '@/composables/usePageMeta'
import CoverArt from '@/components/CoverArt.vue'
import ArticleAuthor from '@/components/ArticleAuthor.vue'
import { APP_CONFIG } from '@/utils/constants'
import { useDebouncedRef } from '@/composables/useDebouncedRef'
import { useReadHistory } from '@/composables/useReadHistory'
import { useBookmarks } from '@/composables/useBookmarks'

const SCROLL_STORAGE_PREFIX = 'blog-scroll-'
let headingObserver = null
let scrollSaveTimer = null

const { render: renderMarkdown } = useMarkdown()
const { observe } = useReveal()
const { locale, t } = useI18n()

const searchInput = ref('')
const searchQuery = useDebouncedRef(searchInput, 200)
const selectedCategory = ref('all')
const selectedTag = ref('')
const sortBy = ref('newest')
const currentPostId = ref(null)
const currentPost = ref(null)
const renderedContent = ref('')
const prevPost = ref(null)
const nextPost = ref(null)
const tableOfContents = ref([])
const readingProgress = ref(0)
const copyLabel = ref('')
const markdownRef = ref(null)
const searchInputRef = ref(null)
const activeHeadingId = ref('')

const updateCopyLabel = () => {
  copyLabel.value = t('blog.copyLink')
}

updateCopyLabel()
watch(locale, updateCopyLabel)

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()
const { updateProgress, markRead, isRead } = useReadHistory()
const { isBookmarked, toggleBookmark } = useBookmarks()
const posts = computed(() => blogStore.posts)
const normalizeCategoryName = name => {
  const value = String(name || '')
    .trim()
    .toLowerCase()
  if (value === 'sensors') return 'sensor'
  return value
}
const categories = computed(() => {
  const used = new Set(posts.value.map(post => post.category))
  return Array.from(used).map(name => ({
    name: normalizeCategoryName(name),
    label: getCategoryLabel(normalizeCategoryName(name), locale.value)
  }))
})

const categoryLabel = category => getCategoryLabel(category, locale.value)

const popularTags = computed(() => {
  const counts = {}
  posts.value.forEach(post => {
    ;(post.tags || []).forEach(tag => {
      counts[tag] = (counts[tag] || 0) + 1
    })
  })
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12)
})

const toggleBookmarkAction = () => {
  if (!currentPost.value) return
  const saved = toggleBookmark(currentPost.value.id)
  toast.success(saved ? t('blog.bookmarkAdded') : t('blog.bookmarkRemoved'))
}

const relatedPosts = computed(() => {
  if (!currentPostId.value) return []
  return blogStore.getRelatedPosts(currentPostId.value, 3)
})

const bindMarkdownEnhancements = () => {
  nextTick(() => {
    bindCodeCopyButtons(markdownRef.value, () => {
      toast.success(t('blog.codeCopied'))
    })
    observeHeadings()
  })
}

const observeHeadings = () => {
  headingObserver?.disconnect()
  if (!tableOfContents.value.length) return
  headingObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) activeHeadingId.value = entry.target.id
      })
    },
    { rootMargin: '-20% 0px -65% 0px', threshold: 0 }
  )
  tableOfContents.value.forEach(item => {
    const el = document.getElementById(item.id)
    if (el) headingObserver.observe(el)
  })
}

const saveScrollPosition = id => {
  if (!id) return
  localStorage.setItem(`${SCROLL_STORAGE_PREFIX}${id}`, String(window.scrollY))
}

const restoreScrollPosition = id => {
  const saved = localStorage.getItem(`${SCROLL_STORAGE_PREFIX}${id}`)
  if (saved) {
    nextTick(() => window.scrollTo({ top: Number(saved), behavior: 'auto' }))
    return true
  }
  return false
}

const postPath = post => `/blog/${post.id}/${encodeURIComponent(post.slug)}`

const showPostDetail = async post => {
  await blogStore.ensureLoaded()
  router.push(postPath(post))
  await loadPost(post.id)
}

const backToList = () => {
  currentPostId.value = null
  currentPost.value = null
  tableOfContents.value = []
  readingProgress.value = 0
  clearPageMetaOverride()
  router.push('/blog')
  nextTick(() => {
    observeRevealElements()
  })
}

const loadPost = async id => {
  await blogStore.ensureLoaded()
  const postData = blogStore.getPostById(id)
  if (!postData) {
    backToList()
    return
  }

  currentPostId.value = id
  currentPost.value = postData
  router.replace(postPath(postData))

  const html = injectHeadingIds(
    enhanceMarkdownHtml(renderMarkdown(postData.content), { title: postData.title })
  )
  renderedContent.value = html
  tableOfContents.value = extractHeadings(html)
  const { prev, next } = blogStore.getAdjacentPosts(id)
  prevPost.value = prev
  nextPost.value = next
  setPageMetaOverride({
    title: postData.title,
    description: postData.excerpt,
    type: 'article',
    canonical: `${APP_CONFIG.SITE_URL}/blog/${postData.id}/${postData.slug}`,
    publishedTime: postData.date,
    image: postData.image
      ? (postData.image.startsWith('http') ? postData.image : `${APP_CONFIG.SITE_URL}${postData.image}`)
      : `${APP_CONFIG.SITE_URL}${APP_CONFIG.IMAGES.OG_DEFAULT}`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: postData.title,
      description: postData.excerpt,
      datePublished: postData.date,
      author: {
        '@type': 'Person',
        name: t('about.profile.name')
      },
      url: `${APP_CONFIG.SITE_URL}/blog/${postData.id}/${postData.slug}`
    }
  })
  if (!restoreScrollPosition(id)) {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
  bindMarkdownEnhancements()
}

const scrollToHeading = id => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' })
}

const copyArticleLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copyLabel.value = t('blog.copySuccess')
    toast.success(t('blog.copySuccess'))
    window.setTimeout(updateCopyLabel, 2000)
  } catch {
    toast.error(t('blog.copyFailed'))
  }
}

const shareArticle = async () => {
  const shareData = {
    title: currentPost.value?.title,
    text: currentPost.value?.excerpt,
    url: window.location.href
  }
  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch {
      /* user cancelled */
    }
    return
  }
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.title)}&url=${encodeURIComponent(shareData.url)}`
  window.open(twitterUrl, '_blank', 'noopener,noreferrer')
}

const printArticle = () => {
  window.print()
}

const onReadingScroll = () => {
  if (!currentPostId.value) return
  const doc = document.documentElement
  const scrollTop = doc.scrollTop
  const height = doc.scrollHeight - doc.clientHeight
  const progress = height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0
  readingProgress.value = progress
  updateProgress(currentPostId.value, progress)
  if (progress >= 90) {
    markRead(currentPostId.value, progress)
  }
  clearTimeout(scrollSaveTimer)
  scrollSaveTimer = setTimeout(() => saveScrollPosition(currentPostId.value), 300)
}

const syncCategoryToUrl = () => {
  if (currentPostId.value) return
  const query = { ...route.query }
  if (selectedCategory.value === 'all') delete query.cat
  else query.cat = selectedCategory.value
  router.replace({ query })
}

const onBlogKeydown = e => {
  if (currentPostId.value) return
  const tag = document.activeElement?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA') return
  if (e.key === '/') {
    e.preventDefault()
    searchInputRef.value?.focus()
  }
}

const filteredPosts = computed(() => {
  const q = searchQuery.value.toLowerCase()
  let result = posts.value.filter(post => {
    const searchable = [
      post.title,
      post.excerpt,
      ...(post.tags || []),
      ...(post.keywords || []),
      post.category
    ]
      .join(' ')
      .toLowerCase()
    const matchesSearch = searchable.includes(q)
    const matchesCategory = selectedCategory.value === 'all' || post.category === selectedCategory.value
    const matchesTag = !selectedTag.value || (post.tags || []).includes(selectedTag.value)
    return matchesSearch && matchesCategory && matchesTag
  })

  if (sortBy.value === 'oldest') {
    result = [...result].sort((a, b) => new Date(a.date) - new Date(b.date))
  } else if (sortBy.value === 'title') {
    result = [...result].sort((a, b) => a.title.localeCompare(b.title, locale.value))
  } else {
    result = [...result].sort((a, b) => new Date(b.date) - new Date(a.date))
  }
  return result
})

const listFeaturedPost = computed(() => {
  if (selectedCategory.value !== 'all' || searchQuery.value) return null
  return filteredPosts.value[0] || null
})

const listGridPosts = computed(() => {
  if (listFeaturedPost.value) return filteredPosts.value.slice(1)
  return filteredPosts.value
})

const observeRevealElements = () => {
  observe()
}

onMounted(async () => {
  await blogStore.ensureLoaded()
  if (route.query.cat) selectedCategory.value = String(route.query.cat)
  if (route.params.id) await loadPost(route.params.id)
  window.addEventListener('scroll', onReadingScroll, { passive: true })
  window.addEventListener('keydown', onBlogKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onReadingScroll)
  window.removeEventListener('keydown', onBlogKeydown)
  headingObserver?.disconnect()
  clearTimeout(scrollSaveTimer)
  clearPageMetaOverride()
})

watch(selectedCategory, () => {
  syncCategoryToUrl()
})

watch(() => route.params, async params => {
  if (params.id) await loadPost(params.id)
  else {
    currentPostId.value = null
    currentPost.value = null
    nextTick(() => {
      observeRevealElements()
    })
  }
})

watch(filteredPosts, () => {
  nextTick(() => {
    observeRevealElements()
  })
})
</script>

<style scoped>
.blog {
  padding-top: var(--nav-height);
  min-height: 100vh;
  background: var(--color-bg);
}

.blog-view-enter-active,
.blog-view-leave-active {
  transition: opacity 150ms var(--ease-out);
}

.blog-view-enter-from,
.blog-view-leave-to {
  opacity: 0;
}

/* --- Blog Hero --- */
.blog-hero {
  padding: var(--space-16) 0 var(--space-8);
  background: var(--color-bg);
  position: relative;
}

.blog-hero-intro {
  max-width: 640px;
}

.blog-hero-intro h1 {
  font-size: clamp(36px, 5vw, 56px);
  letter-spacing: -0.03em;
  margin-bottom: var(--space-3);
}

.blog-hero-sub {
  font-size: 18px;
  color: var(--color-text-secondary);
  line-height: 1.58;
}

/* --- Filters --- */
.blog-filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-10);
  flex-wrap: wrap;
}

.filter-pills {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.pill {
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 500;
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

.filter-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.sort-select {
  padding: 10px 12px;
  font-size: 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-input-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  cursor: pointer;
  outline: none;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: calc(-1 * var(--space-4)) 0 var(--space-8);
}

.tag-cloud-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  font-size: 13px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-family: var(--font-sans);
  transition: all var(--duration-fast) var(--ease-out);
}

.tag-cloud-pill.active {
  background: var(--color-accent-light);
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.tag-count {
  font-size: 11px;
  opacity: 0.6;
}

.tag-read {
  background: var(--color-bg-secondary);
  color: var(--color-text-tertiary);
  border: 1px solid var(--color-border);
}

.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  pointer-events: none;
}

.search-input {
  padding: 10px 14px 10px 40px;
  font-size: 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-input-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  width: 220px;
  transition: border-color var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
  outline: none;
}

.search-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-input-focus);
}

.search-clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 50%;
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tag-latest {
  background: #34c759;
  color: #fff;
}

/* --- Featured post --- */
.post-featured {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 0;
  margin-bottom: var(--space-8);
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  transition: transform var(--duration-base) var(--ease-out),
              box-shadow var(--duration-base) var(--ease-out);
}

.post-featured-cover {
  min-height: 280px;
}

.post-featured-body {
  padding: var(--space-8) var(--space-8) var(--space-10);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.post-featured-body h2 {
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: var(--space-3) 0;
  line-height: 1.2;
}

.post-featured-body > p {
  font-size: 16px;
  line-height: 1.55;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-5);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-more-link {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-accent);
  margin-top: auto;
}

@media (hover: hover) and (pointer: fine) {
  .post-featured:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
  }
}

/* --- Post Grid --- */
.post-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6);
}

@keyframes postStaggerIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.post-card-stagger {
  animation: postStaggerIn 0.2s var(--ease-out) both;
}

.post-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform var(--duration-base) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .post-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .post-card:hover .post-card-image img {
    transform: scale(1.04);
  }
}

.post-card-image {
  width: 100%;
  height: 220px;
  overflow: hidden;
  position: relative;
}

.post-category-badge {
  font-size: 12px;
}

.post-card-body {
  padding: var(--space-5) var(--space-6) var(--space-6);
}

.post-card-meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 13px;
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-3);
}

.meta-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--color-text-tertiary);
}

.post-card-body h3 {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: var(--space-2);
  color: var(--color-text);
  letter-spacing: -0.01em;
}

.post-card-body p {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-4);
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.post-keywords {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: var(--space-3);
}

.keyword-label {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.keyword-item {
  font-size: 12px;
  color: var(--color-accent);
  background: var(--color-accent-light);
  border-radius: var(--radius-full);
  padding: 3px 10px;
  line-height: 1.4;
}

.empty-state {
  text-align: center;
  padding: var(--space-16) 0;
  color: var(--color-text-tertiary);
  font-size: 17px;
}

/* --- Post Detail (magazine / tech-doc reading) --- */
.post-detail {
  position: relative;
  padding: 0 0 var(--space-24);
  background:
    radial-gradient(ellipse 80% 40% at 20% 0%, var(--color-mesh-1), transparent 55%),
    radial-gradient(ellipse 60% 35% at 90% 8%, var(--color-mesh-2), transparent 50%),
    var(--color-bg);
}

.article-shell {
  max-width: var(--article-shell-max, 1100px);
  margin: 0 auto;
  padding: var(--space-10) var(--space-6) 0;
}

.reading-progress {
  position: fixed;
  top: var(--nav-height);
  left: 0;
  height: 2px;
  background: var(--color-accent);
  z-index: 999;
  transition: width 80ms linear;
}

.reading-progress-label {
  position: fixed;
  top: calc(var(--nav-height) + 6px);
  right: var(--space-4);
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--color-text-tertiary);
  z-index: 999;
  background: var(--color-card-bg);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 13px;
  font-family: var(--font-mono);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}

.breadcrumb-link {
  background: none;
  border: none;
  padding: 0;
  color: var(--color-accent);
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
}

.breadcrumb-sep {
  color: var(--color-text-tertiary);
}

.breadcrumb-current {
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: min(420px, 55vw);
}

.article-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
  flex-wrap: wrap;
}

.toolbar-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.toolbar-btn {
  padding: 7px 12px;
  font-size: 12px;
  font-family: var(--font-mono);
  letter-spacing: 0.01em;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: border-color var(--duration-fast) var(--ease-out),
              color var(--duration-fast) var(--ease-out),
              background var(--duration-fast) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .toolbar-btn:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
}

.toolbar-btn.is-active {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-light);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 8px 0;
  font-size: 14px;
  font-family: var(--font-mono);
  color: var(--color-accent);
  background: none;
  border: none;
  cursor: pointer;
  transition: opacity var(--duration-fast) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .back-btn:hover {
    opacity: 0.75;
  }
}

/* Masthead — sits in prose column beside TOC */

.article-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
  font-size: 13px;
  font-family: var(--font-mono);
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-5);
}

.meta-item {
  color: var(--color-text-tertiary);
}

.meta-author {
  color: var(--color-text-secondary);
}

.meta-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--color-text-tertiary);
  flex-shrink: 0;
}

.article-title {
  font-family: var(--font-mono);
  font-size: clamp(1.85rem, 3.6vw, 2.65rem);
  font-weight: 700;
  line-height: 1.18;
  letter-spacing: -0.03em;
  color: var(--color-text);
  margin: 0 0 var(--space-4);
}

.article-lead {
  font-size: 1.125rem;
  line-height: 1.65;
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-5);
  max-width: 54ch;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.article-tags .tag {
  font-family: var(--font-mono);
  font-size: 12px;
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.article-cover {
  border-radius: var(--radius-md);
  overflow: hidden;
  margin: 0 0 var(--space-10);
  border: 1px solid var(--color-border);
}

.article-cover img {
  width: 100%;
  height: auto;
  display: block;
}

/* Reading grid: hero | TOC / body | TOC */
.article-reading {
  display: grid;
  grid-template-columns: minmax(0, var(--article-prose-max, 42rem));
  grid-template-areas:
    'hero'
    'main';
  column-gap: var(--space-12);
  row-gap: 0;
  align-items: start;
}

.article-reading.has-toc {
  grid-template-columns: minmax(0, var(--article-prose-max, 42rem)) minmax(180px, 1fr);
  grid-template-areas:
    'hero toc'
    'main toc';
}

.article-hero {
  grid-area: hero;
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-8);
  border-bottom: 1px solid var(--color-divider);
}

.article-main {
  grid-area: main;
  min-width: 0;
  max-width: var(--article-prose-max, 42rem);
}

.article-toc {
  grid-area: toc;
  position: sticky;
  top: calc(var(--nav-height) + var(--space-8));
  align-self: start;
  max-height: calc(100vh - var(--nav-height) - var(--space-12));
  overflow-y: auto;
  padding: 0 0 0 var(--space-5);
  border-left: 1px solid var(--color-border);
  background: transparent;
}

.toc-title {
  font-size: 11px;
  font-weight: 600;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-tertiary);
  margin: 0 0 var(--space-3);
}

.toc-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.article-toc a {
  display: block;
  font-size: 13px;
  line-height: 1.4;
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: 6px 0 6px 10px;
  border-left: 2px solid transparent;
  margin-left: -1px;
  transition: color var(--duration-fast) var(--ease-out),
              border-color var(--duration-fast) var(--ease-out);
}

.article-toc .toc-level-3 a {
  padding-left: calc(10px + var(--space-3));
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.article-toc li.is-active a {
  color: var(--color-accent);
  border-left-color: var(--color-accent);
  font-weight: 500;
}

@media (hover: hover) and (pointer: fine) {
  .article-toc a:hover {
    color: var(--color-accent);
  }
}

.related-posts {
  margin-top: var(--space-16);
  padding-top: var(--space-10);
  border-top: 1px solid var(--color-divider);
}

.related-title {
  font-family: var(--font-mono);
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-5);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
}

.related-card {
  padding: var(--space-4) 0;
  border-top: 1px solid var(--color-border);
  background: transparent;
  cursor: pointer;
  transition: border-color var(--duration-fast) var(--ease-out);
}

.related-card h3 {
  font-size: 15px;
  font-family: var(--font-mono);
  margin: var(--space-2) 0 var(--space-2);
  line-height: 1.35;
}

.related-card p {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

@media (hover: hover) and (pointer: fine) {
  .related-card:hover {
    border-top-color: var(--color-accent);
  }
}

.article-footer {
  margin-top: var(--space-12);
  padding-top: var(--space-8);
  border-top: 1px solid var(--color-divider);
}

.article-nav {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
}

.nav-post-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 12px 0;
  border: none;
  border-radius: 0;
  background: transparent;
  color: var(--color-text);
  font-size: 14px;
  font-family: var(--font-mono);
  cursor: pointer;
  max-width: 45%;
  text-align: left;
  transition: color var(--duration-fast) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .nav-post-btn:hover {
    color: var(--color-accent);
  }
}

.nav-post-btn.next {
  margin-left: auto;
  text-align: right;
}

.nav-post-btn span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-share-bar {
  display: none;
  position: fixed;
  bottom: calc(56px + env(safe-area-inset-bottom, 0px));
  left: 0;
  right: 0;
  z-index: 900;
  height: 48px;
  padding: 0 var(--space-3);
  background: var(--color-nav-bg);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-top: 1px solid var(--color-border);
  align-items: center;
  gap: var(--space-3);
}

.share-bar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.share-bar-title {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-text);
}

@media (max-width: 980px) {
  .article-reading.has-toc {
    grid-template-columns: 1fr;
    grid-template-areas:
      'hero'
      'toc'
      'main';
  }

  .article-toc {
    position: static;
    max-height: none;
    overflow: visible;
    margin: 0 0 var(--space-6);
    padding: 0 0 var(--space-4);
    border-left: none;
    border-bottom: 1px solid var(--color-border);
  }

  .toc-nav ul {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0 var(--space-4);
  }

  .article-toc a {
    border-left: none;
    padding-left: 0;
  }

  .article-toc .toc-level-3 a {
    padding-left: var(--space-3);
  }

  .article-toc li.is-active a {
    border-left-color: transparent;
  }
}

@media (prefers-reduced-motion: reduce) {
  .blog-view-enter-active,
  .blog-view-leave-active {
    transition: none;
  }

  .post-card-stagger {
    animation: none;
  }
}

/* --- Responsive --- */
@media (max-width: 734px) {
  .post-featured {
    grid-template-columns: 1fr;
  }

  .post-featured-cover {
    min-height: 200px;
  }

  .post-grid {
    grid-template-columns: 1fr;
  }

  .blog-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
  }

  .filter-pills {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: var(--space-2);
  }

  .article-shell {
    padding-top: var(--space-8);
  }

  .article-title {
    max-width: none;
  }

  .article-nav {
    flex-direction: column;
  }

  .nav-post-btn {
    max-width: 100%;
  }

  .mobile-share-bar {
    display: flex;
  }

  .post-detail {
    padding-bottom: calc(48px + var(--space-16));
  }
}
</style>
