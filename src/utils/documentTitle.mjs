export function formatDocumentTitle(pageTitle, brand = 'Snowhush') {
  const name = String(brand || 'Snowhush').trim() || 'Snowhush'
  const title = String(pageTitle || '').trim()
  if (!title || title === name) return name
  if (title.startsWith(`${name} ·`) || title.startsWith(`${name} -`)) return title
  return `${title} · ${name}`
}
