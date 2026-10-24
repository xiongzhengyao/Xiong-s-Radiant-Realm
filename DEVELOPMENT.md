# Development Guide

本文档面向「看代码学习 + 持续开发」。

---

## 1. 技术栈

- 前端：Vue 3、Vue Router、Pinia、Vue I18n
- UI 反馈：Element Plus Message（按需引入）
- 构建：Vite
- 文档渲染：markdown-it
- 服务端：Express（静态资源 + SPA fallback）

---

## 2. 目录结构

```text
Xiong-s-Radiant-Realm/
├── src/
│   ├── assets/
│   │   ├── posts/                  # Markdown 文章（构建时懒加载）
│   │   └── styles/apple-design.css # 全局设计系统
│   ├── components/                 # 通用组件
│   ├── composables/                # 可复用逻辑
│   ├── data/career.js              # 项目/职业结构化数据
│   ├── i18n/                       # 中英文文案
│   ├── stores/blogStore.js         # 博客数据（懒加载）
│   ├── views/                      # 页面
│   ├── App.vue
│   └── main.js
├── public/                         # 公共静态资源
├── scripts/generate-feeds.js       # 构建时 RSS + sitemap
├── server.js
└── vite.config.js
```

---

## 3. 缺失静态资源（待补充）

以下文件被站点引用但**尚未放入仓库**，部署前请自行补充：

| 路径 | 用途 | 影响 |
|------|------|------|
| `public/favicon.ico` | 浏览器标签页图标 | 标签页无图标 |
| `public/images/profile.jpg` | 关于页头像 | 降级显示「ZY」占位 |
| `public/resume.pdf` | （可选）PDF 简历 | 当前「下载简历」触发打印对话框，不依赖此文件 |

已有资源：`public/og-default.png`（分享图，由 `og-default.svg` 导出）、`public/images/hero-workspace.svg`（后者当前未使用）。

---

## 4. 博客写作工作流

博客数据来自 `src/assets/posts/*.md`，**必须包含 `date` frontmatter**，否则不会出现在列表中。

### 推荐 frontmatter

```md
---
title: 文章标题
date: 2026-03-14
author: 熊正耀
category: auto
tags: [嵌入式, I2C]
keywords: [i2c, 驱动]
excerpt: 40–80 字摘要，用于列表与 SEO。
---
```

### 一键生成模板

```bash
npm run new:post -- "我的新文章标题"
```

---

## 5. 联系表单

联系页表单当前为**开发中状态**，页面已提示用户直接发邮件。接入后端前请勿恢复假提交逻辑。

---

## 6. 常用命令

```bash
npm run dev          # 本地开发
npm run build        # 构建（含 RSS/sitemap）
npm run start        # 生产服务
npm run lint         # ESLint
npm run format       # Prettier
```

---

## 7. SEO

- 运行时：`src/composables/usePageMeta.js` 管理 title、OG、hreflang、JSON-LD
- 静态兜底：`index.html` 含完整 OG 与 Person/WebSite 结构化数据
- 构建产物：`public/rss.xml`、`public/sitemap.xml`

---

## 8. 后续演进建议

- 补充缺失静态资源（见第 3 节）
- 联系表单接入真实后端
- 单元测试 + CI（lint/build）
- 文章量增大后可考虑分页
