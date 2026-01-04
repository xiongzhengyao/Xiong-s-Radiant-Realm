<template>
  <div class="blog">
    <el-row justify="center">
      <el-col :span="18">
        <!-- 博客列表视图 -->
        <div v-if="!currentPostId">
          <div class="blog-header">
            <h1>技术博客</h1>

            <!-- 添加分类过滤器 -->
            <div class="category-filter">
              <el-radio-group v-model="selectedCategory" size="large">
                <el-radio-button label="all"> 全部 </el-radio-button>
                <el-radio-button
                  v-for="category in categories"
                  :key="category.name"
                  :label="category.name"
                >
                  {{ category.label }}
                </el-radio-button>
              </el-radio-group>
            </div>

            <el-input
              v-model="searchQuery"
              placeholder="搜索文章..."
              prefix-icon="Search"
              clearable
              class="search-input"
            />
          </div>

          <el-row :gutter="30">
            <!-- 博客列表 -->
            <el-col :span="16">
              <div class="post-list">
                <el-card v-for="post in filteredPosts" :key="post.id" class="post-card">
                  <div class="post-header">
                    <h2>{{ post.title }}</h2>
                    <div class="post-meta">
                      <el-icon><Calendar /></el-icon>
                      <span>{{ post.date }}</span>
                      <el-divider direction="vertical" />
                      <el-icon><User /></el-icon>
                      <span>{{ post.author }}</span>
                    </div>
                  </div>
                  <img :src="post.image" class="post-image" />
                  <p class="post-excerpt">
                    {{ post.excerpt }}
                  </p>
                  <div class="post-footer">
                    <div class="post-tags">
                      <el-tag v-for="tag in post.tags" :key="tag" size="small" class="post-tag">
                        {{ tag }}
                      </el-tag>
                    </div>
                    <el-button type="primary" text @click="showPostDetail(post)">
                      阅读更多
                    </el-button>
                  </div>
                </el-card>

                <el-pagination
                  v-model:current-page="currentPage"
                  :page-size="5"
                  :total="totalPosts"
                  layout="prev, pager, next"
                  class="pagination"
                />
              </div>
            </el-col>

            <!-- 侧边栏 -->
            <el-col :span="8">
              <el-card class="sidebar-card">
                <template #header>
                  <div class="card-header">
                    <span>文章分类</span>
                  </div>
                </template>
                <el-menu @select="handleCategorySelect">
                  <el-menu-item index="all">
                    全部文章
                    <template #title>
                      <span>({{ posts.length }})</span>
                    </template>
                  </el-menu-item>
                  <el-menu-item
                    v-for="category in categories"
                    :key="category.name"
                    :index="category.name"
                  >
                    {{ category.label }}
                    <template #title>
                      <span>({{ getCategoryCount(category.name) }})</span>
                    </template>
                  </el-menu-item>
                </el-menu>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <!-- 博客文章详情视图 -->
        <div v-else class="post-container">
          <!-- 返回按钮 -->
          <div class="back-button">
            <el-button icon="ArrowLeft" @click="backToList"> 返回文章列表 </el-button>
          </div>

          <!-- 文章标题和元信息 -->
          <div v-if="currentPost" class="post-header">
            <h1>{{ currentPost.title }}</h1>
            <div class="post-meta">
              <el-icon><Calendar /></el-icon>
              <span>{{ currentPost.date }}</span>
              <el-divider direction="vertical" />
              <el-icon><User /></el-icon>
              <span>{{ currentPost.author }}</span>
            </div>
            <div class="post-tags">
              <el-tag v-for="tag in currentPost.tags" :key="tag" size="small" class="post-tag">
                {{ tag }}
              </el-tag>
            </div>
          </div>

          <!-- 文章封面图 -->
          <div v-if="currentPost" class="post-cover">
            <el-image :src="currentPost.image" fit="cover" />
          </div>

          <!-- 文章内容 -->
          <div class="markdown-content" v-html="renderedContent" />

          <!-- 文章底部 -->
          <div class="post-footer">
            <div class="post-nav">
              <el-button v-if="prevPost" icon="ArrowLeft" @click="loadPost(prevPost.id)">
                上一篇：{{ prevPost.title }}
              </el-button>
              <el-button
                v-if="nextPost"
                icon="ArrowRight"
                class="next-post"
                @click="loadPost(nextPost.id)"
              >
                下一篇：{{ nextPost.title }}
              </el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Calendar, User } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { useBlogStore } from '@/stores/blogStore'
import { useMarkdown } from '@/composables/useMarkdown'
import { BLOG_CATEGORIES } from '@/utils/constants'

// 使用 markdown composable
const { render: renderMarkdown } = useMarkdown()

// 博客列表相关状态
const searchQuery = ref('')
const currentPage = ref(1)
const selectedCategory = ref('all')

