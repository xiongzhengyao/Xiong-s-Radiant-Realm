import Home from '@/views/Home.vue'

/** Component key → Vue route component. Home stays eager; the rest are lazy. */
export const componentLoaders = {
  home: Home,
  about: () => import('@/views/About.vue'),
  blog: () => import('@/views/Blog.vue'),
  projects: () => import('@/views/Projects.vue'),
  life: () => import('@/views/Life.vue'),
  contact: () => import('@/views/Contact.vue'),
  notFound: () => import('@/views/NotFound.vue')
}
