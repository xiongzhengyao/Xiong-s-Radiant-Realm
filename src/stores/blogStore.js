import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBlogStore = defineStore('blog', () => {
  const markdownFiles = {
    'linux-system-programming': {
      id: 6,
      title: 'Linux 系统编程基础指南',
      date: '2024-02-12',
      author: '熊正耀',
      image: 'https://picsum.photos/800/405',
      excerpt: '深入探讨 Linux 系统编程的核心概念，包括进程管理、线程编程、文件系统、网络编程等重要主题...',
      markdownFile: '/posts/linux-system-programming.md',
      tags: ['Linux', '系统编程', '进程管理', '网络编程'],
      category: 'linux'
    },
    'i2c-i3c-protocols': {
      id: 1,
      title: 'I2C 和 I3C 协议详解',
      date: '2024-02-10',
      author: '熊正耀',
      image: 'https://picsum.photos/800/404',
      excerpt: '深入分析 I2C 和 I3C 协议的工作原理、特性对比、应用场景以及开发注意事项...',
      markdownFile: '/posts/i2c-i3c-protocols.md',
      tags: ['通信协议', '嵌入式', '硬件开发', 'I2C'],
      category: 'protocol'
    },
    'learning-resources': {
      id: 2,
      title: '嵌入式开发学习资料整理',
      date: '2024-02-08',
      author: '熊正耀',
      image: 'https://picsum.photos/800/403',
      excerpt: '整理了嵌入式开发相关的学习资料，包括编程语言、操作系统、硬件基础...',
      markdownFile: '/posts/learning-resources.md',
      tags: ['嵌入式', '学习资料', '开发工具'],
      category: 'embedded'
    },
    'image-sensors': {
      id: 3,
      title: '图像传感器的工作原理与应用',
      date: '2024-02-06',
      author: '熊正耀',
      image: 'https://picsum.photos/800/402',
      excerpt: '本文将深入探讨图像传感器的工作原理，包括 CMOS 和 CCD 传感器的差异...',
      markdownFile: '/posts/image-sensors.md',
      tags: ['传感器', 'CMOS', 'CCD', '图像处理'],
      category: 'sensor'
    },
    'environmental-sensors': {
      id: 4,
      title: '环境传感器在智能家居中的应用',
      date: '2024-02-04',
      author: '熊正耀',
      image: 'https://picsum.photos/800/401',
      excerpt: '探讨温湿度、空气质量、光线等环境传感器在智能家居场景中的应用...',
      markdownFile: '/posts/environmental-sensors.md',
      tags: ['传感器', '智能家居', 'IoT', '环境监测'],
      category: 'sensor'
    },
    'inertial-sensors': {
      id: 5,
      title: '惯性传感器在手机中的应用',
      date: '2024-02-02',
      author: '熊正耀',
      image: 'https://picsum.photos/800/400',
      excerpt: '分析加速度计、陀螺仪、磁力计等惯性传感器在智能手机中的应用...',
      markdownFile: '/posts/inertial-sensors.md',
      tags: ['传感器', '惯性传感器', '嵌入式', '驱动开发'],
      category: 'sensor'
    },
    'sensor-calculations': {
      id: 7,
      title: '传感器相关计算公式详解',
      date: '2024-02-14',
      author: '熊正耀',
      image: 'https://picsum.photos/800/406',
      excerpt: '详细介绍各类传感器的计算公式，包括温度、压力、加速度、光电、湿度传感器等的数学模型和校准方法...',
      markdownFile: '/posts/sensor-calculations.md',
      tags: ['传感器', '公式', '校准', '信号处理'],
      category: 'sensor'
    }
  }

  const posts = ref(Object.values(markdownFiles))

  const getPostById = (id) => {
    return posts.value.find(post => post.id === Number(id))
  }

  const getPostBySlug = (slug) => {
    return markdownFiles[slug]
  }

  const getAdjacentPosts = (id) => {
    const currentIndex = posts.value.findIndex(post => post.id === Number(id))
    return {
      prev: posts.value[currentIndex - 1] || null,
      next: posts.value[currentIndex + 1] || null
    }
  }

  return {
    markdownFiles,
    posts,
    getPostById,
    getPostBySlug,
    getAdjacentPosts
  }
}) 