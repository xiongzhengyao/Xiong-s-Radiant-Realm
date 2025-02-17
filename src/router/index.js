import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('../views/Blog.vue')
  },
  {
    path: '/blog/:id/:slug',
    name: 'BlogPost',
    component: () => import('../views/BlogPost.vue'),
    props: true
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/Contact.vue')
  },
  {
    path: '/life',
    name: 'Life',
    component: () => import('../views/Life.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 添加全局导航守卫进行调试
router.beforeEach((to, from) => {
  console.log(`Route change: ${from.path} -> ${to.path}`)
  return true
})

export default router
