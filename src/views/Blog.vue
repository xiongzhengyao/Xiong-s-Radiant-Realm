<template>
  <div class="blog">
    <el-row justify="center">
      <el-col :span="18">
        <div class="blog-header">
          <h1>技术博客</h1>
          
          <!-- 添加分类过滤器 -->
          <div class="category-filter">
            <el-radio-group v-model="selectedCategory" size="large">
              <el-radio-button label="all">全部</el-radio-button>
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
              <el-card 
                v-for="post in filteredPosts" 
                :key="post.id"
                class="post-card"
              >
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
                <p class="post-excerpt">{{ post.excerpt }}</p>
                <div class="post-footer">
                  <div class="post-tags">
                    <el-tag 
                      v-for="tag in post.tags" 
                      :key="tag"
                      size="small"
                      class="post-tag"
                    >
                      {{ tag }}
                    </el-tag>
                  </div>
                  <el-button type="primary" text @click="showPostDetail(post)">阅读更多</el-button>
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
      </el-col>
    </el-row>

    <!-- 博客文章详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="selectedPost?.title"
      width="70%"
      class="post-dialog"
    >
      <div class="post-content" v-if="selectedPost">
        <el-loading :value="loading" />
        <div class="post-meta">
          <el-icon><Calendar /></el-icon>
          <span>{{ selectedPost.date }}</span>
          <el-divider direction="vertical" />
          <el-icon><User /></el-icon>
          <span>{{ selectedPost.author }}</span>
        </div>
        <div class="markdown-content" v-html="renderedContent"></div>
        <div class="post-tags">
          <el-tag 
            v-for="tag in selectedPost.tags" 
            :key="tag"
            size="small"
            class="post-tag"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Calendar, User } from '@element-plus/icons-vue'
import MarkdownIt from 'markdown-it'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blogStore'

// 创建 markdown 解析器实例
const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true
})

const searchQuery = ref('')
const currentPage = ref(1)
const dialogVisible = ref(false)
const selectedPost = ref(null)
const renderedContent = ref('')
const loading = ref(false)

// 添加博客分类
const categories = [
  { name: 'linux', label: 'Linux 开发' },
  { name: 'cpp', label: 'C++ 开发' },
  { name: 'embedded', label: '嵌入式开发' },
  { name: 'protocol', label: '通信协议' },
  { name: 'sensor', label: '传感器' }
]

const selectedCategory = ref('all')

const router = useRouter()
const blogStore = useBlogStore()
const posts = computed(() => blogStore.posts)

// 修改文章详情显示方法
const showPostDetail = (post) => {
  const slug = Object.keys(blogStore.markdownFiles).find(
    key => blogStore.markdownFiles[key].id === post.id
  )
  router.push({
    name: 'BlogPost',
    params: { 
      id: post.id,
      slug
    }
  })
}

// 添加分类计数方法
const getCategoryCount = (categoryName) => {
  return posts.value.filter(post => post.category === categoryName).length
}

// 添加分类选择处理方法
const handleCategorySelect = (categoryName) => {
  selectedCategory.value = categoryName
}

// 其他计算属性保持不变
const filteredPosts = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return posts.value.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query)
    
    const matchesCategory = 
      selectedCategory.value === 'all' || 
      post.category === selectedCategory.value
    
    return matchesSearch && matchesCategory
  })
})

const totalPosts = computed(() => filteredPosts.value.length)
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

/* Markdown styles */
.markdown-content {
  padding: 1rem;
  line-height: 1.6;
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

.post-dialog {
  :deep(.el-dialog__body) {
    padding: 1rem 2rem;
  }
  
  .post-meta {
    margin-bottom: 1.5rem;
    color: #606266;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .post-tags {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #eaecef;
  }
}

/* 添加分类过滤器样式 */
.category-filter {
  margin: 2rem 0;
  text-align: center;
}
</style>
