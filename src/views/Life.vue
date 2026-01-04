<template>
  <div class="life">
    <div class="page-header">
      <h1 class="animated-title">生活点滴</h1>
      <p class="subtitle">记录生活中的美好瞬间与感悟</p>
    </div>

    <!-- 生活分类 -->
    <div class="category-filter">
      <el-radio-group v-model="selectedCategory" size="large">
        <el-radio-button label="all">
          <el-icon><Grid /></el-icon> 全部
        </el-radio-button>
        <el-radio-button v-for="category in categories" :key="category.name" :label="category.name">
          <el-icon><component :is="getCategoryIcon(category.name)" /></el-icon>
          {{ category.label }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <!-- 时间线展示 -->
    <el-row justify="center">
      <el-col :xs="24" :sm="22" :md="20" :lg="18">
        <transition-group name="fade-list" tag="div" class="timeline-container">
          <el-timeline v-if="filteredPosts.length > 0">
            <el-timeline-item
              v-for="post in filteredPosts"
              :key="post.id"
              :timestamp="formatDate(post.date)"
              :type="getTimelineItemType(post.category)"
              placement="top"
              size="large"
            >
              <div class="timeline-date" :class="getTimelineClass(post.category)">
                <div class="date-day">
                  {{ getDay(post.date) }}
                </div>
                <div class="date-month">
                  {{ getMonth(post.date) }}
                </div>
                <div class="date-year">
                  {{ getYear(post.date) }}
                </div>
              </div>
              <el-card class="timeline-card" shadow="hover">
                <div class="card-content">
                  <div class="text-content">
                    <h3>{{ post.title }}</h3>
                    <div class="post-tags">
                      <el-tag
                        v-for="tag in post.tags"
                        :key="tag"
                        size="small"
                        :type="getTagType(post.category)"
                        class="post-tag"
                        effect="light"
                      >
                        {{ tag }}
                      </el-tag>
                    </div>
                    <p class="post-description">
                      {{ post.description }}
                    </p>
                    <el-button
                      :type="getButtonType(post.category)"
                      class="read-more"
                      @click="showPostDetail(post)"
                    >
                      <el-icon><ArrowRight /></el-icon> 阅读更多
                    </el-button>
                  </div>
                  <div class="image-content">
                    <el-image
                      :src="post.image"
                      fit="cover"
                      class="post-image"
                      :preview-src-list="[post.image]"
                      loading="lazy"
                    >
                      <template #placeholder>
                        <div class="image-placeholder">
                          <el-icon><Picture /></el-icon>
                        </div>
                      </template>
                    </el-image>
                  </div>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>

          <div v-else class="empty-state">
            <el-empty description="暂无相关内容" :image-size="200">
              <template #image>
                <el-icon size="100" color="#909399">
                  <DocumentDelete />
                </el-icon>
              </template>
              <el-button type="primary" @click="selectedCategory = 'all'"> 查看全部内容 </el-button>
            </el-empty>
          </div>
        </transition-group>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Picture,
  ArrowRight,
  Grid,
  Suitcase,
  Fries,
  Reading,
  Camera,
  ChatDotRound,
  DocumentDelete
} from '@element-plus/icons-vue'

const selectedCategory = ref('all')

const categories = [
  { name: 'travel', label: '旅行', color: '#409EFF' },
  { name: 'food', label: '美食', color: '#67C23A' },
  { name: 'reading', label: '读书', color: '#E6A23C' },
  { name: 'photography', label: '摄影', color: '#F56C6C' },
  { name: 'thoughts', label: '随想', color: '#909399' }
]

const posts = ref([
  {
    id: 1,
    title: '上海周末游记',
    date: '2024-02-10',
    image: 'https://picsum.photos/800/400',
    description:
      '周末在上海的人文探索之旅，感受这座城市的魅力。漫步于外滩，感受黄浦江两岸的风景；穿行于田子坊，体验上海的文艺气息；夜游南京路，欣赏繁华都市的夜景...',
    tags: ['旅行', '城市', '文化'],
    category: 'travel'
  },
  {
    id: 2,
    title: '年度摄影作品集',
    date: '2024-02-08',
    image: 'https://picsum.photos/800/401',
    description:
      '记录生活中的美好瞬间，分享我的摄影心得。用镜头捕捉城市的光影变化，记录四季的自然风光，定格生活中的精彩瞬间...',
    tags: ['摄影', '艺术', '生活'],
    category: 'photography'
  },
  {
    id: 3,
    title: '读《人类简史》有感',
    date: '2024-02-05',
    image: 'https://picsum.photos/800/402',
    description:
      '关于人类历史、文明演进的思考。从认知革命到科技革命，人类社会经历了怎样的变迁？未来又将走向何方？读完这本书，让我对人类文明有了更深的认识...',
    tags: ['读书', '历史', '思考'],
    category: 'reading'
  }
])

const filteredPosts = computed(() => {
  if (selectedCategory.value === 'all') {
    return posts.value
  }
  return posts.value.filter(post => post.category === selectedCategory.value)
})

// 根据分类获取图标
const getCategoryIcon = category => {
  switch (category) {
    case 'travel':
      return Suitcase
    case 'food':
      return Fries
    case 'reading':
      return Reading
    case 'photography':
      return Camera
    case 'thoughts':
      return ChatDotRound
    default:
      return Grid
  }
}

// 根据分类获取时间线项的类型
const getTimelineItemType = category => {
  switch (category) {
    case 'travel':
      return 'primary'
    case 'food':
      return 'success'
    case 'reading':
      return 'warning'
    case 'photography':
      return 'danger'
    case 'thoughts':
      return 'info'
    default:
      return ''
  }
}

