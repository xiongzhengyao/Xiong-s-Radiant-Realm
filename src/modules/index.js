/**
 * Shell-facing module API.
 * Route views should import leaf files (paths.mjs / query.mjs), not this barrel,
 * so the router graph does not cycle back through the loaders.
 */
import catalog from './catalog.mjs'
import {
  primaryNav as navOf,
  footerLinks as footerOf,
  tabNav,
  notFoundLinks as notFoundOf,
  isNavActive
} from './query.mjs'
import { tabIcons } from './tab-icons'

export { buildRoutes } from './routes'
export { prefetchRoute, useNavPrefetch } from './prefetch'
export { isNavActive }

export function primaryNav() {
  return navOf(catalog)
}

export function footerLinks(group) {
  return footerOf(catalog, group)
}

export function tabItems() {
  return tabNav(catalog).map(item => ({
    ...item,
    icon: tabIcons[item.icon]
  }))
}

export function notFoundLinks() {
  return notFoundOf(catalog)
}
