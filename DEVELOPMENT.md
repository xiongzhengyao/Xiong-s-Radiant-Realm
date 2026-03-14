# Development Guide

本文档面向“看代码学习 + 持续开发”。

---

## 1. 技术栈

- 前端：Vue 3、Vue Router、Pinia、Element Plus
- 构建：Vite
- 文档渲染：markdown-it
- 服务端：Express（静态资源 + SPA fallback）

---

## 2. 目录结构

```text
Xiong-s-Radiant-Realm/
├── src/
│   ├── assets/
│   │   ├── posts/                  # Markdown 文章资源
│   │   └── styles/apple-design.css # 全局设计系统
│   ├── components/
│   │   └── ErrorBoundary.vue       # 错误边界
│   ├── composables/
│   │   ├── useTheme.js             # 主题切换/持久化
│   │   └── useMarkdown.js          # Markdown 渲染封装
│   ├── i18n/                       # 国际化
│   ├── router/                     # 路由
│   ├── stores/                     # Pinia
│   ├── utils/                      # 常量/工具
│   ├── views/                      # 页面
│   ├── App.vue                     # 全局壳（导航/页脚）
│   └── main.js                     # 应用入口
├── public/                         # 公共静态资源
├── server.js                       # 生产服务入口
└── vite.config.js                  # 构建配置
```

---

## 3. 推荐学习路径

1. `src/main.js`：应用初始化顺序、插件注册、全局错误处理
2. `src/App.vue`：全局布局、导航、主题/语言入口
3. `src/router/index.js`：路由结构与懒加载
4. `src/views/*`：页面级组织方式
5. `src/composables/*`：可复用逻辑封装方式
6. `server.js`：生产服务与缓存策略

---

## 4. 架构关键点

### 4.1 构建与资源

- `vite.config.js` 中配置了：
  - 别名 `@ -> src`
  - 分包（`vue-vendor` / `element-plus` / `markdown`）
  - hash 命名（便于缓存）
  - `esbuild` 压缩

### 4.2 UI 设计系统

- `src/assets/styles/apple-design.css` 统一了：
  - 颜色、间距、圆角、阴影、动效变量
  - `html.dark` 主题模式
  - 常用组件样式覆写

### 4.3 稳定性

- 前端：`ErrorBoundary.vue` + `main.js` 全局错误处理
- 服务端：未捕获异常处理、健康检查、优雅退出

---

## 5. 代码规范

- ESLint：`.eslintrc.cjs`
- Prettier：`.prettierrc`
- 忽略项：`.prettierignore`、`.gitignore`

常用命令：

```bash
npm run lint
npm run format
npm run format:check
```

---

## 6. 后续演进建议

- TypeScript 化（增强类型安全）
- 增加单元测试与 E2E 测试
- 增加 CI（PR 自动 lint/build）
- 增加 SEO（sitemap、meta 管理）

---

## 7. 博客写作工作流（只写 Markdown）

现在博客列表数据由 `src/stores/blogStore.js` 自动从 `src/assets/posts/*.md` 提取。
`public/posts` 已移除，不再作为博客来源。

### 7.1 最小可用写法（无 frontmatter）

```md
# 文章标题

正文内容...
```

系统会自动提取：

- 标题：第一个 `# ` 标题
- 摘要：正文前几段自动截取
- 作者：默认 `熊正耀`
- 分类：默认 `auto`（系统自动推断）
- 封面：自动生成占位图

### 7.2 推荐写法（带 frontmatter）

```md
---
title: I2C 与 I3C 实战经验总结
date: 2026-03-14
author: 熊正耀
category: auto
tags: [通信协议, 嵌入式, I2C, I3C]
keywords: [i2c, i3c, 调试, 总线]
image: https://your-cdn.example.com/cover/i2c-i3c.png
excerpt: 一文总结 I2C/I3C 的差异、选型建议与调试技巧。
---

# I2C 与 I3C 实战经验总结

正文内容...
```

### 7.3 一键生成文章模板

```bash
# 最简单
npm run new:post -- "我的新文章标题"

# 指定分类/标签/关键字/作者
npm run new:post -- "I2C 调试技巧" --category auto --tags I2C,调试,嵌入式 --keywords i2c,i3c,总线 --author 熊正耀
```

生成位置：`src/assets/posts/<slug>.md`
静态模板：`src/assets/posts/_template.md`（不会被博客列表加载）

### 7.4 简化分类（推荐）

- `auto`：默认，系统按标题/标签/关键字自动推断
- `embedded`：嵌入式/驱动/协议
- `linux`：Linux 系统与应用
- `sensor`：传感器/ISP/图像相关
- `notes`：学习笔记/资料整理/通用文章
