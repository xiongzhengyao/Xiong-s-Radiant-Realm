#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const POSTS_DIR = path.resolve(__dirname, '../src/assets/posts')
const AUTHOR_DEFAULT = '熊正耀'
const CATEGORY_DEFAULT = 'auto'
const CATEGORY_CHOICES = ['auto', 'embedded', 'linux', 'sensor', 'notes']

const pad = value => String(value).padStart(2, '0')
const today = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const kebabCase = input =>
  input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

const toAsciiSlug = input =>
  input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

const getArgValue = (flag, fallback = '') => {
  const idx = process.argv.findIndex(arg => arg === flag)
  if (idx === -1) return fallback
  const value = process.argv[idx + 1]
  if (!value || value.startsWith('--')) return fallback
  return value
}

const rawTitle = process.argv.slice(2).filter(arg => !arg.startsWith('--'))[0] || ''
if (!rawTitle) {
  console.error(
    '用法: npm run new:post -- "文章标题" [--category 分类] [--tags 标签1,标签2] [--keywords 关键字1,关键字2]'
  )
  process.exit(1)
}

const inputCategory = getArgValue('--category', CATEGORY_DEFAULT)
const category = CATEGORY_CHOICES.includes(inputCategory.toLowerCase())
  ? inputCategory.toLowerCase()
  : CATEGORY_DEFAULT
const tags = getArgValue('--tags', '').split(',').map(tag => tag.trim()).filter(Boolean)
const keywords = getArgValue('--keywords', '').split(',').map(item => item.trim()).filter(Boolean)
const author = getArgValue('--author', AUTHOR_DEFAULT)

const date = today()
const humanSlug = kebabCase(rawTitle)
const asciiSlug = toAsciiSlug(rawTitle)
const slug = asciiSlug || humanSlug || `post-${Date.now()}`
const fileName = `${slug}.md`
const filePath = path.join(POSTS_DIR, fileName)

if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR, { recursive: true })
}

if (fs.existsSync(filePath)) {
  console.error(`文件已存在: ${filePath}`)
  process.exit(1)
}

const tagsInline = tags.length ? tags.join(', ') : '技术, 随笔'
const keywordsInline = keywords.length ? keywords.join(', ') : '关键字1, 关键字2'
const image = `https://picsum.photos/seed/${slug}/800/420`

const template = `---
title: ${rawTitle}
date: ${date}
author: ${author}
category: ${category}
tags: [${tagsInline}]
keywords: [${keywordsInline}]
image: ${image}
excerpt: 请在这里填写文章摘要（建议 40-80 字）。
---

# ${rawTitle}

## 背景

请描述本文背景与目标。

## 正文

在这里开始写正文内容。

## 总结

总结关键结论与下一步计划。
`

fs.writeFileSync(filePath, template, 'utf8')
console.log(`已创建: ${filePath}`)
console.log(`可选分类: ${CATEGORY_CHOICES.join(', ')}`)
