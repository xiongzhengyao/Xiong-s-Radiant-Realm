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
