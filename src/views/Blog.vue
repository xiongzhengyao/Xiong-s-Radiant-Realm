<template>
  <div class="blog">
    <!-- Blog list view -->
    <div v-if="!currentPostId">
      <section class="blog-hero">
        <div class="container">
          <h1 class="reveal">技术博客</h1>
          <p class="blog-hero-sub reveal reveal-delay-1">
            嵌入式开发、Camera 驱动与 Linux 系统的技术探索
          </p>
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
                全部
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
            <div class="search-wrapper">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索文章..."
                class="search-input"
              />
            </div>
          </div>

          <!-- Post Grid -->
          <div class="post-grid">
            <article
              v-for="post in filteredPosts"
              :key="post.id"
              class="post-card reveal"
              @click="showPostDetail(post)"
            >
              <div class="post-card-image">
                <img :src="post.image" :alt="post.title" loading="lazy" />
              </div>
              <div class="post-card-body">
                <div class="post-card-meta">
                  <span>{{ post.date }}</span>
                  <span class="meta-dot"></span>
                  <span>{{ post.author }}</span>
                </div>
                <h3>{{ post.title }}</h3>
                <p>{{ post.excerpt }}</p>
                <div class="post-card-tags">
                  <span class="tag" v-for="tag in post.tags" :key="tag">{{ tag }}</span>
                </div>
              </div>
            </article>
          </div>

          <!-- Empty state -->
          <div v-if="filteredPosts.length === 0" class="empty-state">
            <p>没有找到匹配的文章</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Blog post detail view -->
    <div v-else class="post-detail">
      <div class="container-narrow">
        <button class="back-btn" @click="backToList">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          返回文章列表
        </button>

        <article v-if="currentPost" class="article">
          <header class="article-header">
            <div class="article-meta">
              <span>{{ currentPost.date }}</span>
              <span class="meta-dot"></span>
              <span>{{ currentPost.author }}</span>
            </div>
            <h1>{{ currentPost.title }}</h1>
            <div class="article-tags">
              <span class="tag tag-accent" v-for="tag in currentPost.tags" :key="tag">{{ tag }}</span>
            </div>
          </header>

          <div v-if="currentPost.image" class="article-cover">
            <img :src="currentPost.image" :alt="currentPost.title" />
          </div>

          <div class="markdown-body" v-html="renderedContent" />

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
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogStore } from '@/stores/blogStore'
import { useMarkdown } from '@/composables/useMarkdown'
import { BLOG_CATEGORIES } from '@/utils/constants'

const { render: renderMarkdown } = useMarkdown()

const searchQuery = ref('')
const selectedCategory = ref('all')
const currentPostId = ref(null)
const currentPost = ref(null)
const renderedContent = ref('')
const prevPost = ref(null)
const nextPost = ref(null)

const categories = BLOG_CATEGORIES
const route = useRoute()
const blogStore = useBlogStore()
const posts = computed(() => blogStore.posts)

const showPostDetail = post => {
  const slug = Object.keys(blogStore.markdownFiles).find(
    key => blogStore.markdownFiles[key].id === post.id
  )
  window.history.pushState({}, '', `/blog/${post.id}/${slug}`)
  loadPost(post.id)
}

const backToList = () => {
  currentPostId.value = null
  currentPost.value = null
  window.history.pushState({}, '', '/blog')
}

const loadPost = async id => {
  const postData = blogStore.getPostById(id)
  if (!postData) { backToList(); return }

  currentPostId.value = id
  currentPost.value = postData

  try {
    const response = await fetch(postData.markdownFile)
    if (!response.ok) throw new Error('Failed to load markdown file')
    const content = await response.text()
    renderedContent.value = renderMarkdown(content)
    const { prev, next } = blogStore.getAdjacentPosts(id)
    prevPost.value = prev
    nextPost.value = next
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) {
    console.error('Error loading markdown:', error)
    renderedContent.value = '<p style="color: red;">加载文章内容失败，请稍后重试...</p>'
  }
}

const filteredPosts = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return posts.value.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q)
    const matchesCategory = selectedCategory.value === 'all' || post.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

onMounted(() => {
  if (route.params.id) loadPost(route.params.id)

  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible') }),
    { threshold: 0.1 }
  )
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
})

watch(() => route.params, params => {
  if (params.id) loadPost(params.id)
  else { currentPostId.value = null; currentPost.value = null }
})
</script>

<style scoped>
.blog {
  padding-top: var(--nav-height);
  min-height: 100vh;
  background: var(--color-bg);
}

