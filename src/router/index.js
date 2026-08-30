import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { titleKey: 'meta.homeTitle', descKey: 'meta.homeDesc' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: { titleKey: 'meta.aboutTitle', descKey: 'meta.aboutDesc' }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('../views/Blog.vue'),
    meta: { titleKey: 'meta.blogTitle', descKey: 'meta.blogDesc' }
  },
  {
    path: '/blog/:id/:slug',
    name: 'BlogPost',
    component: () => import('../views/Blog.vue'),
    props: true,
    meta: { titleKey: 'meta.blogTitle', descKey: 'meta.blogDesc' }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('../views/Projects.vue'),
    meta: { titleKey: 'meta.projectsTitle', descKey: 'meta.projectsDesc' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/Contact.vue'),
    meta: { titleKey: 'meta.contactTitle', descKey: 'meta.contactDesc' }
  },
  {
    path: '/life',
    name: 'Life',
    component: () => import('../views/Life.vue'),
    meta: { titleKey: 'meta.lifeTitle', descKey: 'meta.lifeDesc' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'auto' }
    return { top: 0, behavior: 'auto' }
  }
})

export default router
