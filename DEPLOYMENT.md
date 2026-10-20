# Deployment Guide

本文档面向“上线部署 + 自动化 + 回滚”。

---

## 1. 部署方式概览

本项目支持两种发布方式：

1. 本地一键发布：`npm run deploy:remote`
2. GitHub Actions 自动发布：push 到 `main` 自动部署

---

## 2. 服务器首次初始化（只做一次）

```bash
# 1) 安装基础环境
sudo apt update
sudo apt install -y git curl

# 2) 安装 Node.js（建议 18+）
# 方式不限，建议 nvm 或 NodeSource

# 3) 安装 PM2
npm i -g pm2

# 4) 拉取项目
git clone <your-repo-url> /path/to/Xiong-s-Radiant-Realm
cd /path/to/Xiong-s-Radiant-Realm

# 5) 首次构建并启动
npm ci
npm run build
PORT=8888 NODE_ENV=production pm2 start ecosystem.config.cjs --update-env
pm2 save
```

---

## 3. 本地一键部署

### 3.1 准备配置

```bash
cp .env.deploy.example .env.deploy
```

编辑 `.env.deploy`：

```env
DEPLOY_HOST=your.server.ip
DEPLOY_USER=root
DEPLOY_PORT=22
DEPLOY_PATH=/path/to/Xiong-s-Radiant-Realm
DEPLOY_BRANCH=main
DEPLOY_APP_NAME=xiong-radiant-realm
DEPLOY_APP_PORT=8888
```

### 3.2 执行发布

```bash
npm run deploy:remote
```

脚本会自动执行：

1. SSH 登录服务器
2. `git pull --ff-only`
3. `npm ci`
4. `npm run build`
5. `pm2 startOrReload ecosystem.config.cjs`
6. 健康检查：`/health`

---

## 4. 故障快速回滚

### 回滚到上一版本

```bash
npm run rollback:remote
```

### 回滚到指定 commit/tag

```bash
ROLLBACK_REF=<commit-or-tag> npm run rollback:remote
```

---

## 5. GitHub Actions 自动部署

工作流文件：`.github/workflows/deploy.yml`

触发：

- push 到 `main`
- 手动触发 `workflow_dispatch`

### 需要配置的 Secrets

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_PORT`
- `DEPLOY_SSH_KEY`
- `DEPLOY_PATH`
- `DEPLOY_APP_NAME`
- `DEPLOY_APP_PORT`

---

## 6. Nginx + HTTPS（推荐生产）

模板文件：`deploy/nginx/xiong-radiant-realm.conf`

### 最短步骤

```bash
# 安装
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

# 放置配置（先修改 server_name）
sudo cp deploy/nginx/xiong-radiant-realm.conf /etc/nginx/sites-available/xiong-radiant-realm.conf
sudo ln -sf /etc/nginx/sites-available/xiong-radiant-realm.conf /etc/nginx/sites-enabled/xiong-radiant-realm.conf
sudo nginx -t
sudo systemctl reload nginx

# 申请证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

证书续期自检：

```bash
sudo certbot renew --dry-run
```

---

## 7. 运维排查命令

```bash
pm2 status
pm2 logs xiong-radiant-realm --lines 100
curl http://127.0.0.1:8888/health
```

---

## 8. Cloudflare 缓存与发布后 purge

生产经 Cloudflare Tunnel 对外时，Express 对 HTML / SPA 响应使用边缘短缓存：

- `index.html` / SPA：`Cache-Control: public, max-age=0, s-maxage=120, stale-while-revalidate=60`
- `manifest.json` / `rss.xml` / `sitemap.xml`：`s-maxage=300`（浏览器仍 `max-age=0`）
- `/assets/*`（带 hash）：`public, max-age=31536000, immutable`

**每次发布新前端后**，应 purge Cloudflare 上的 HTML（至少 `/`），否则边缘可能在最多约 2 分钟内继续返回旧 `index.html`（可能指向已不存在的旧 hash 资源）。

### Dashboard

Caching → Configuration → Purge Cache → Custom Purge，填入例如：

- `https://snowhush.com/`
- `https://snowhush.com/manifest.json`（若本次改了 PWA manifest）

或使用 Purge Everything（影响面更大）。

### API（勿把 Token 写入仓库）

在本机或 CI secret 中准备 `CF_ZONE_ID` 与 `CF_API_TOKEN`（Cache Purge 权限），然后：

```bash
curl -sS -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://snowhush.com/","https://snowhush.com/index.html"]}'
```

可选后续：迁到 Cloudflare Pages 由平台管 HTML 缓存与原子发布；本仓库当前仍走 Mac + Express + Tunnel，拓扑不变。
