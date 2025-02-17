<template>
  <div class="blog-post">
    <el-row justify="center">
      <el-col :span="18">
        <div class="post-container" v-if="post">
          <!-- 返回按钮 -->
          <div class="back-button">
            <el-button @click="router.push('/blog')" icon="ArrowLeft">
              返回文章列表
            </el-button>
          </div>

          <!-- 文章标题和元信息 -->
          <div class="post-header">
            <h1>{{ post.title }}</h1>
            <div class="post-meta">
              <el-icon><Calendar /></el-icon>
              <span>{{ post.date }}</span>
              <el-divider direction="vertical" />
              <el-icon><User /></el-icon>
              <span>{{ post.author }}</span>
            </div>
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
          </div>

          <!-- 文章封面图 -->
          <div class="post-cover">
            <el-image :src="post.image" fit="cover" />
          </div>

          <!-- 文章内容 -->
          <div class="markdown-content" v-html="renderedContent"></div>

          <!-- 文章底部 -->
          <div class="post-footer">
            <div class="post-nav">
              <el-button 
                v-if="prevPost" 
                @click="loadPost(prevPost.id)"
                icon="ArrowLeft"
              >
                上一篇：{{ prevPost.title }}
              </el-button>
              <el-button 
                v-if="nextPost" 
                @click="loadPost(nextPost.id)"
                icon="ArrowRight"
                class="next-post"
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Calendar, User, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import MarkdownIt from 'markdown-it'
import { useBlogStore } from '@/stores/blogStore'

const router = useRouter()
const route = useRoute()
const blogStore = useBlogStore()
const post = ref(null)
const renderedContent = ref('')
const prevPost = ref(null)
const nextPost = ref(null)

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true
})

const loadPost = async (id) => {
  const postData = blogStore.getPostById(id)
  if (!postData) {
    router.push('/blog')
    return
  }

  post.value = postData
  
  try {
    const response = await fetch(postData.markdownFile)
    if (!response.ok) throw new Error('Failed to load markdown file')
    const content = await response.text()
    renderedContent.value = md.render(content)

    // 更新上一篇和下一篇
    const { prev, next } = blogStore.getAdjacentPosts(id)
    prevPost.value = prev
    nextPost.value = next
  } catch (error) {
    console.error('Error loading markdown:', error)
    renderedContent.value = '加载文章内容失败...'
  }
}

onMounted(() => {
  loadPost(route.params.id)
})
</script>

<style scoped>
.blog-post {
  padding: 4rem 0;
  background-color: #f5f7fa;
  min-height: 100vh;
}

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

.post-tags {
  margin-top: 1rem;
}

.post-tag {
  margin-right: 0.5rem;
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

.markdown-content {
  padding: 2rem 0;
  line-height: 1.8;
  color: #2c3e50;
}

.post-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #ebeef5;
}

.post-nav {
  display: flex;
  justify-content: space-between;
}

.next-post {
  margin-left: auto;
}
</style> 