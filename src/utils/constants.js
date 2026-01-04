// 应用常量配置
export const APP_CONFIG = {
  TITLE: "Xiong's Radiant Realm",
  DESCRIPTION: '个人动态分享与技术博客',
  VERSION: '1.0.0'
}

// 博客分类配置
export const BLOG_CATEGORIES = [
  { name: 'linux', label: 'Linux 开发' },
  { name: 'cpp', label: 'C++ 开发' },
  { name: 'embedded', label: '嵌入式开发' },
  { name: 'protocol', label: '通信协议' },
  { name: 'sensor', label: '传感器' }
]

// 路由配置
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  BLOG: '/blog',
  LIFE: '/life',
  CONTACT: '/contact'
}

// 分页配置
export const PAGINATION = {
  PAGE_SIZE: 5,
  PAGE_SIZES: [5, 10, 20, 50]
}
