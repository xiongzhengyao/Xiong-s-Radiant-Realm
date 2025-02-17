<template>
  <div class="projects">
    <el-row justify="center">
      <el-col :span="20">
        <h1>我的项目</h1>
        
        <!-- 分类标签 -->
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
        
        <el-row :gutter="20">
          <el-col 
            v-for="project in filteredProjects" 
            :key="project.title"
            :xs="24"
            :sm="12"
            :md="8"
            class="project-col"
          >
            <el-card class="project-card" :body-style="{ padding: '0px' }">
              <img :src="project.image" class="project-image">
              <div class="project-content">
                <h3>{{ project.title }}</h3>
                <p class="project-description">{{ project.description }}</p>
                <div class="project-tags">
                  <el-tag 
                    v-for="tag in project.technologies" 
                    :key="tag"
                    size="small"
                    class="project-tag"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
                <div class="project-links">
                  <el-button 
                    v-if="project.demo" 
                    type="primary" 
                    link
                    :href="project.demo" 
                    target="_blank"
                  >
                    在线演示
                  </el-button>
                  <el-button 
                    v-if="project.github" 
                    type="primary" 
                    link
                    :href="project.github" 
                    target="_blank"
                  >
                    GitHub
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedCategory = ref('all')

const categories = [
  { name: 'linux', label: 'Linux 开发' },
  { name: 'cpp', label: 'C++ 开发' },
  { name: 'embedded', label: '嵌入式开发' },
  { name: 'camera', label: '相机开发' },
  { name: 'ai', label: '人工智能' },
  { name: 'tools', label: '工具软件' }
]

const projects = ref([
  {
    title: 'Linux 设备驱动开发框架',
    description: '基于 Linux 内核的通用设备驱动开发框架，支持字符设备、块设备和网络设备的快速开发，包含完整的驱动开发模板和调试工具。',
    image: 'https://picsum.photos/400/300',
    technologies: ['Linux', 'C', '设备驱动', 'Kernel'],
    github: 'https://github.com/example/linux-driver-framework',
    category: 'linux'
  },
  {
    title: 'Linux 系统监控工具',
    description: '一个轻量级的 Linux 系统监控工具，支持 CPU、内存、磁盘 IO、网络流量的实时监控和数据可视化，适用于服务器性能分析。',
    image: 'https://picsum.photos/400/301',
    technologies: ['Linux', 'C', 'GTK', 'SQLite'],
    demo: 'https://demo.example.com/system-monitor',
    github: 'https://github.com/example/linux-monitor',
    category: 'linux'
  },
  {
    title: '高性能图像处理库',
    description: '基于 C++17 开发的图像处理库，支持多线程并行处理、SIMD 优化，提供丰富的图像处理算法和滤镜效果。',
    image: 'https://picsum.photos/400/302',
    technologies: ['C++', 'OpenCV', 'SIMD', 'Multi-threading'],
    github: 'https://github.com/example/cpp-image-processing',
    category: 'cpp'
  },
  {
    title: '实时数据分析引擎',
    description: '使用现代 C++ 开发的高性能数据分析引擎，支持实时数据流处理、复杂事件处理和时序数据分析。',
    image: 'https://picsum.photos/400/303',
    technologies: ['C++', 'Boost', 'Protocol Buffers', 'RocksDB'],
    demo: 'https://demo.example.com/data-engine',
    github: 'https://github.com/example/cpp-data-engine',
    category: 'cpp'
  },
  {
    title: '智能客服系统',
    description: '基于机器学习的智能客服系统，支持自动回复、情感分析和多语言处理。',
    image: 'https://picsum.photos/400/304',
    technologies: ['Python', 'TensorFlow', 'Vue.js', 'Node.js'],
    demo: 'https://demo.example.com/smart-service',
    github: 'https://github.com/example/smart-service'
  },
  {
    title: '电商数据分析平台',
    description: '实时数据分析平台，支持销售预测、用户行为分析和个性化推荐。',
    image: 'https://picsum.photos/400/305',
    technologies: ['React', 'Django', 'PostgreSQL', 'Docker'],
    demo: 'https://demo.example.com/data-platform',
    github: 'https://github.com/example/data-platform'
  }
])

const filteredProjects = computed(() => {
  if (selectedCategory.value === 'all') {
    return projects.value
  }
  return projects.value.filter(project => project.category === selectedCategory.value)
})
</script>

<style scoped>
.projects {
  padding: 4rem 0;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.category-filter {
  text-align: center;
  margin-bottom: 3rem;
}

h1 {
  text-align: center;
  margin-bottom: 3rem;
  color: #303133;
}

.project-col {
  margin-bottom: 2rem;
}

.project-card {
  height: 100%;
  transition: transform 0.3s;
}

.project-card:hover {
  transform: translateY(-5px);
}

.project-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.project-content {
  padding: 1.5rem;
}

.project-content h3 {
  margin: 0 0 1rem 0;
  color: #303133;
}

.project-description {
  color: #606266;
  margin-bottom: 1rem;
  min-height: 4.5em;
}

.project-tags {
  margin-bottom: 1rem;
}

.project-tag {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.project-links {
  display: flex;
  gap: 1rem;
}
</style>
