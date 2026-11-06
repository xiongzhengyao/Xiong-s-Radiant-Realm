import catalog from './catalog.js'
import { validateCatalog } from './query.js'
import { componentLoaders } from './loaders'
import { tabIcons } from './tab-icons'

const catalogErrors = validateCatalog(catalog)
if (catalogErrors.length) {
  throw new Error(`Site catalog invalid:\n${catalogErrors.join('\n')}`)
}

for (const mod of catalog) {
  if (mod.component && !componentLoaders[mod.component]) {
    throw new Error(`Module "${mod.id}" references unknown component "${mod.component}"`)
  }
  if (mod.nav?.tab && !tabIcons[mod.nav.icon]) {
    throw new Error(`Module "${mod.id}" references unknown tab icon "${mod.nav.icon}"`)
  }
}

function routeMeta(mod, route) {
  return {
    titleKey: route.titleKey || '',
    descKey: route.descKey || '',
    quietSky: Boolean(route.quietSky),
    infoPage: Boolean(route.infoPage),
    articleReading: Boolean(route.articleReading),
    home: Boolean(route.home),
    transitionGroup: route.transitionGroup || '',
    highlightNav: route.highlightNav || '',
    moduleId: mod.id
  }
}

export function buildRoutes() {
  const modules = [...catalog].sort((a, b) => a.order - b.order)
  const routes = []
  for (const mod of modules) {
    const component = componentLoaders[mod.component]
    for (const route of mod.routes || []) {
      routes.push({
        path: route.path,
        name: route.name,
        component,
        props: Boolean(route.props),
        meta: routeMeta(mod, route)
      })
    }
  }
  return routes
}
