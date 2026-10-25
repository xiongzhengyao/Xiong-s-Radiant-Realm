// 应用常量配置
export const APP_CONFIG = {
  TITLE: 'Snowhush',
  DESCRIPTION: '把光写进系统，把安静留在页面。Camera 驱动 · 摄影与海报',
  DESCRIPTION_EN: 'Quiet as fresh snow. Camera systems · photography & posters',
  EMAIL: 'xiongzhengyao163@163.com',
  PHONE: '+86 188 0030 9920',
  SHOW_PHONE: false,
  SITE_URL: 'https://snowhush.com',
  VERSION: '1.0.0',
  SOCIAL: {
    GITHUB: 'https://github.com/xiongzhengyao',
    CSDN: 'https://blog.csdn.net/qq_38741583'
  },
  IMAGES: {
    PROFILE: '/images/profile.jpg',
    HERO_WORKSPACE: '/images/hero-workspace.svg',
    OG_DEFAULT: '/og-default.png'
  },
  // Early August 2022 — first full-time role
  CAREER_START: '2022-08-01'
}

// 博客分类配置
export const BLOG_CATEGORIES = [
  { name: 'Embedded', label: '嵌入式' },
  { name: 'Linux', label: 'Linux' },
  { name: 'Sensor', label: 'Sensor' },
  { name: 'Camera', label: '影像' },
  { name: 'Notes', label: 'Notes' }
]

// 路由配置
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  BLOG: '/blog',
  PROJECTS: '/projects',
  LIFE: '/life',
  CONTACT: '/contact'
}

// 分页配置
export const PAGINATION = {
  PAGE_SIZE: 5,
  PAGE_SIZES: [5, 10, 20, 50]
}