// 博客详情相关状态
const currentPostId = ref(null)
const currentPost = ref(null)
const renderedContent = ref('')
const prevPost = ref(null)
const nextPost = ref(null)
const loading = ref(false)

// 使用常量配置
const categories = BLOG_CATEGORIES

const route = useRoute()
const blogStore = useBlogStore()
const posts = computed(() => blogStore.posts)

// 显示文章详情
const showPostDetail = post => {
  const slug = Object.keys(blogStore.markdownFiles).find(
    key => blogStore.markdownFiles[key].id === post.id
  )

  // 更新URL但不触发路由变化
  window.history.pushState({}, '', `/blog/${post.id}/${slug}`)

  // 加载文章
  loadPost(post.id)
}

// 返回列表
const backToList = () => {
  currentPostId.value = null
  currentPost.value = null

  // 更新URL但不触发路由变化
  window.history.pushState({}, '', '/blog')
}

// 加载文章内容
const loadPost = async id => {
  loading.value = true
  const postData = blogStore.getPostById(id)
  if (!postData) {
    backToList()
    return
  }

  currentPostId.value = id
  currentPost.value = postData

  try {
    const response = await fetch(postData.markdownFile)
    if (!response.ok) throw new Error('Failed to load markdown file')
    const content = await response.text()
    renderedContent.value = renderMarkdown(content)

    // 更新上一篇和下一篇
    const { prev, next } = blogStore.getAdjacentPosts(id)
    prevPost.value = prev
    nextPost.value = next
  } catch (error) {
    console.error('Error loading markdown:', error)
    renderedContent.value = '<p style="color: red;">加载文章内容失败，请稍后重试...</p>'
  } finally {
    loading.value = false
  }
}

// 添加分类计数方法
const getCategoryCount = categoryName => {
  return posts.value.filter(post => post.category === categoryName).length
}

// 添加分类选择处理方法
const handleCategorySelect = categoryName => {
  selectedCategory.value = categoryName
}

// 过滤文章列表
const filteredPosts = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return posts.value.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query)

    const matchesCategory =
      selectedCategory.value === 'all' || post.category === selectedCategory.value

    return matchesSearch && matchesCategory
  })
})

const totalPosts = computed(() => filteredPosts.value.length)

// 处理路由参数
onMounted(() => {
  if (route.params.id) {
    loadPost(route.params.id)
  }
})

// 监听路由变化
watch(
  () => route.params,
  params => {
    if (params.id) {
      loadPost(params.id)
    } else {
      currentPostId.value = null
      currentPost.value = null
    }
  }
)
</script>

<style scoped>
.blog {
  padding: 4rem 0;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.blog-header {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.blog-header h1 {
  margin: 0;
  color: #303133;
}

.search-input {
  width: 300px;
}

.post-card {
  margin-bottom: 2rem;
}

.post-header h2 {
  margin: 0 0 1rem 0;
  color: #303133;
}

.post-meta {
  display: flex;
  align-items: center;
  color: #909399;
  margin-bottom: 1rem;
}

.post-meta .el-icon {
  margin-right: 0.5rem;
}

.post-meta span {
  margin-right: 1rem;
}

.post-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  margin-bottom: 1rem;
  border-radius: 4px;
}

.post-excerpt {
  color: #606266;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-tag {
  margin-right: 0.5rem;
}

.sidebar-card {
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  font-weight: bold;
  color: #303133;
}

.pagination {
  margin-top: 2rem;
  text-align: center;
}

:deep(.el-menu-item) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-menu-item span) {
  color: #909399;
  font-size: 0.9em;
}

/* 博客详情样式 */
.post-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.back-button {
  margin-bottom: 2rem;
}

.post-header {
  margin-bottom: 2rem;
}

.post-header h1 {
  margin: 0 0 1rem 0;
  color: #303133;
}

.post-tags {
  margin-top: 1rem;
}

.post-cover {
  margin: 2rem 0;
  border-radius: 8px;
  overflow: hidden;
}

.post-cover .el-image {
  width: 100%;
  height: 400px;
}

/* Markdown styles */
.markdown-content {
  padding: 2rem 0;
  line-height: 1.8;
  color: #2c3e50;
}

.markdown-content :deep(h1) {
  font-size: 2em;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #eaecef;
}

.markdown-content :deep(h2) {
  font-size: 1.5em;
  margin: 1.5rem 0 1rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid #eaecef;
}

.markdown-content :deep(h3) {
  font-size: 1.25em;
  margin: 1rem 0;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

.markdown-content :deep(li) {
  margin: 0.3rem 0;
}

.markdown-content :deep(code) {
  background-color: #f6f8fa;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
}

.post-nav {
  display: flex;
  justify-content: space-between;
}

.next-post {
  margin-left: auto;
}

/* 添加分类过滤器样式 */
.category-filter {
  margin: 2rem 0;
  text-align: center;
}
</style>
