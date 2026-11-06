/**
 * Node 侧内容集合。构建 RSS / sitemap 时从这里取深链。
 * 浏览器里的搜索提供者见 src/modules/search/，id 必须和这里一致。
 */
const fs = require('fs')
const path = require('path')
const { blogPostPath, lifePath, projectPath } = require('./paths.js')

const ROOT = path.join(__dirname, '..', '..')
const POSTS_DIR = path.join(ROOT, 'src/assets/posts')
const I18N_ZH = path.join(ROOT, 'src/i18n/zh.js')
const CAREER_JS = path.join(ROOT, 'src/data/career.js')

const COLLECTIONS = [
  { id: 'notes', moduleId: 'blog' },
  { id: 'projects', moduleId: 'projects' },
  { id: 'life', moduleId: 'life' }
]

const parseFrontmatter = content => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) return { frontmatter: {}, body: content }
  const frontmatter = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const rawValue = line
      .slice(idx + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '')
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

const loadIdsFromSource = (filePath, blockRe) => {
  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    const match = raw.match(blockRe)
    if (!match) return []
    const ids = []
    const idRe = /id:\s*['"]([a-zA-Z0-9_-]+)['"]/g
    let found
    while ((found = idRe.exec(match[1]))) ids.push(found[1])
    return [...new Set(ids)]
  } catch {
    return []
  }
}

const loadLifeIds = () =>
  loadIdsFromSource(I18N_ZH, /posts:\s*\[([\s\S]*?)\]\s*\n\s*\},?\s*\n\s*projects:/)

const loadProjectIds = () =>
  loadIdsFromSource(CAREER_JS, /CAREER_ITEMS\s*=\s*\[([\s\S]*?)\]\s*\n\s*export/)

const collectionIds = () => COLLECTIONS.map(item => item.id)

const contentSitemapEntries = () => {
  const today = new Date().toISOString().slice(0, 10)
  return [
    ...loadPosts().map(post => ({ path: blogPostPath(post), lastmod: post.date })),
    ...loadLifeIds().map(id => ({ path: lifePath(id), lastmod: today })),
    ...loadProjectIds().map(id => ({ path: projectPath(id), lastmod: today }))
  ]
}

module.exports = {
  COLLECTIONS,
  parseFrontmatter,
  slugToId,
  stripMd,
  loadPosts,
  loadLifeIds,
  loadProjectIds,
  collectionIds,
  contentSitemapEntries,
  blogPostPath,
  lifePath,
  projectPath
}