/* --- Blog Hero --- */
.blog-hero {
  padding: var(--space-20) 0 var(--space-8);
  text-align: center;
}

.blog-hero h1 {
  font-size: clamp(32px, 5vw, 48px);
  margin-bottom: var(--space-3);
}

.blog-hero-sub {
  font-size: 19px;
  color: var(--color-text-secondary);
  max-width: 480px;
  margin: 0 auto;
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
  transition: all var(--duration-fast) var(--ease-out);
  white-space: nowrap;
}

.pill:hover {
  border-color: var(--color-text-tertiary);
  color: var(--color-text);
}

.pill.active {
  background: var(--color-text);
  color: var(--color-bg);
  border-color: var(--color-text);
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
  transition: border-color var(--duration-fast), box-shadow var(--duration-fast);
  outline: none;
}

.search-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-input-focus);
}

/* --- Post Grid --- */
.post-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6);
}

.post-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  transition: transform var(--duration-base) var(--ease-out),
              box-shadow var(--duration-base) var(--ease-out);
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.post-card-image {
  width: 100%;
  height: 220px;
  overflow: hidden;
}

.post-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-slow) var(--ease-out);
}

.post-card:hover .post-card-image img {
  transform: scale(1.04);
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
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.empty-state {
  text-align: center;
  padding: var(--space-16) 0;
  color: var(--color-text-tertiary);
  font-size: 17px;
}

/* --- Post Detail --- */
.post-detail {
  padding: var(--space-12) 0 var(--space-20);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 8px 0;
  font-size: 15px;
  color: var(--color-accent);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-sans);
  margin-bottom: var(--space-8);
  transition: opacity var(--duration-fast);
}

.back-btn:hover {
  opacity: 0.7;
}

.article-header {
  margin-bottom: var(--space-8);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 14px;
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-4);
}

.article-header h1 {
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1.15;
  margin-bottom: var(--space-4);
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.article-cover {
  border-radius: var(--radius-xl);
  overflow: hidden;
  margin-bottom: var(--space-10);
  box-shadow: var(--shadow-md);
}

.article-cover img {
  width: 100%;
  height: auto;
  display: block;
}

/* --- Markdown Body --- */
.markdown-body {
  font-size: 17px;
  line-height: 1.7;
  color: var(--color-text);
}

.markdown-body :deep(h1) {
  font-size: 2em;
  margin: 2.5rem 0 1rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--color-divider);
}

.markdown-body :deep(h2) {
  font-size: 1.6em;
  margin: 2rem 0 0.8rem;
}

.markdown-body :deep(h3) {
  font-size: 1.3em;
  margin: 1.5rem 0 0.6rem;
}

.markdown-body :deep(p) {
  margin: 1rem 0;
  line-height: 1.76;
  color: var(--color-text);
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 1.8rem;
  margin: 1rem 0;
}

.markdown-body :deep(li) {
  margin: 0.4rem 0;
  line-height: 1.7;
}

.markdown-body :deep(code) {
  background: var(--color-code-bg);
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.88em;
  color: var(--color-accent);
}

.markdown-body :deep(pre) {
  background: var(--color-code-bg);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin: 1.5rem 0;
  border: 1px solid var(--color-border);
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
  color: var(--color-text);
}

.markdown-body :deep(blockquote) {
  border-left: 3px solid var(--color-accent);
  padding-left: var(--space-4);
  margin: 1.5rem 0;
  color: var(--color-text-secondary);
}

.markdown-body :deep(a) {
  color: var(--color-accent);
}

.markdown-body :deep(img) {
  max-width: 100%;
  border-radius: var(--radius-md);
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid var(--color-border);
  padding: 10px 14px;
  text-align: left;
  font-size: 15px;
}

.markdown-body :deep(th) {
  background: var(--color-bg-secondary);
  font-weight: 600;
}

/* --- Article Footer / Nav --- */
.article-footer {
  margin-top: var(--space-12);
  padding-top: var(--space-8);
  border-top: 1px solid var(--color-border);
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
  padding: 12px 18px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-card-bg);
  color: var(--color-text);
  font-size: 14px;
  cursor: pointer;
  font-family: var(--font-sans);
  max-width: 45%;
  transition: border-color var(--duration-fast), box-shadow var(--duration-fast);
  text-align: left;
}

.nav-post-btn:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-sm);
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

/* --- Responsive --- */
@media (max-width: 734px) {
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

  .article-nav {
    flex-direction: column;
  }

  .nav-post-btn {
    max-width: 100%;
  }
}
</style>
