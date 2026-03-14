# Xiong's Radiant Realm

个人技术博客 + 生活记录网站（Vue 3 + Vite + Express）。

---

## 文档导航（重构后）

- `README.md`：快速上手 + 常用命令（本文件）
- `DEVELOPMENT.md`：架构、代码目录、学习路径、开发规范
- `DEPLOYMENT.md`：服务器部署、自动部署、回滚、Nginx HTTPS

---

## 快速上手

### 环境要求

- Node.js >= 16
- npm >= 7

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

默认端口 `8888`（若占用会自动切换）。

### 构建与运行

```bash
# 构建
npm run build

# 预览构建结果
npm run serve

# 生产运行
npm start
```

---

## 常用命令

```bash
# 代码检查与格式化
npm run lint
npm run format
npm run format:check

# 远程部署
npm run deploy:remote

# 远程回滚
npm run rollback:remote
```

---

## 环境变量（服务端）

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=8888
```

健康检查：

```bash
curl http://localhost:8888/health
```

---

## License

MIT