// 根据分类获取标签类型
const getTagType = category => {
  switch (category) {
    case 'travel':
      return ''
    case 'food':
      return 'success'
    case 'reading':
      return 'warning'
    case 'photography':
      return 'danger'
    case 'thoughts':
      return 'info'
    default:
      return ''
  }
}

// 根据分类获取按钮类型
const getButtonType = category => {
  switch (category) {
    case 'travel':
      return 'primary'
    case 'food':
      return 'success'
    case 'reading':
      return 'warning'
    case 'photography':
      return 'danger'
    case 'thoughts':
      return 'info'
    default:
      return 'primary'
  }
}

const showPostDetail = post => {
  // TODO: 实现文章详情查看功能
  console.log('查看文章:', post.title)
}

// 日期格式化函数
const formatDate = dateStr => {
  const date = new Date(dateStr)
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return weekdays[date.getDay()]
}

const getDay = dateStr => {
  return new Date(dateStr).getDate().toString().padStart(2, '0')
}

const getMonth = dateStr => {
  const months = [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月'
  ]
  return months[new Date(dateStr).getMonth()]
}

const getYear = dateStr => {
  return new Date(dateStr).getFullYear()
}

const getTimelineClass = category => {
  return `timeline-date-${category}`
}
</script>

<style scoped>
.life {
  padding: 4rem 0;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  border-radius: 0 0 50% 50% / 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.animated-title {
  color: #303133;
  position: relative;
  display: inline-block;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
}

.animated-title::after {
  content: '';
  position: absolute;
  width: 50%;
  height: 3px;
  bottom: -10px;
  left: 25%;
  background: linear-gradient(90deg, transparent, #409eff, transparent);
  animation: line-animation 3s infinite;
}

@keyframes line-animation {
  0% {
    width: 0;
    left: 50%;
  }
  50% {
    width: 50%;
    left: 25%;
  }
  100% {
    width: 0;
    left: 50%;
  }
}

.subtitle {
  color: #606266;
  font-size: 1.2rem;
  margin-top: 1rem;
}

.category-filter {
  text-align: center;
  margin-bottom: 3rem;
  position: sticky;
  top: 70px;
  z-index: 10;
  background-color: rgba(245, 247, 250, 0.9);
  padding: 1rem 0;
  backdrop-filter: blur(5px);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.timeline-container {
  position: relative;
  padding: 0 1rem;
}

.timeline-card {
  margin-bottom: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.timeline-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  gap: 2rem;
}

.text-content {
  flex: 1;
  padding: 0.5rem;
}

.image-content {
  flex: 1;
  position: relative;
}

.post-image {
  width: 100%;
  height: 250px;
  border-radius: 8px;
  object-fit: cover;
  transition: transform 0.5s;
}

.post-image:hover {
  transform: scale(1.03);
}

.image-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
  background-color: #f0f2f5;
  color: #909399;
}

h3 {
  margin: 0 0 1rem 0;
  color: #303133;
  font-size: 1.5rem;
}

.post-tags {
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
}

.post-tag {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 16px;
}

.post-description {
  color: #606266;
  margin-bottom: 1.5rem;
  line-height: 1.8;
  text-align: justify;
}

.read-more {
  margin-top: 1rem;
  border-radius: 20px;
  padding: 8px 20px;
  transition: all 0.3s;
}

.read-more:hover {
  transform: translateX(5px);
}

.timeline-date {
  position: absolute;
  left: -120px;
  top: 0;
  width: 80px;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.timeline-date:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.date-day {
  font-size: 24px;
  font-weight: bold;
  padding: 10px 0;
  color: white;
}

.date-month {
  font-size: 14px;
  padding: 4px 0;
  background: white;
  color: #606266;
}

.date-year {
  font-size: 12px;
  padding: 4px 0;
  background: #f5f7fa;
  color: #909399;
}

/* 不同分类的日期样式 */
.timeline-date-travel .date-day {
  background: #409eff;
}

.timeline-date-food .date-day {
  background: #67c23a;
}

.timeline-date-reading .date-day {
  background: #e6a23c;
}

.timeline-date-photography .date-day {
  background: #f56c6c;
}

.timeline-date-thoughts .date-day {
  background: #909399;
}

/* 空状态样式 */
.empty-state {
  padding: 3rem 0;
  text-align: center;
}

/* 列表动画 */
.fade-list-enter-active,
.fade-list-leave-active {
  transition: all 0.5s ease;
}
.fade-list-enter-from,
.fade-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .timeline-date {
    left: -100px;
    width: 70px;
  }
}

@media (max-width: 992px) {
  .timeline-date {
    left: -80px;
    width: 60px;
  }

  .date-day {
    font-size: 20px;
  }
}

@media (max-width: 768px) {
  .card-content {
    flex-direction: column;
  }

  .image-content {
    order: -1;
  }

  .post-image {
    height: 200px;
    margin-bottom: 1rem;
  }

  .timeline-date {
    position: relative;
    left: 0;
    margin-bottom: 1rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: none;
    background: transparent;
  }

  .date-day,
  .date-month,
  .date-year {
    padding: 4px 8px;
    font-size: 14px;
    background: transparent;
  }

  .date-day {
    border-radius: 4px;
  }

  .animated-title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }
}

@media (max-width: 576px) {
  .page-header {
    padding: 1.5rem 0;
  }

  .category-filter {
    overflow-x: auto;
    white-space: nowrap;
    padding: 0.5rem;
  }

  .post-description {
    line-height: 1.6;
  }
}
</style>
