# Xiong's Radiant Realm

个人技术博客 + 生活记录网站，基于 Vue 3 + Vite 构建，支持中英文、明暗主题、Markdown 博客渲染与生产部署。

---

## 1) 项目总览

### 技术栈

- 前端：Vue 3、Vue Router、Pinia、Element Plus
- 工具链：Vite、ESLint、Prettier
- 内容渲染：markdown-it
- 生产服务：Node.js + Express（`server.js`）

### 当前核心能力

- Apple 风格 UI（极简、留白、毛玻璃、微动效）
- 博客列表/详情（Markdown 文件驱动）
- 生活页/关于页/联系页
- i18n 国际化（中英文）
- 主题切换（`html.dark`）
- 生产环境静态资源缓存优化（`index.html` 禁缓存，hash 资源长缓存）

---

## 2) 目录结构（学习入口）

```text
Xiong-s-Radiant-Realm/
├── src/
│   ├── assets/
│   │   ├── posts/                  # Markdown 文章资源
│   │   └── styles/apple-design.css # 全局设计系统
│   ├── components/
│   │   └── ErrorBoundary.vue       # 全局错误边界
│   ├── composables/
│   │   ├── useTheme.js             # 主题管理
│   │   └── useMarkdown.js          # Markdown 渲染封装
│   ├── i18n/                       # 国际化文案
│   ├── router/                     # 路由定义
│   ├── stores/                     # Pinia 状态管理
│   ├── utils/                      # 常量/请求封装
│   ├── views/                      # 页面视图
│   ├── App.vue                     # 全局布局（导航/页脚）
│   └── main.js                     # 应用入口
├── public/                         # 公共静态资源
├── dist/                           # 构建产物
├── server.js                       # 生产服务
├── vite.config.js                  # Vite 配置
├── package.json                    # 脚本 + 依赖
└── README.md                       # 项目主文档（本文件）
```

推荐阅读顺序：

1. `src/main.js`
2. `src/App.vue`
3. `src/router/index.js`
4. `src/views/*`
5. `src/composables/*`
6. `server.js`

---

## 3) 快速开始

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

默认端口 `8888`（若占用，Vite 会自动尝试下一个端口）。

### 构建与预览

```bash
npm run build
npm run serve
```

### 生产运行（Express）

```bash
npm run build
npm start
```

环境变量示例：

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

## 4) 工程脚本

```bash
# 开发
npm run dev

# 构建
npm run build

# 预览 dist
npm run serve

# 启动生产服务
npm start

# 代码质量
npm run lint
npm run format
npm run format:check
```

---

## 5) 架构与优化要点（原 ARCHITECTURE.md 合并）

### 构建层（Vite）

- 别名：`@ -> src`
- 代码分包：`vue-vendor`、`element-plus`、`markdown`
- 产物命名带 hash，利于缓存与回滚
- 压缩方式：`esbuild`

### 前端层

- 组合式封装：
  - `useTheme.js`：主题持久化 + 系统主题跟随
  - `useMarkdown.js`：Markdown 渲染统一入口
- 错误治理：
  - `ErrorBoundary.vue`
  - `main.js` 全局错误处理器

### 服务层（`server.js`）

- 静态资源服务 + SPA fallback
- 安全响应头
- 健康检查接口 `/health`
- 优雅退出与未捕获异常处理
- 缓存策略：
  - `index.html`：no-cache/no-store
  - hash 静态资源：`max-age=31536000, immutable`

---

## 6) 根目录 `.文件` 说明（你关心的）

### 保留（建议）

- `.gitignore`：Git 忽略规则（必须）
- `.eslintrc.cjs`：ESLint 规则（建议保留）
- `.prettierrc`：Prettier 格式化规则（建议保留）
- `.prettierignore`：Prettier 忽略规则（可选但推荐）

### 可选

- `.cursor/`：Cursor IDE 项目配置（仅在 Cursor 工作时有用）
  - 若你只在本地个人用，可以保留
  - 若你不想提交到仓库，建议加入 `.gitignore`

