<template>
  <div class="life">
    <!-- Header -->
    <section class="life-hero">
      <div class="container">
        <h1 class="reveal">生活点滴</h1>
        <p class="life-hero-sub reveal reveal-delay-1">记录生活中的美好瞬间与感悟</p>
      </div>
    </section>

    <!-- Filters -->
    <section class="filter-bar">
      <div class="container">
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
      </div>
    </section>

    <!-- Content -->
    <section class="section">
      <div class="container-wide">
        <div v-if="filteredPosts.length > 0" class="life-grid">
          <article
            v-for="(post, idx) in filteredPosts"
            :key="post.id"
            class="life-card reveal"
            :class="[`reveal-delay-${(idx % 4) + 1}`, { featured: idx === 0 }]"
          >
            <div class="life-card-image">
              <img :src="post.image" :alt="post.title" loading="lazy" />
              <div class="life-card-date">
                <span class="date-day">{{ getDay(post.date) }}</span>
                <span class="date-month">{{ getMonth(post.date) }}</span>
              </div>
            </div>
            <div class="life-card-body">
              <div class="life-card-tags">
                <span class="tag tag-accent" v-for="tag in post.tags" :key="tag">{{ tag }}</span>
              </div>
              <h3>{{ post.title }}</h3>
              <p>{{ post.description }}</p>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          <p>暂无相关内容</p>
          <button class="btn btn-outline" @click="selectedCategory = 'all'">查看全部</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const selectedCategory = ref('all')

const categories = [
  { name: 'travel', label: '旅行' },
  { name: 'food', label: '美食' },
  { name: 'reading', label: '读书' },
  { name: 'photography', label: '摄影' },
  { name: 'thoughts', label: '随想' }
]

const posts = ref([
  {
    id: 1,
    title: '上海周末游记',
    date: '2024-02-10',
    image: 'https://picsum.photos/800/400',
    description: '周末在上海的人文探索之旅，感受这座城市的魅力。漫步于外滩，感受黄浦江两岸的风景；穿行于田子坊，体验上海的文艺气息。',
    tags: ['旅行', '城市'],
    category: 'travel'
  },
  {
    id: 2,
    title: '年度摄影作品集',
    date: '2024-02-08',
    image: 'https://picsum.photos/800/401',
    description: '记录生活中的美好瞬间，分享我的摄影心得。用镜头捕捉城市的光影变化，记录四季的自然风光。',
    tags: ['摄影', '艺术'],
    category: 'photography'
  },
  {
    id: 3,
    title: '读《人类简史》有感',
    date: '2024-02-05',
    image: 'https://picsum.photos/800/402',
    description: '关于人类历史、文明演进的思考。从认知革命到科技革命，人类社会经历了怎样的变迁？',
    tags: ['读书', '思考'],
    category: 'reading'
  }
])

const filteredPosts = computed(() => {
  if (selectedCategory.value === 'all') return posts.value
  return posts.value.filter(post => post.category === selectedCategory.value)
})

const getDay = dateStr => new Date(dateStr).getDate().toString().padStart(2, '0')

const getMonth = dateStr => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  return months[new Date(dateStr).getMonth()]
}

let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible') }),
    { threshold: 0.1 }
  )
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
})

onUnmounted(() => { observer?.disconnect() })
</script>

<style scoped>
.life {
  padding-top: var(--nav-height);
  min-height: 100vh;
  background: var(--color-bg);
}

/* --- Hero --- */
.life-hero {
  padding: var(--space-20) 0 var(--space-8);
  text-align: center;
}

.life-hero h1 {
  font-size: clamp(32px, 5vw, 48px);
  margin-bottom: var(--space-3);
}

.life-hero-sub {
  font-size: 19px;
  color: var(--color-text-secondary);
}

/* --- Filter Bar --- */
.filter-bar {
  position: sticky;
  top: var(--nav-height);
  z-index: 50;
  padding: var(--space-4) 0;
  background: var(--color-nav-bg);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--color-divider);
}

.filter-pills {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  justify-content: center;
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

/* --- Grid --- */
.life-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6);
}

.life-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: transform var(--duration-base) var(--ease-out),
              box-shadow var(--duration-base) var(--ease-out);
}

.life-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.life-card.featured {
  grid-column: 1 / -1;
}

.life-card.featured .life-card-image {
  height: 360px;
}

.life-card-image {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
}

.life-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-slow) var(--ease-out);
}

.life-card:hover .life-card-image img {
  transform: scale(1.04);
}

.life-card-date {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 48px;
}

.date-day {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
}

.date-month {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.life-card-body {
  padding: var(--space-5) var(--space-6) var(--space-6);
}

.life-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.life-card-body h3 {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: var(--space-2);
  color: var(--color-text);
}

.life-card-body p {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* --- Empty --- */
.empty-state {
  text-align: center;
  padding: var(--space-16) 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.empty-state p {
  color: var(--color-text-tertiary);
  font-size: 17px;
}

/* --- Responsive --- */
@media (max-width: 734px) {
  .life-grid {
    grid-template-columns: 1fr;
  }

  .life-card.featured .life-card-image {
    height: 240px;
  }

  .filter-pills {
    overflow-x: auto;
    flex-wrap: nowrap;
    justify-content: flex-start;
    padding-bottom: var(--space-1);
  }
}
</style>
