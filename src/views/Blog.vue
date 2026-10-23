<template>
  <div class="blog">
    <Transition
      name="blog-view"
      mode="out-in"
    >
      <div
        v-if="!currentPostId"
        key="list"
        class="notes-page"
      >
        <div
          class="notes-atmosphere"
          aria-hidden="true"
        >
          <div class="notes-mesh" />
          <div class="notes-snow" />
        </div>

        <section class="notes-header">
          <div class="container-wide">
            <h1 class="reveal">
              {{ $t('blog.title') }}
            </h1>
            <div class="notes-controls reveal reveal-delay-1">
              <div
                class="filter-chips"
                role="tablist"
              >
                <button
                  type="button"
                  class="chip"
                  :class="{ active: !selectedDesignTag }"
                  @click="selectedDesignTag = ''"
                >
                  {{ $t('blog.all') }}
                </button>
                <button
                  v-for="tag in designTags"
                  :key="tag.id"
                  type="button"
                  class="chip"
                  :class="{ active: selectedDesignTag === tag.id }"
                  @click="selectedDesignTag = selectedDesignTag === tag.id ? '' : tag.id"
                >
                  {{ tag.label }}
                </button>
                <button
                  v-for="year in availableYears"
                  :key="year"
                  type="button"
                  class="chip"
                  :class="{ active: selectedYear === year }"
                  @click="selectedYear = selectedYear === year ? null : year"
                >
                  {{ year }}
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
                  ref="searchInputRef"
                  v-model="searchInput"
                  type="search"
                  class="search-input"
                  :placeholder="$t('blog.searchPlaceholder')"
                >
                <button
                  v-if="searchInput"
                  type="button"
                  class="search-clear"
                  :aria-label="$t('blog.clearSearch')"
                  @click="searchInput = ''"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </section>

        <section class="section notes-body">
          <div class="container-wide">
            <div
              v-if="filteredPosts.length"
              :key="`${selectedCategory}-${selectedYear}-${selectedTag}-${selectedDesignTag}-${searchQuery}`"
              class="notes-grid"
            >
              <article
                v-for="(post, index) in filteredPosts"
                :key="post.id"
                class="note-card reveal"
                :class="'reveal-delay-' + ((index % 3) + 1)"
                @click="showPostDetail(post)"
              >
                <div class="note-cover">
                  <CoverArt
                    :seed="post.id"
                    :category="post.category"
                    :image="coverOf(post)"
                    size="lg"
                  />
                </div>
                <div class="note-body">
                  <h3>{{ post.title }}</h3>
                  <p class="note-excerpt">
                    {{ post.excerpt }}
                  </p>
                  <div class="note-tags">
                    <span class="tag tag-accent">{{ designTag(post).label }}</span>
                  </div>
                  <div class="note-footer">
                    <span>{{ cardDate(post) }}</span>
                  </div>
                </div>
              </article>
            </div>
            <div
              v-else
              class="empty-state"
            >
              <p>{{ $t('blog.empty') }}</p>
            </div>
          </div>
        </section>
      </div>

      <!-- Blog post detail view — magazine / tech-doc reading layout -->
      <div
        v-else
        key="detail"
        class="post-detail"
      >
        <div
          class="reading-progress"
          :style="{ width: readingProgress + '%' }"
        />

        <div
          v-if="currentPost"
          class="article-shell"
        >
          <!-- One chrome row: blog + back | copy + more -->
          <div class="article-chrome">
            <nav
              class="breadcrumb"
              aria-label="Breadcrumb"
            >
              <button
                class="breadcrumb-link"
                @click="backToList"
              >
                {{ $t('blog.breadcrumbBlog') }}
              </button>
              <span
                class="breadcrumb-sep"
                aria-hidden="true"
              >·</span>
              <button
                class="breadcrumb-back"
                @click="backToList"
              >
                {{ $t('blog.backToList') }}
              </button>
            </nav>
            <div class="toolbar-actions">
              <button
                class="toolbar-btn toolbar-btn-primary"
                @click="copyArticleLink"
              >
                {{ copyLabel }}
              </button>
              <div
                class="toolbar-more"
                :class="{ 'is-open': moreMenuOpen }"
              >
                <button
                  type="button"
                  class="toolbar-btn toolbar-more-trigger"
                  :aria-expanded="moreMenuOpen"
                  :aria-label="$t('blog.moreActions')"
                  @click="moreMenuOpen = !moreMenuOpen"
                >
                  ⋯
                </button>
                <div
                  v-if="moreMenuOpen"
                  class="toolbar-menu"
                  role="menu"
                >
                  <button
                    type="button"
                    class="toolbar-menu-item"
                    :class="{ 'is-active': isBookmarked(currentPost.id) }"
                    role="menuitem"
                    @click="runToolbarAction(toggleBookmarkAction)"
                  >
                    {{ isBookmarked(currentPost.id) ? $t('blog.bookmarked') : $t('blog.bookmark') }}
                  </button>
                  <button
                    type="button"
                    class="toolbar-menu-item"
                    role="menuitem"
                    @click="runToolbarAction(shareArticle)"
                  >
                    {{ $t('blog.share') }}
                  </button>
                  <button
                    type="button"
                    class="toolbar-menu-item toolbar-menu-print"
                    role="menuitem"
                    @click="runToolbarAction(printArticle)"
                  >
                    {{ $t('blog.print') }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Reading stage: hero | TOC ; body | TOC (sticky) -->
          <div
            class="article-reading"
            :class="{ 'has-toc': tableOfContents.length > 0 }"
          >
            <header class="article-hero">
              <div class="article-meta">
                <span class="tag tag-accent">{{ designTag(currentPost).label }}</span>
                <time
                  class="meta-item"
                  :datetime="currentPost.date"
                >{{ currentPost.date }}</time>
                <span
                  class="meta-dot"
                  aria-hidden="true"
                />
                <span class="meta-item">{{ $t('blog.readTime', { n: currentPost.readingTime }) }}</span>
                <template v-if="currentPost.author">
                  <span
                    class="meta-dot"
                    aria-hidden="true"
                  />
                  <span class="meta-item meta-author">{{ currentPost.author }}</span>
                </template>
              </div>
              <h1 class="article-title">
                {{ currentPost.title }}
              </h1>
              <p
                v-if="currentPost.excerpt"
                class="article-lead"
              >
                {{ currentPost.excerpt }}
              </p>
              <div
                v-if="heroTags.length"
                class="article-tags"
              >
                <span
                  v-for="tag in heroTags"
                  :key="tag"
                  class="tag"
                >{{ tag }}</span>
              </div>
            </header>

            <aside
              v-if="tableOfContents.length"
              class="article-toc"
              aria-label="Table of contents"
            >
              <!-- Desktop: always-visible sticky nav -->
              <div
                v-if="tocIsWide"
                class="toc-panel toc-panel--desktop"
              >
                <p class="toc-title">
                  {{ $t('blog.toc') }}
                </p>
                <nav class="toc-nav">
                  <ul>
                    <li
                      v-for="item in tableOfContents"
                      :key="'d-' + item.id"
                      :class="['toc-level-' + item.level, { 'is-active': activeHeadingId === item.id }]"
                    >
                      <a
                        :href="'#' + item.id"
                        @click.prevent="scrollToHeading(item.id)"
                      >{{ item.text }}</a>
                    </li>
                  </ul>
                </nav>
              </div>
              <!-- Mobile: collapsed trigger; expands as bottom sheet (no layout shove) -->
              <div
                v-else
                class="toc-panel toc-panel--mobile"
              >
                <button
                  type="button"
                  class="toc-trigger"
                  :aria-expanded="tocSheetOpen"
                  aria-controls="article-toc-sheet"
                  @click="tocSheetOpen = true"
                >
                  <span class="toc-title">{{ $t('blog.toc') }}</span>
                  <span class="toc-count">{{ $t('blog.tocCount', { n: tableOfContents.length }) }}</span>
                </button>
              </div>
            </aside>

            <Teleport to="body">
              <div
                v-if="!tocIsWide && tocSheetOpen && tableOfContents.length"
                id="article-toc-sheet"
                class="toc-sheet"
                role="dialog"
                aria-modal="true"
                :aria-label="$t('blog.toc')"
              >
                <button
                  type="button"
                  class="toc-sheet-backdrop"
                  :aria-label="$t('blog.tocClose')"
                  @click="closeTocSheet"
                />
                <div class="toc-sheet-panel">
                  <header class="toc-sheet-header">
                    <p class="toc-title">
                      {{ $t('blog.toc') }}
                    </p>
                    <button
                      type="button"
                      class="toc-sheet-close"
                      @click="closeTocSheet"
                    >
                      {{ $t('blog.tocClose') }}
                    </button>
                  </header>
                  <nav class="toc-nav toc-sheet-nav">
                    <ul>
                      <li
                        v-for="item in tableOfContents"
                        :key="'s-' + item.id"
                        :class="['toc-level-' + item.level, { 'is-active': activeHeadingId === item.id }]"
                      >
                        <a
                          :href="'#' + item.id"
                          @click.prevent="scrollToHeading(item.id)"
                        >{{ item.text }}</a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </Teleport>

            <div class="article article-main">
              <div
                v-if="currentPost.image"
                class="article-cover"
              >
                <img
                  :src="currentPost.image"
                  :alt="currentPost.title"
                >
              </div>

              <div
                ref="markdownRef"
                class="rich-markdown article-prose"
                v-html="renderedContent"
              />

              <ArticleAuthor compact />

              <section
                v-if="relatedPosts.length"
                class="related-posts"
              >
                <h2 class="related-title">
                  {{ $t('blog.relatedTitle') }}
                </h2>
                <div class="related-grid">
                  <article
                    v-for="post in relatedPosts"
                    :key="post.id"
                    class="related-card"
                    @click="loadPost(post.id)"
                  >
                    <span class="tag tag-accent">{{ designTag(post).label }}</span>
                    <h3>{{ post.title }}</h3>
                    <p>{{ post.excerpt }}</p>
                  </article>
                </div>
              </section>

              <footer class="article-footer">
                <div class="article-nav">
                  <button
                    v-if="prevPost"
                    class="nav-post-btn"
                    @click="loadPost(prevPost.id)"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ><line
                      x1="19"
                      y1="12"
                      x2="5"
                      y2="12"
                    /><polyline points="12 19 5 12 12 5" /></svg>
                    <span>{{ prevPost.title }}</span>
                  </button>
                  <button
                    v-if="nextPost"
                    class="nav-post-btn next"
                    @click="loadPost(nextPost.id)"
                  >
                    <span>{{ nextPost.title }}</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ><line
                      x1="5"
                      y1="12"
                      x2="19"
                      y2="12"
                    /><polyline points="12 5 19 12 12 19" /></svg>
                  </button>
                </div>
              </footer>
            </div>
          </div>
        </div>

        <!-- Sole mobile bottom bar (site tabs hidden on article) -->
        <div
          v-if="currentPost"
          class="mobile-share-bar"
        >
          <button
            class="share-bar-btn"
            :aria-label="$t('blog.backToList')"
            @click="backToList"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            ><line
              x1="19"
              y1="12"
              x2="5"
              y2="12"
            /><polyline points="12 19 5 12 12 5" /></svg>
          </button>
          <span class="share-bar-title">{{ currentPost.title }}</span>
          <button
            class="share-bar-btn"
            :aria-label="$t('blog.share')"
            @click="shareArticle"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            ><circle
              cx="18"
              cy="5"
              r="3"
            /><circle
              cx="6"
              cy="12"
              r="3"
            /><circle
              cx="18"
              cy="19"
              r="3"
            /><line
              x1="8.59"
              y1="13.51"
              x2="15.42"
              y2="17.49"
            /><line
              x1="15.41"
              y1="6.51"
              x2="8.59"
              y2="10.49"
            /></svg>
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
import { getDesignTag } from '@/utils/categoryLabel'
import { getPostCover } from '@/utils/postCover'
import { formatRelativeDate } from '@/utils/relativeTime'
import { extractHeadings, injectHeadingIds } from '@/utils/headings'
import { enhanceMarkdownHtml, bindCodeCopyButtons, enhanceTableNumericColumns } from '@/utils/enhanceMarkdown'
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
const { locale, t, tm } = useI18n()

const searchInput = ref('')
const searchQuery = useDebouncedRef(searchInput, 200)
const selectedCategory = ref('all')
const selectedTag = ref('')
const selectedYear = ref(null)
const selectedDesignTag = ref('')
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
const moreMenuOpen = ref(false)
const tocSheetOpen = ref(false)
/** Match CSS breakpoint for sticky TOC vs mobile sheet */
const tocIsWide = ref(typeof window !== 'undefined' ? window.matchMedia('(min-width: 981px)').matches : true)
let tocMq = null

const updateCopyLabel = () => {
  copyLabel.value = t('blog.copyLink')
}

const closeTocSheet = () => {
  tocSheetOpen.value = false
}

const syncTocOpenState = () => {
  tocIsWide.value = !!(tocMq?.matches ?? window.matchMedia('(min-width: 981px)').matches)
  if (tocIsWide.value) tocSheetOpen.value = false
}

/** Cap hero tags when lead already carries keywords */
const heroTags = computed(() => (currentPost.value?.tags || []).slice(0, 3))

const runToolbarAction = action => {
  moreMenuOpen.value = false
  action?.()
}

const onDocClick = e => {
  if (!moreMenuOpen.value) return
  const el = e.target?.closest?.('.toolbar-more')
  if (!el) moreMenuOpen.value = false
}

const onTocKeydown = e => {
  if (e.key === 'Escape' && tocSheetOpen.value) {
    closeTocSheet()
  }
}

updateCopyLabel()
watch(locale, updateCopyLabel)

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()
const { updateProgress, markRead } = useReadHistory()
const { isBookmarked, toggleBookmark } = useBookmarks()
const posts = computed(() => blogStore.posts)
const designTags = computed(() => {
  const items = tm('blog.designTags')
  const fallback = [
    { id: 'work', label: locale.value === 'en' ? 'Work notes' : '工作思考' },
    { id: 'imaging', label: locale.value === 'en' ? 'Imaging' : '影像' },
    { id: 'life', label: locale.value === 'en' ? 'Life' : '生活' }
  ]
  const all = Array.isArray(items) && items.length ? items : fallback
  return all.filter(tag => posts.value.some(post => getDesignTag(post, locale.value).id === tag.id))
})

const designTag = post => getDesignTag(post, locale.value)

const cardDate = post => post.dateLabel || formatRelativeDate(post.date, locale.value)

const coverOf = post => getPostCover(post)

const availableYears = computed(() => {
  const years = new Set()
  posts.value.forEach(post => {
    if (post.date) years.add(String(new Date(post.date).getFullYear()))
  })
  const list = Array.from(years).sort((a, b) => Number(b) - Number(a))
  return list.length ? list : ['2024', '2023']
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
    enhanceTableNumericColumns(markdownRef.value)
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
  moreMenuOpen.value = false
  tocSheetOpen.value = false
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
  closeTocSheet()
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
    const matchesDesign = !selectedDesignTag.value || designTag(post).id === selectedDesignTag.value
    const matchesYear =
      !selectedYear.value || String(new Date(post.date).getFullYear()) === selectedYear.value
    return matchesSearch && matchesCategory && matchesTag && matchesDesign && matchesYear
  })

  if (sortBy.value === 'oldest') {
    result = [...result].sort((a, b) => new Date(a.date) - new Date(b.date))
  } else if (sortBy.value === 'title') {
    result = [...result].sort((a, b) => a.title.localeCompare(b.title, locale.value))
  } else {
    result = [...result].sort((a, b) => {
      if (a.pin && b.pin && a.pin !== b.pin) return a.pin - b.pin
      if (a.pin && !b.pin) return -1
      if (!a.pin && b.pin) return 1
      return new Date(b.date) - new Date(a.date)
    })
  }
  return result
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
  window.addEventListener('keydown', onTocKeydown)
  document.addEventListener('click', onDocClick)
  tocMq = window.matchMedia('(min-width: 981px)')
  tocMq.addEventListener('change', syncTocOpenState)
  syncTocOpenState()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onReadingScroll)
  window.removeEventListener('keydown', onBlogKeydown)
  window.removeEventListener('keydown', onTocKeydown)
  document.removeEventListener('click', onDocClick)
  tocMq?.removeEventListener('change', syncTocOpenState)
  headingObserver?.disconnect()
  clearTimeout(scrollSaveTimer)
  clearPageMetaOverride()
  tocSheetOpen.value = false
  document.body.style.overflow = ''
})

