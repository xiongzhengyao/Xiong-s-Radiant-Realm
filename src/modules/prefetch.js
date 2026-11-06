import catalog from './catalog.js'
import { componentLoaders } from './loaders'

const prefetched = new Set()

export function prefetchRoute(path) {
  const mod = catalog.find(item => {
    const exact = (item.routes || []).some(route => route.path === path)
    return exact && typeof componentLoaders[item.component] === 'function'
  })
  if (!mod || prefetched.has(path)) return
  prefetched.add(path)
  componentLoaders[mod.component]()
}

export function useNavPrefetch() {
  return { prefetchRoute }
}
