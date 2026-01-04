# Xiong's Radiant Realm

欢迎来到 Xiong's Radiant Realm，这是一个个人动态分享与技术博客，旨在展示我的技术能力、项目经验以及个人生活点滴。

## 项目结构

- **src/**: 源代码目录，包含 Vue 组件和相关逻辑
- **public/**: 静态资源目录，包含图片和其他静态文件
- **server.js**: Express 服务器，用于生产环境部署
- **package.json**: 项目依赖和脚本配置
- **README.md**: 项目说明文档

## 技术栈

- **前端**: Vue 3, Vite, Element Plus
- **后端**: Node.js, Express
- **数据库**: 无（使用静态数据）

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

启动开发服务器（支持热重载）：

```bash
npm run dev
```

访问 `http://localhost:8888` 查看应用。

### 生产部署

1. **构建生产版本**

   ```bash
   npm run build
   ```

   构建产物将输出到 `dist/` 目录。

2. **启动生产服务器**

   ```bash
   npm start
   ```

   服务器将在 `http://localhost:8888` 启动。

3. **使用环境变量配置端口**

   可以通过环境变量自定义端口：

   ```bash
   PORT=3000 npm start
   ```

   或者创建 `.env` 文件：

   ```env
   PORT=3000
   NODE_ENV=production
   ```

### 预览构建结果

在构建后，可以使用 Vite 预览功能查看构建结果：

```bash
npm run build
npm run serve
```

## 其他命令

### 代码检查

```bash
# 运行 ESLint 检查并自动修复
npm run lint

# 格式化代码
npm run format

# 检查代码格式
npm run format:check
```

## 配置

### 环境变量

在项目根目录下创建 `.env` 文件（可选），配置以下环境变量：

```env
NODE_ENV=production
PORT=8888
HOST=0.0.0.0
```

### 健康检查

应用提供了健康检查接口，访问 `http://localhost:8888/health` 可以检查服务是否正常运行。

### 使用 PM2 部署（推荐生产环境）

如果需要更稳定的生产环境部署，可以使用 PM2：

```bash
# 安装 PM2
npm install -g pm2

# 构建项目
npm run build

# 使用 PM2 启动
pm2 start server.js --name "xiong-radiant-realm"

# 查看状态
pm2 status

# 查看日志
pm2 logs xiong-radiant-realm

# 停止服务
pm2 stop xiong-radiant-realm

# 重启服务
pm2 restart xiong-radiant-realm
```

## 贡献

欢迎任何形式的贡献！如果你有建议或问题，请随时提出。

## 许可证

本项目采用 MIT 许可证，详情请查看 [LICENSE](LICENSE) 文件。
