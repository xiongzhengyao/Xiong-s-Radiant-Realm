const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const POSTS_DIR = path.join(ROOT, 'src/assets/posts')
const I18N_ZH = path.join(ROOT, 'src/i18n/zh.js')
const CAREER_JS = path.join(ROOT, 'src/data/career.js')
const PUBLIC_DIR = path.join(ROOT, 'public')
const SITE_URL = process.env.SITE_URL || 'https://snowhush.com'

const parseFrontmatter = content => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) return { frontmatter: {}, body: content }
  const frontmatter = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const rawValue = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '')
    if (key) frontmatter[key] = rawValue
  }
  return { frontmatter, body: content.slice(match[0].length) }
}

const slugToId = slug => {
  let hash = 0
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0
  }
  return hash % 1000000
}

const stripMd = text =>
  String(text || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`[\]()!-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const loadPosts = () => {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs
    .readdirSync(POSTS_DIR)
    .filter(name => name.endsWith('.md') && !name.startsWith('_'))
    .map(name => {
      const slug = name.replace(/\.md$/i, '')
      const raw = fs.readFileSync(path.join(POSTS_DIR, name), 'utf8')
      const { frontmatter, body } = parseFrontmatter(raw)
      const titleMatch = body.match(/^#\s+(.+)$/m)
      const title = frontmatter.title || titleMatch?.[1]?.trim() || slug
      const excerpt = frontmatter.excerpt || stripMd(body).slice(0, 160)
      const date = frontmatter.date || new Date().toISOString().slice(0, 10)
      const id = slugToId(slug)
      const contentText = stripMd(body).slice(0, 4000)
      return { slug, id, title, excerpt, date, body, contentText }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

const escapeXml = str =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const loadIdsFromSource = (filePath, blockRe) => {
  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    const match = raw.match(blockRe)
    if (!match) return []
    const ids = []
    const idRe = /id:\s*['"]([a-zA-Z0-9_-]+)['"]/g
    let m
    while ((m = idRe.exec(match[1]))) ids.push(m[1])
    return [...new Set(ids)]
  } catch {
    return []
  }
}

const loadLifeIds = () =>
  loadIdsFromSource(I18N_ZH, /posts:\s*\[([\s\S]*?)\]\s*\n\s*\},?\s*\n\s*projects:/)

const loadProjectIds = () =>
  loadIdsFromSource(CAREER_JS, /CAREER_ITEMS\s*=\s*\[([\s\S]*?)\]\s*\n\s*export/)

const generateRss = posts => {
  const items = posts
    .map(post => {
      const url = `${SITE_URL}/blog/${post.id}/${encodeURIComponent(post.slug)}`
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
      <content:encoded><![CDATA[${post.contentText || post.excerpt}]]></content:encoded>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Snowhush</title>
    <link>${SITE_URL}</link>
    <description>Quiet as fresh snow. Camera systems · notes</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`
}

const urlEntry = (loc, lastmod, changefreq = 'monthly') => {
  const mod = lastmod ? `<lastmod>${lastmod}</lastmod>` : ''
  return `  <url><loc>${SITE_URL}${loc}</loc>${mod}<changefreq>${changefreq}</changefreq></url>`
}

const generateSitemap = (posts, lifeIds, projectIds) => {
  const today = new Date().toISOString().slice(0, 10)
  const staticPages = [
    ['/', 'weekly'],
    ['/about', 'monthly'],
    ['/projects', 'weekly'],
    ['/blog', 'weekly'],
    ['/life', 'weekly'],
    ['/contact', 'yearly'],
    ['/resume.html', 'monthly']
  ]
  const staticUrls = staticPages.map(([p, freq]) => urlEntry(p, today, freq)).join('\n')
  const postUrls = posts
    .map(post => urlEntry(`/blog/${post.id}/${encodeURIComponent(post.slug)}`, post.date))
    .join('\n')
  const lifeUrls = lifeIds.map(id => urlEntry(`/life/${id}`, today)).join('\n')
  const projectUrls = projectIds.map(id => urlEntry(`/projects/${id}`, today)).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${postUrls}
${lifeUrls}
${projectUrls}
</urlset>
`
}

const main = () => {
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true })
  const posts = loadPosts()
  const lifeIds = loadLifeIds()
  const projectIds = loadProjectIds()
  fs.writeFileSync(path.join(PUBLIC_DIR, 'rss.xml'), generateRss(posts))
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), generateSitemap(posts, lifeIds, projectIds))
  console.log(
    `Generated rss.xml and sitemap.xml (${posts.length} posts, ${lifeIds.length} life, ${projectIds.length} projects)`
  )
}

module.exports = {
  parseFrontmatter,
  slugToId,
  stripMd,
  loadPosts,
  generateRss,
  generateSitemap,
  loadLifeIds,
  loadProjectIds,
  escapeXml
}

if (require.main === module) main()
