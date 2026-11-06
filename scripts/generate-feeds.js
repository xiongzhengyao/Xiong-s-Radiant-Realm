const fs = require('fs')
const path = require('path')
const catalog = require('../src/modules/catalog.cjs')
const { staticSitemap } = require('../src/modules/query.cjs')
const { blogPostPath, lifePath, projectPath } = require('../src/modules/paths.cjs')
const sources = require('../src/modules/content-sources.cjs')

const ROOT = path.join(__dirname, '..')
const PUBLIC_DIR = path.join(ROOT, 'public')
const SITE_URL = process.env.SITE_URL || 'https://snowhush.com'

const escapeXml = str =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const generateRss = posts => {
  const items = posts
    .map(post => {
      const url = `${SITE_URL}${blogPostPath(post)}`
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
  const staticUrls = staticSitemap(catalog)
    .map(page => urlEntry(page.path, today, page.changefreq))
    .join('\n')
  const postUrls = posts.map(post => urlEntry(blogPostPath(post), post.date)).join('\n')
  const lifeUrls = lifeIds.map(id => urlEntry(lifePath(id), today)).join('\n')
  const projectUrls = projectIds.map(id => urlEntry(projectPath(id), today)).join('\n')

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
  const posts = sources.loadPosts()
  const lifeIds = sources.loadLifeIds()
  const projectIds = sources.loadProjectIds()
  fs.writeFileSync(path.join(PUBLIC_DIR, 'rss.xml'), generateRss(posts))
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'sitemap.xml'),
    generateSitemap(posts, lifeIds, projectIds)
  )
  console.log(
    `Generated rss.xml and sitemap.xml (${posts.length} posts, ${lifeIds.length} life, ${projectIds.length} projects)`
  )
}

module.exports = {
  parseFrontmatter: sources.parseFrontmatter,
  slugToId: sources.slugToId,
  stripMd: sources.stripMd,
  loadPosts: sources.loadPosts,
  generateRss,
  generateSitemap,
  loadLifeIds: sources.loadLifeIds,
  loadProjectIds: sources.loadProjectIds,
  escapeXml
}

if (require.main === module) main()
