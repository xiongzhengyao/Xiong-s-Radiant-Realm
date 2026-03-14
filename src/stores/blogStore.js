import { ref } from 'vue'
import { defineStore } from 'pinia'

const AUTHOR_FALLBACK = '熊正耀'
const CATEGORY_FALLBACK = 'notes'
const CATEGORY_ALIAS = {
  protocol: 'embedded',
  cpp: 'embedded',
  camera: 'embedded'
}
const CATEGORY_KEYWORDS = {
  embedded: ['嵌入式', '驱动', 'i2c', 'i3c', 'spi', 'uart', 'can', '通信协议'],
  linux: ['linux', '内核', '进程', '线程', '系统编程', 'shell', '文件系统'],
  sensor: ['传感器', 'cmos', 'ccd', 'imu', 'isp', '图像', 'camera', '温湿度', '加速度'],
  notes: ['学习', '笔记', '资源', '总结', '教程']
}

const postModules = import.meta.glob('../assets/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
})

const toSlug = path => path.split('/').pop().replace(/\.md$/i, '')

const parseFrontmatter = content => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) return { frontmatter: {}, body: content }

  const block = match[1]
  const frontmatter = {}
  for (const line of block.split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const rawValue = line.slice(idx + 1).trim()
    if (!key) continue

    if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
      frontmatter[key] = rawValue
        .slice(1, -1)
        .split(',')
        .map(item => item.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
      continue
    }

    frontmatter[key] = rawValue.replace(/^['"]|['"]$/g, '')
  }

  const body = content.slice(match[0].length)
  return { frontmatter, body }
}

const extractTitle = (frontmatter, body, slug) => {
  if (frontmatter.title) return frontmatter.title

  const titleMatch = body.match(/^#\s+(.+)$/m)
  if (titleMatch?.[1]) return titleMatch[1].trim()

  return slug
}

const extractExcerpt = (frontmatter, body) => {
  if (frontmatter.excerpt) return frontmatter.excerpt

  const lines = body
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .filter(line => !line.startsWith('#'))
    .filter(line => !line.startsWith('```'))
    .filter(line => !line.startsWith('- '))
    .filter(line => !line.startsWith('|'))

  const text = lines.join(' ').replace(/\s+/g, ' ')
  return text.slice(0, 110) + (text.length > 110 ? '...' : '')
}

const normalizeDate = input => {
  if (!input) return new Date().toISOString().slice(0, 10)
  return input
}

const normalizeTags = tags => {
  if (Array.isArray(tags)) return tags
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)
  }
  return []
}

const normalizeKeywords = keywords => {
  if (Array.isArray(keywords)) return keywords
  if (typeof keywords === 'string') {
    return keywords
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
  }
  return []
}

const normalizeCategory = category => {
  const value = String(category || CATEGORY_FALLBACK).trim().toLowerCase()
  return CATEGORY_ALIAS[value] || value
}

const inferCategory = ({ title, tags, keywords, body }) => {
  const text = [title, ...(tags || []), ...(keywords || []), body.slice(0, 600)]
    .join(' ')
    .toLowerCase()
  const scores = Object.keys(CATEGORY_KEYWORDS).reduce((acc, key) => {
    const score = CATEGORY_KEYWORDS[key].reduce((s, kw) => (text.includes(kw) ? s + 1 : s), 0)
    acc[key] = score
    return acc
  }, {})

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
  if (!sorted.length || sorted[0][1] === 0) return CATEGORY_FALLBACK
  return sorted[0][0]
}

const slugToStableId = slug => {
  let hash = 0
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0
  }
  return hash % 1000000
}

const extractPostsFromMarkdown = () => {
  return Object.entries(postModules)
    .map(([path, rawContent]) => {
      const slug = toSlug(path)
      if (slug.startsWith('_')) return null
      const { frontmatter, body } = parseFrontmatter(rawContent)
      const title = extractTitle(frontmatter, body, slug)
      const tags = normalizeTags(frontmatter.tags)
      const keywords = normalizeKeywords(frontmatter.keywords)
      const normalizedCategory = normalizeCategory(frontmatter.category)
      const category =
        !normalizedCategory || normalizedCategory === 'auto'
          ? inferCategory({ title, tags, keywords, body })
          : normalizedCategory

      return {
        id: slugToStableId(slug),
        slug,
        title,
        date: normalizeDate(frontmatter.date),
        author: frontmatter.author || AUTHOR_FALLBACK,
        image: frontmatter.image || `https://picsum.photos/seed/${slug}/800/420`,
        excerpt: extractExcerpt(frontmatter, body),
        content: body,
        tags,
        keywords,
        category
      }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

export const useBlogStore = defineStore('blog', () => {
  const posts = ref(extractPostsFromMarkdown())

  const getPostById = id => {
    return posts.value.find(post => post.id === Number(id)) || null
  }

  const getAdjacentPosts = id => {
    const currentIndex = posts.value.findIndex(post => post.id === Number(id))
    if (currentIndex === -1) {
      return { prev: null, next: null }
    }
    return {
      prev: posts.value[currentIndex - 1] || null,
      next: posts.value[currentIndex + 1] || null
    }
  }

  return {
    posts,
    getPostById,
    getAdjacentPosts
  }
})
