const prefetched = new Set()

const routeImports = {
  '/about': () => import('@/views/About.vue'),
  '/blog': () => import('@/views/Blog.vue'),
  '/projects': () => import('@/views/Projects.vue'),
  '/life': () => import('@/views/Life.vue'),
  '/contact': () => import('@/views/Contact.vue')
}

export function prefetchRoute(path) {
  const loader = routeImports[path]
  if (!loader || prefetched.has(path)) return
  prefetched.add(path)
  loader()
}

export function useNavPrefetch() {
  return { prefetchRoute }
}
