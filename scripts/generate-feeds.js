const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const POSTS_DIR = path.join(ROOT, 'src/assets/posts')
const PUBLIC_DIR = path.join(ROOT, 'public')
const SITE_URL = process.env.SITE_URL || 'https://xiongzhengyao.dev'

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
      const excerpt = frontmatter.excerpt || body.replace(/[#>*`\n]/g, ' ').slice(0, 160)
      const date = frontmatter.date || new Date().toISOString().slice(0, 10)
      const id = slugToId(slug)
      return { slug, id, title, excerpt, date, body }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

const escapeXml = str =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const generateRss = posts => {
  const items = posts
    .map(post => {
      const url = `${SITE_URL}/blog/${post.id}/${post.slug}`
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Xiong's Radiant Realm</title>
    <link>${SITE_URL}</link>
    <description>Camera driver engineer — tech blog</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`
}

const generateSitemap = posts => {
  const staticPages = ['/', '/about', '/projects', '/blog', '/life', '/contact']
  const staticUrls = staticPages
    .map(p => `  <url><loc>${SITE_URL}${p}</loc><changefreq>weekly</changefreq></url>`)
    .join('\n')
  const postUrls = posts
    .map(
      post =>
        `  <url><loc>${SITE_URL}/blog/${post.id}/${post.slug}</loc><lastmod>${post.date}</lastmod><changefreq>monthly</changefreq></url>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${postUrls}
</urlset>
`
}

const main = () => {
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true })
  const posts = loadPosts()
  fs.writeFileSync(path.join(PUBLIC_DIR, 'rss.xml'), generateRss(posts))
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), generateSitemap(posts))
  console.log(`Generated rss.xml and sitemap.xml (${posts.length} posts)`)
}

main()