watch(selectedCategory, () => {
  syncCategoryToUrl()
})

watch(tocSheetOpen, open => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = open ? 'hidden' : ''
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
  background: transparent;
}

.blog-view-enter-active,
.blog-view-leave-active {
  transition: opacity 150ms var(--ease-out);
}

.blog-view-enter-from,
.blog-view-leave-to {
  opacity: 0;
}

.notes-page {
  position: relative;
  min-height: calc(100vh - var(--nav-height));
  overflow: hidden;
}

.notes-atmosphere {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.notes-mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 40% at 75% 20%, var(--color-mesh-1) 0%, transparent 55%),
    radial-gradient(ellipse 40% 35% at 15% 80%, var(--color-mesh-2) 0%, transparent 50%);
}

.notes-snow {
  position: absolute;
  inset: 0;
  opacity: 0;
  background-image:
    radial-gradient(1.5px 1.5px at 15% 25%, #fff 0%, transparent 100%),
    radial-gradient(1px 1px at 55% 40%, #fff 0%, transparent 100%),
    radial-gradient(2px 2px at 80% 70%, #fff 0%, transparent 100%);
}

html.dark .notes-snow {
  opacity: 0.4;
}

.notes-header,
.notes-body {
  position: relative;
  z-index: 1;
}

.notes-body.section {
  padding-top: 0;
  padding-bottom: 80px;
}

.notes-header {
  padding: var(--space-12) 0 var(--space-6);
}

.notes-header h1 {
  font-size: clamp(36px, 5vw, 48px);
  margin-bottom: var(--space-6);
}

.notes-controls {
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

.search-clear {
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
  flex-shrink: 0;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.note-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm), var(--color-card-glow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.note-cover {
  height: 168px;
  margin: 12px 12px 0;
  border-radius: 16px;
  overflow: hidden;
}

.note-body {
  padding: 18px 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.note-body h3 {
  font-size: 18px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-excerpt {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
  padding-top: 8px;
}

.note-footer {
  padding-top: 4px;
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.empty-state {
  text-align: center;
  padding: 64px 16px;
  color: var(--color-text-secondary);
}

@media (max-width: 960px) {
  .notes-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 640px) {
  .notes-grid {
    grid-template-columns: 1fr;
  }

  .notes-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-wrap {
    min-width: 0;
  }
}

/* legacy meta helpers still used by article chrome */
.post-card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.meta-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--color-text-tertiary);
}

.tag-read {
  background: var(--color-bg-secondary);
  color: var(--color-text-tertiary);
}

/* --- Post Detail (magazine / tech-doc reading) --- */
.post-detail {
  position: relative;
  padding: 0 0 var(--space-24);
  /* Softened ice-blue glow — title contrast stays solid */
  background:
    radial-gradient(ellipse 70% 28% at 18% 0%, color-mix(in srgb, var(--color-mesh-1) 45%, transparent), transparent 60%),
    radial-gradient(ellipse 50% 24% at 92% 6%, color-mix(in srgb, var(--color-mesh-2) 40%, transparent), transparent 55%),
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

.article-chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
  flex-wrap: wrap;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 13px;
  font-family: var(--font-mono);
  flex-wrap: wrap;
  min-width: 0;
}

.breadcrumb-link,
.breadcrumb-back {
  background: none;
  border: none;
  padding: 0;
  color: var(--color-accent);
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
}

.breadcrumb-back {
  color: var(--color-text-secondary);
}

@media (hover: hover) and (pointer: fine) {
  .breadcrumb-back:hover {
    color: var(--color-accent);
  }
}

.breadcrumb-sep {
  color: var(--color-text-tertiary);
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  position: relative;
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

.toolbar-btn-primary {
  border-color: var(--color-accent-border);
  color: var(--color-accent);
}

.toolbar-more {
  position: relative;
}

.toolbar-more-trigger {
  min-width: 36px;
  padding-left: 10px;
  padding-right: 10px;
  letter-spacing: 0.12em;
  font-size: 14px;
  line-height: 1;
}

.toolbar-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 40;
  min-width: 148px;
  padding: var(--space-1);
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toolbar-menu-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 10px;
  font-size: 12px;
  font-family: var(--font-mono);
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.toolbar-menu-item.is-active,
.toolbar-menu-item:hover {
  color: var(--color-accent);
  background: var(--color-accent-light);
}

@media (hover: hover) and (pointer: fine) {
  .toolbar-btn:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
}

@media (max-width: 734px) {
  .toolbar-menu-print {
    display: none;
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
  font-weight: 600;
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

/* Reading grid: prose ~42rem + fixed TOC; outer margins absorb large screens */
.article-reading {
  display: grid;
  grid-template-columns: minmax(0, var(--article-prose-max, 42rem));
  grid-template-areas:
    'hero'
    'main';
  column-gap: var(--space-10);
  row-gap: 0;
  align-items: start;
  justify-content: center;
}

.article-reading.has-toc {
  grid-template-columns: minmax(0, var(--article-prose-max, 42rem)) var(--article-toc-width, 240px);
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
  width: var(--article-toc-width, 240px);
  max-height: calc(100vh - var(--nav-height) - var(--space-12));
  overflow-y: auto;
  padding: 0 0 0 var(--space-5);
  border-left: 1px solid var(--color-border);
  background: transparent;
}

.toc-panel {
  border: none;
}

.toc-title {
  font-size: 11px;
  font-weight: 600;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-tertiary);
  margin: 0 0 var(--space-3);
  list-style: none;
  cursor: default;
}

.toc-count {
  margin-left: var(--space-2);
  font-weight: 600;
  opacity: 0.7;
  text-transform: none;
  letter-spacing: 0;
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
  /* Unread / inactive stay darker */
  color: var(--color-text-tertiary);
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
  color: color-mix(in srgb, var(--color-text-tertiary) 85%, transparent);
}

.article-toc li.is-active a {
  color: var(--color-accent-hover);
  border-left-color: var(--color-accent);
  font-weight: 600;
}

@media (hover: hover) and (pointer: fine) {
  .article-toc a:hover {
    color: var(--color-accent);
  }
}

.toc-panel--desktop .toc-title {
  cursor: default;
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
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 900;
  height: calc(48px + env(safe-area-inset-bottom, 0px));
  padding: 0 var(--space-3) env(safe-area-inset-bottom, 0px);
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
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-text);
}

@media (max-width: 980px) {
  .article-reading.has-toc {
    grid-template-columns: minmax(0, var(--article-prose-max, 42rem));
    grid-template-areas:
      'hero'
      'toc'
      'main';
  }

  .article-toc {
    position: static;
    width: auto;
    max-width: var(--article-prose-max, 42rem);
    max-height: none;
    overflow: visible;
    margin: 0 0 var(--space-5);
    padding: 0;
    border-left: none;
  }

  .toc-panel--mobile {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
  }

  .toc-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin: 0;
    padding: 10px 12px;
    border: none;
    background: transparent;
    cursor: pointer;
    font: inherit;
    color: inherit;
    text-align: left;
  }

  .toc-trigger .toc-title {
    margin: 0;
  }

  .toc-trigger .toc-count {
    margin-left: var(--space-3);
    font-size: 12px;
    font-family: var(--font-mono);
    color: var(--color-text-tertiary);
  }

  .toc-trigger::after {
    content: '+';
    margin-left: var(--space-2);
    font-size: 14px;
    font-weight: 400;
    color: var(--color-text-tertiary);
  }
}

/* Mobile TOC bottom sheet — teleported to body; does not shove article layout */
.toc-sheet {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.toc-sheet-backdrop {
  position: absolute;
  inset: 0;
  border: none;
  padding: 0;
  margin: 0;
  background: color-mix(in srgb, var(--color-bg) 35%, rgba(0, 0, 0, 0.45));
  cursor: pointer;
}

.toc-sheet-panel {
  position: relative;
  z-index: 1;
  width: min(100%, 520px);
  max-height: 55vh;
  display: flex;
  flex-direction: column;
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  border-bottom: none;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  box-shadow: var(--shadow-lg);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.toc-sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-divider);
  flex-shrink: 0;
}

.toc-sheet-header .toc-title {
  margin: 0;
}

.toc-sheet-close {
  border: none;
  background: transparent;
  color: var(--color-accent);
  font-size: 13px;
  font-family: var(--font-mono);
  cursor: pointer;
  padding: 4px 6px;
}

.toc-sheet-nav {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 6px 12px 14px;
  overscroll-behavior: contain;
}

.toc-sheet-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.toc-sheet-nav a {
  display: block;
  font-size: 14px;
  line-height: 1.4;
  color: var(--color-text-tertiary);
  text-decoration: none;
  padding: 10px 0 10px 10px;
  border-left: 2px solid transparent;
}

.toc-sheet-nav .toc-level-3 a {
  padding-left: calc(10px + var(--space-3));
  font-size: 13px;
}

.toc-sheet-nav li.is-active a {
  color: var(--color-accent-hover);
  border-left-color: var(--color-accent);
  font-weight: 600;
}

@media (prefers-reduced-motion: reduce) {
  .blog-view-enter-active,
  .blog-view-leave-active {
    transition: none;
  }

}

/* --- Responsive --- */
@media (max-width: 734px) {
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

  /* Pad for the single mini bar only */
  .post-detail {
    padding-bottom: calc(48px + env(safe-area-inset-bottom, 0px) + var(--space-16));
  }
}
</style>
