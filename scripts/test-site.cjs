const test = require('node:test')
const assert = require('node:assert/strict')
const feeds = require('./generate-feeds')

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

test('design tag mapping prefers frontmatter category', () => {
  // Mirror src/utils/categoryLabel.js CATEGORY_DESIGN without Vue tooling.
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
