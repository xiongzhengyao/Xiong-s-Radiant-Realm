/** Pure catalog queries. Safe for Vite and for Node scripts (no Vue). */

function byOrder(a, b) {
  return a.order - b.order
}

function entryPath(mod) {
  if (mod.nav?.path) return mod.nav.path
  const concrete = (mod.routes || []).find(
    route => !route.path.includes(':') && !route.path.includes('*')
  )
  if (concrete) return concrete.path
  return mod.sitemap?.path || ''
}

function entryLabel(mod) {
  return mod.nav?.label || mod.label || ''
}

function primaryNav(catalog) {
  return catalog
    .filter(mod => mod.nav?.primary)
    .slice()
    .sort(byOrder)
    .map(mod => ({
      id: mod.id,
      path: entryPath(mod),
      label: entryLabel(mod)
    }))
}

function tabNav(catalog) {
  return catalog
    .filter(mod => mod.nav?.tab)
    .slice()
    .sort(byOrder)
    .map(mod => ({
      id: mod.id,
      path: entryPath(mod),
      label: entryLabel(mod),
      icon: mod.nav.icon
    }))
}

function footerLinks(catalog, group) {
  return catalog
    .filter(mod => mod.footer === group)
    .slice()
    .sort(byOrder)
    .map(mod => ({
      path: entryPath(mod),
      label: entryLabel(mod)
    }))
}

function commandPages(catalog) {
  return catalog
    .filter(mod => mod.command)
    .slice()
    .sort(byOrder)
    .map(mod => ({
      key: `nav-${mod.id}`,
      path: entryPath(mod),
      labelKey: entryLabel(mod)
    }))
}

function notFoundLinks(catalog) {
  return catalog
    .filter(mod => mod.notFound)
    .slice()
    .sort(byOrder)
    .map(mod => ({
      path: entryPath(mod),
      label: entryLabel(mod)
    }))
}

function staticSitemap(catalog) {
  return catalog
    .filter(mod => mod.sitemap?.path)
    .slice()
    .sort((a, b) => (a.sitemap.order ?? a.order) - (b.sitemap.order ?? b.order))
    .map(mod => ({
      path: mod.sitemap.path,
      changefreq: mod.sitemap.changefreq || 'monthly'
    }))
}

function isNavActive(path, route) {
  const current = route?.path || ''
  if (path === '/') return current === '/'
  if (route?.meta?.highlightNav === path) return true
  return current === path || current.startsWith(`${path}/`)
}

function validateCatalog(catalog) {
  const errors = []
  const ids = new Set()
  const names = new Set()
  const paths = new Set()
  const exposed = mod => mod.nav || mod.footer || mod.command || mod.notFound

  for (const mod of catalog) {
    if (!mod.id) errors.push('module missing id')
    else if (ids.has(mod.id)) errors.push(`duplicate module id ${mod.id}`)
    else ids.add(mod.id)

    if (typeof mod.order !== 'number') errors.push(`${mod.id || '?'} missing order`)
    if (exposed(mod) && !entryLabel(mod)) errors.push(`${mod.id} is exposed without a label`)
    if (exposed(mod) && !entryPath(mod)) errors.push(`${mod.id} is exposed without a path`)
    if (mod.nav?.tab && !mod.nav.icon) errors.push(`${mod.id} tab missing icon`)
    if (mod.footer && !['explore', 'about'].includes(mod.footer)) {
      errors.push(`${mod.id} unknown footer group ${mod.footer}`)
    }
    if ((mod.routes || []).length && !mod.component) errors.push(`${mod.id} missing component`)

    for (const route of mod.routes || []) {
      if (!route.name) errors.push(`${mod.id} route missing name`)
      else if (names.has(route.name)) errors.push(`duplicate route name ${route.name}`)
      else names.add(route.name)

      if (!route.path) errors.push(`${mod.id} route missing path`)
      else if (paths.has(route.path)) errors.push(`duplicate route path ${route.path}`)
      else paths.add(route.path)
    }
  }

  if (!names.has('NotFound')) errors.push('missing NotFound route')
  return errors
}

export {
  entryPath,
  entryLabel,
  primaryNav,
  tabNav,
  footerLinks,
  commandPages,
  notFoundLinks,
  staticSitemap,
  isNavActive,
  validateCatalog
}
