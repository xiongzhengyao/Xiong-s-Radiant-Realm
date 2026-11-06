import { createRouter, createWebHistory } from 'vue-router'
import { buildRoutes } from '@/modules'

const router = createRouter({
  history: createWebHistory(),
  routes: buildRoutes(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'auto' }
    return { top: 0, behavior: 'auto' }
  }
})

export default router
