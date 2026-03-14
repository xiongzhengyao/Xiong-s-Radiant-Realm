# Xiong's Radiant Realm

个人技术博客 + 生活记录网站（Vue 3 + Vite + Express）。

---

## 文档导航

- `README.md`：项目入口（本文件）
- `DEVELOPMENT.md`：开发学习、架构说明、博客写作
- `DEPLOYMENT.md`：服务器部署、自动化、回滚、Nginx HTTPS

---

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 构建 + 预览
npm run build
npm run serve
```

默认开发端口 `8888`（冲突时自动切换）。

---

## 常用命令

```bash
# 代码质量
npm run lint
npm run format
npm run format:check

# 博客
npm run new:post -- "文章标题"

# 部署
npm run deploy:remote
npm run rollback:remote
```

---

## 博客来源（唯一）

- 文章目录：`src/assets/posts/*.md`
- 列表/详情由系统自动从 Markdown 提取
- 无需在 `Blog.vue` 手动二次录入

---

## License

MIT
