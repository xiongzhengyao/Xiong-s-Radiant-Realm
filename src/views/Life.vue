<template>
  <div class="life">
    <el-row justify="center">
      <el-col :span="18">
        <h1>生活点滴</h1>
        
        <!-- 生活分类 -->
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

        <!-- 时间线展示 -->
        <el-timeline>
          <el-timeline-item
            v-for="post in filteredPosts"
            :key="post.id"
            :timestamp="formatDate(post.date)"
            :type="getTimelineItemType(post.category)"
            placement="top"
            size="large"
          >
            <div class="timeline-date" :class="getTimelineClass(post.category)">
              <div class="date-day">{{ getDay(post.date) }}</div>
              <div class="date-month">{{ getMonth(post.date) }}</div>
              <div class="date-year">{{ getYear(post.date) }}</div>
            </div>
            <el-card class="timeline-card">
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
                    >
                      {{ tag }}
                    </el-tag>
                  </div>
                  <p class="post-description">{{ post.description }}</p>
                  <el-button 
                    :type="getButtonType(post.category)"
                    text 
                    class="read-more"
                    @click="showPostDetail(post)"
                  >
                    阅读更多
                  </el-button>
                </div>
                <div class="image-content">
                  <el-image 
                    :src="post.image" 
                    fit="cover"
                    class="post-image"
                    :preview-src-list="[post.image]"
                  />
                </div>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Calendar } from '@element-plus/icons-vue'

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
    description: '周末在上海的人文探索之旅，感受这座城市的魅力。漫步于外滩，感受黄浦江两岸的风景；穿行于田子坊，体验上海的文艺气息；夜游南京路，欣赏繁华都市的夜景...',
    tags: ['旅行', '城市', '文化'],
    category: 'travel'
  },
  {
    id: 2,
    title: '年度摄影作品集',
    date: '2024-02-08',
    image: 'https://picsum.photos/800/401',
    description: '记录生活中的美好瞬间，分享我的摄影心得。用镜头捕捉城市的光影变化，记录四季的自然风光，定格生活中的精彩瞬间...',
    tags: ['摄影', '艺术', '生活'],
    category: 'photography'
  },
  {
    id: 3,
    title: '读《人类简史》有感',
    date: '2024-02-05',
    image: 'https://picsum.photos/800/402',
    description: '关于人类历史、文明演进的思考。从认知革命到科技革命，人类社会经历了怎样的变迁？未来又将走向何方？读完这本书，让我对人类文明有了更深的认识...',
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

// 根据分类获取时间线项的类型
const getTimelineItemType = (category) => {
  switch (category) {
    case 'travel': return 'primary'
    case 'food': return 'success'
    case 'reading': return 'warning'
    case 'photography': return 'danger'
    case 'thoughts': return 'info'
    default: return ''
  }
}

// 根据分类获取标签类型
const getTagType = (category) => {
  switch (category) {
    case 'travel': return ''
    case 'food': return 'success'
    case 'reading': return 'warning'
    case 'photography': return 'danger'
    case 'thoughts': return 'info'
    default: return ''
  }
}

// 根据分类获取按钮类型
const getButtonType = (category) => {
  switch (category) {
    case 'travel': return 'primary'
    case 'food': return 'success'
    case 'reading': return 'warning'
    case 'photography': return 'danger'
    case 'thoughts': return 'info'
    default: return 'primary'
  }
}

const showPostDetail = (post) => {
  // TODO: 实现文章详情查看功能
  console.log('查看文章:', post.title)
}

// 日期格式化函数
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return weekdays[date.getDay()]
}

const getDay = (dateStr) => {
  return new Date(dateStr).getDate().toString().padStart(2, '0')
}

const getMonth = (dateStr) => {
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', 
                 '七月', '八月', '九月', '十月', '十一月', '十二月']
  return months[new Date(dateStr).getMonth()]
}

const getYear = (dateStr) => {
  return new Date(dateStr).getFullYear()
}

const getTimelineClass = (category) => {
  return `timeline-date-${category}`
}
</script>

<style scoped>
.life {
  padding: 4rem 0;
  background-color: #f5f7fa;
  min-height: 100vh;
}

h1 {
  text-align: center;
  margin-bottom: 3rem;
  color: #303133;
}

.category-filter {
  text-align: center;
  margin-bottom: 3rem;
}

.timeline-card {
  margin-bottom: 1rem;
}

.card-content {
  display: flex;
  gap: 2rem;
}

.text-content {
  flex: 1;
}

.image-content {
  flex: 1;
}

.post-image {
  width: 100%;
  height: 250px;
  border-radius: 4px;
  object-fit: cover;
}

h3 {
  margin: 0 0 1rem 0;
  color: #303133;
}

.post-tags {
  margin-bottom: 1rem;
}

.post-tag {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.post-description {
  color: #606266;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.read-more {
  margin-top: 1rem;
}

.timeline-date {
  position: absolute;
  left: -120px;
  top: 0;
  width: 80px;
  text-align: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s;
}

.timeline-date:hover {
  transform: scale(1.05);
}

.date-day {
  font-size: 24px;
  font-weight: bold;
  padding: 8px 0;
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
  background: #409EFF;
}

.timeline-date-food .date-day {
  background: #67C23A;
}

.timeline-date-reading .date-day {
  background: #E6A23C;
}

.timeline-date-photography .date-day {
  background: #F56C6C;
}

.timeline-date-thoughts .date-day {
  background: #909399;
}

/* 响应式布局 */
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

  .date-day, .date-month, .date-year {
    padding: 4px 8px;
    font-size: 14px;
    background: transparent;
  }

  .date-day {
    border-radius: 4px;
  }
}
</style> 