---

## 7) 可继续优化（下一步）

- 增加 TypeScript（提升类型安全）
- 增加单元测试和 E2E
- 增加 CI（自动 lint/build）
- 给博客页增加 SEO 元信息与 sitemap

---

## 8) License

MIT

---

## 9) 服务器快捷部署（一键）

目标：以后只执行一条命令完成发布。

### 第一次初始化（服务器上仅需一次）

```bash
# 1) 安装 Node（建议 18+）与 Git
# 2) 安装 PM2
npm i -g pm2

# 3) 拉取项目
git clone <your-repo-url> /var/www/Xiong-s-Radiant-Realm
cd /var/www/Xiong-s-Radiant-Realm

# 4) 首次启动（可选）
npm ci
npm run build
PORT=8888 NODE_ENV=production pm2 start ecosystem.config.cjs --update-env
pm2 save
```

### 本地配置（只需一次）

1. 复制部署配置模板：

```bash
cp .env.deploy.example .env.deploy
```

2. 编辑 `.env.deploy`：

```env
DEPLOY_HOST=你的服务器IP或域名
DEPLOY_USER=你的SSH用户名
DEPLOY_PORT=22
DEPLOY_PATH=/var/www/Xiong-s-Radiant-Realm
DEPLOY_BRANCH=main
DEPLOY_APP_NAME=xiong-radiant-realm
DEPLOY_APP_PORT=8888
```

### 每次发布（固定命令）

```bash
npm run deploy:remote
```

脚本会自动执行：

1. SSH 到服务器
2. `git pull` 最新代码
3. `npm ci`
4. `npm run build`
5. `pm2 startOrReload ecosystem.config.cjs`
6. 健康检查 `http://127.0.0.1:$PORT/health`

### 常用排查命令（服务器上）

```bash
pm2 status
pm2 logs xiong-radiant-realm --lines 100
curl http://127.0.0.1:8888/health
```

### 快速回滚（故障兜底）

默认回滚到上一个版本：

```bash
npm run rollback:remote
```

回滚到指定 commit/tag：

```bash
ROLLBACK_REF=<commit-or-tag> npm run rollback:remote
```

---

## 10) GitHub Actions 自动部署

已提供工作流：`.github/workflows/deploy.yml`  
触发条件：`push main` 或手动 `workflow_dispatch`

### 需要配置的 GitHub Secrets

- `DEPLOY_HOST`: 服务器地址
- `DEPLOY_USER`: SSH 用户
- `DEPLOY_PORT`: SSH 端口（如 22）
- `DEPLOY_SSH_KEY`: 私钥内容（与服务器公钥配对）
- `DEPLOY_PATH`: 服务器项目路径（如 `/var/www/Xiong-s-Radiant-Realm`）
- `DEPLOY_APP_NAME`: PM2 应用名（如 `xiong-radiant-realm`）
- `DEPLOY_APP_PORT`: 应用端口（如 `8888`）

工作流执行逻辑：

1. SSH 到服务器
2. `git pull --ff-only`
3. `npm ci && npm run build`
4. `pm2 startOrReload`
5. 健康检查 `/health`

---

## 11) Nginx + HTTPS（推荐上线）

已提供模板：`deploy/nginx/xiong-radiant-realm.conf`

### 最短部署步骤

```bash
# 1) 安装
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

# 2) 放置配置（修改 server_name 域名）
sudo cp deploy/nginx/xiong-radiant-realm.conf /etc/nginx/sites-available/xiong-radiant-realm.conf
sudo ln -sf /etc/nginx/sites-available/xiong-radiant-realm.conf /etc/nginx/sites-enabled/xiong-radiant-realm.conf
sudo nginx -t
sudo systemctl reload nginx

# 3) 签发 HTTPS 证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

证书自动续期检查：

```bash
sudo certbot renew --dry-run
```
