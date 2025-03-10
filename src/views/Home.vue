<template>
  <section class="home">
    <el-row class="hero" justify="center" align="middle">
      <el-col :span="16" class="text-center">
        <h1>{{ $t('home.welcome') }}</h1>
        <p class="subtitle">{{ $t('home.subtitle') }}</p>
        <el-button type="primary" size="large" @click="$router.push('/blog')">
          {{ $t('home.viewProjects') }}
        </el-button>
      </el-col>
    </el-row>

    <section class="section">
      <el-col :span="20">
        <h2>{{ $t('home.skills.title') }}</h2>
        <el-row :gutter="20">
          <el-col :span="8" v-for="skill in skills" :key="skill.name">
            <el-card class="skill-card">
              <el-icon size="40" class="skill-icon">
                <component :is="skill.icon" />
              </el-icon>
              <h3>{{ skill.name }}</h3>
              <p>{{ skill.description }}</p>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </section>

    <section class="section">
      <el-col :span="20">
        <h2>{{ $t('home.blog.title') }}</h2>
        <el-row :gutter="20">
          <el-col :span="8" v-for="post in latestPosts" :key="post.title">
            <el-card class="blog-card" @click="$router.push('/blog')">
              <img :src="post.image" class="blog-image" />
              <h3>{{ post.title }}</h3>
              <p>{{ post.excerpt }}</p>
              <div class="blog-meta">
                <span>{{ post.date }}</span>
                <el-tag size="small">{{ post.category }}</el-tag>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </section>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const skills = ref([
  {
    name: t('home.skills.embedded.name'),
    icon: 'Cpu',
    description: t('home.skills.embedded.description')
  },
  {
    name: t('home.skills.image.name'),
    icon: 'Picture',
    description: t('home.skills.image.description')
  },
  {
    name: t('home.skills.linux.name'),
    icon: 'Terminal',
    description: t('home.skills.linux.description')
  }
])

const latestPosts = ref([
  {
    title: '嵌入式 Linux 驱动开发指南',
    excerpt: '深入探讨嵌入式 Linux 驱动的开发流程和最佳实践...',
    image: 'https://picsum.photos/300/200',
    date: '2024-02-01',
    category: '驱动开发'
  },
  {
    title: '相机 ISP 图像处理算法分析',
    excerpt: '深入探讨移动相机 ISP 的图像处理算法和优化方案...',
    image: 'https://picsum.photos/300/201',
    date: '2024-01-28',
    category: '图像处理'
  },
  {
    title: '嵌入式系统性能优化指南',
    excerpt: '分享嵌入式系统的性能优化策略和实践经验...',
    image: 'https://picsum.photos/300/202',
    date: '2024-01-25',
    category: '系统优化'
  }
])
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  height: 80vh;
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  color: white;
  text-align: center;
  padding: 2rem;
  display: flex;
  align-items: center;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.section {
  padding: 4rem 0;
}

.section h2 {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2rem;
  color: #333;
}

.skill-card, .blog-card {
  text-align: center;
  padding: 2rem;
  height: 100%;
  transition: transform 0.3s;
}

.skill-card:hover, .blog-card:hover {
  transform: translateY(-5px);
}

.skill-icon {
  color: #409EFF;
  margin-bottom: 1rem;
}

.blog-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin-bottom: 1rem;
}

.blog-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  color: #666;
}
</style>
