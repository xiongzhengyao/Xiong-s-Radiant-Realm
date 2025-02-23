# Xiong's Radiant Realm

欢迎来到 Xiong's Radiant Realm，这是一个个人动态分享与技术博客，旨在展示我的技术能力、项目经验以及个人生活点滴。

## 项目结构

- **src/**: 源代码目录，包含 Vue 组件和相关逻辑
- **public/**: 静态资源目录，包含图片和其他静态文件
- **Dockerfile**: Docker 镜像构建文件
- **docker-compose.yml**: Docker Compose 配置文件
- **.env**: 环境变量配置文件
- **nginx.conf**: Nginx 配置文件
- **package.json**: 项目依赖和脚本配置
- **README.md**: 项目说明文档

## 技术栈

- **前端**: Vue 3, Vite, Element Plus
- **后端**: Node.js, Express
- **数据库**: 无（使用静态数据）
- **容器化**: Docker

## 部署

### 使用 Docker 部署

1. **克隆项目**

   ```bash
   git clone https://github.com/yourusername/personal-feed.git
   cd personal-feed
   ```

2. **构建 Docker 镜像**

   ```bash
   docker-compose build
   ```

3. **启动服务**

   ```bash
   docker-compose up
   ```

4. **访问应用**

   打开浏览器，访问 `http://localhost:8888`。

### 本地开发

1. **安装依赖**

   ```bash
   npm install
   ```

2. **启动开发服务器**

   ```bash
   npm run dev
   ```

3. **访问应用**

   打开浏览器，访问 `http://localhost:8888`。

## 配置

### 环境变量

在项目根目录下创建一个 `.env` 文件，配置以下环境变量：

```env
NODE_ENV=production
PORT=3000
```

### Nginx 配置

Nginx 配置文件 `nginx.conf` 用于配置静态文件服务和健康检查。确保在 Docker 部署时，Nginx 能够正确指向构建后的文件。

### 健康检查

应用提供了健康检查接口，访问 `http://localhost:8888/health` 可以检查服务是否正常运行。

## 贡献

欢迎任何形式的贡献！如果你有建议或问题，请随时提出。

## 许可证

本项目采用 MIT 许可证，详情请查看 [LICENSE](LICENSE) 文件。
