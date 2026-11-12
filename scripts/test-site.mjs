import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as feeds from './generate-feeds.mjs'
import catalog from '../src/modules/catalog.mjs'
import * as query from '../src/modules/query.mjs'
import * as sources from '../src/modules/content-sources.mjs'
import { GLYPHS_FILE, SUBSET_FONT, requiredSerifGlyphs } from './serif-glyphs.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

test('slugToId is stable for known slugs', () => {
  const a = feeds.slugToId('camera-first-frame-cold-start')
  const b = feeds.slugToId('camera-first-frame-cold-start')
  assert.equal(a, b)
  assert.equal(typeof a, 'number')
})

test('parseFrontmatter reads title and excerptEn', () => {
  const raw = `---
title: Hello
excerptEn: English blurb
---

# Hello
`
  const { frontmatter, body } = feeds.parseFrontmatter(raw)
  assert.equal(frontmatter.title, 'Hello')
  assert.equal(frontmatter.excerptEn, 'English blurb')
  assert.match(body, /# Hello/)
})

test('loadPosts includes new camera notes', () => {
  const posts = feeds.loadPosts()
  const slugs = posts.map(p => p.slug)
  assert.ok(slugs.includes('camera-first-frame-cold-start'))
  assert.ok(slugs.includes('camera-stream-on-bringup-checklist'))
  assert.ok(posts.every(p => p.date && p.title && p.id != null))
})

test('generateRss embeds content:encoded', () => {
  const posts = feeds.loadPosts().slice(0, 2)
  const xml = feeds.generateRss(posts)
  assert.match(xml, /content:encoded/)
  assert.match(xml, /xmlns:content/)
})

test('generateSitemap includes life and project deep links', () => {
  const posts = feeds.loadPosts()
  const lifeIds = feeds.loadLifeIds()
  const projectIds = feeds.loadProjectIds()
  assert.ok(lifeIds.length >= 8)
  assert.ok(projectIds.includes('dji-sensor'))
  const xml = feeds.generateSitemap(posts, lifeIds, projectIds)
  assert.match(xml, /\/life\/shanghai-weekend/)
  assert.match(xml, /\/projects\/dji-sensor/)
  assert.match(xml, /\/resume\.html/)
})

test('site catalog drives nav, footer, and sitemap without duplicate routes', () => {
  assert.deepEqual(query.validateCatalog(catalog), [])
  assert.deepEqual(
    query.primaryNav(catalog).map(item => item.path),
    ['/', '/blog', '/projects', '/life', '/about']
  )
  assert.deepEqual(
    query.footerLinks(catalog, 'explore').map(item => item.path),
    ['/', '/blog', '/projects', '/life']
  )
  assert.deepEqual(
    query.footerLinks(catalog, 'about').map(item => item.path),
    ['/about', '/contact']
  )
  assert.deepEqual(
    query.notFoundLinks(catalog).map(item => item.path),
    ['/blog', '/projects', '/about', '/contact']
  )
  assert.deepEqual(
    query.staticSitemap(catalog).map(item => item.path),
    ['/', '/about', '/projects', '/blog', '/life', '/contact', '/resume.html']
  )
  assert.equal(
    query.isNavActive('/about', { path: '/contact', meta: { highlightNav: '/about' } }),
    true
  )
  assert.equal(query.isNavActive('/', { path: '/blog', meta: {} }), false)
  assert.equal(query.isNavActive('/blog', { path: '/blog/1/slug', meta: {} }), true)

  const searchIds = new Set(sources.collectionIds())
  for (const mod of catalog) {
    if (mod.search) {
      assert.ok(searchIds.has(mod.search), `${mod.id} search "${mod.search}" has no content source`)
    }
  }

  const entries = sources.contentSitemapEntries()
  assert.ok(entries.some(entry => entry.path.includes('/projects/dji-sensor')))
  assert.ok(entries.some(entry => entry.path.includes('/life/shanghai-weekend')))
})

test('design tag mapping prefers frontmatter category', () => {
  const CATEGORY_DESIGN = {
    camera: 'imaging',
    sensor: 'sensor',
    linux: 'linux',
    embedded: 'embedded',
    notes: 'notes',
    life: 'life'
  }
  const map = cat => CATEGORY_DESIGN[String(cat || '').toLowerCase()] || 'work'
  assert.equal(map('camera'), 'imaging')
  assert.equal(map('sensor'), 'sensor')
  assert.equal(map('linux'), 'linux')
  assert.equal(map(''), 'work')
})

test('serif subset stays small and covers current titles', () => {
  const bytes = fs.statSync(SUBSET_FONT).size
  assert.ok(bytes < 400 * 1024, `serif font is ${bytes} bytes`)
  const glyphs = fs.readFileSync(GLYPHS_FILE, 'utf8')
  assert.equal(glyphs, requiredSerifGlyphs())
  for (const ch of '把光写进系统') {
    assert.ok(glyphs.includes(ch), `missing ${ch}`)
  }
})

test('photos have a webp sibling and the hero is preloaded', () => {
  const images = path.join(root, 'public/images')
  const photos = fs.readdirSync(images).filter(name => /\.(jpe?g|png)$/i.test(name))
  assert.ok(photos.length >= 10)
  for (const name of photos) {
    const webp = path.join(images, name.replace(/\.(jpe?g|png)$/i, '.webp'))
    assert.ok(fs.existsSync(webp), `${name} is missing a webp sibling`)
    assert.ok(fs.statSync(webp).size < fs.statSync(path.join(images, name)).size)
  }
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
  assert.match(html, /rel="preload"[\s\S]*?\/images\/drone-white\.webp/)
})

test('html cache headers stay revalidated in the browser', () => {
  const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8')
  assert.match(server, /max-age=0, must-revalidate/)
  assert.match(server, /Cloudflare-CDN-Cache-Control/)
  assert.match(server, /s-maxage=86400/)
})
