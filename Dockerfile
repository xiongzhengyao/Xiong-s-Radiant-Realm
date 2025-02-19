# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app

# 1. 首先只复制 package 文件，利用 Docker 缓存
COPY package*.json ./
RUN npm install  # 改用 npm install 替代 npm ci

# 2. 复制源代码并构建
COPY . .
RUN npm run build

# 生产阶段 - 使用更轻量的基础镜像
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# 3. 只复制构建产物和必要文件
COPY --from=builder /app/dist .
COPY --from=builder /app/server.js /app/
COPY --from=builder /app/package.json /app/
COPY --from=builder /app/node_modules /app/node_modules

# 4. 配置 nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8888

# 5. 使用 nginx 来服务静态文件
CMD ["nginx", "-g", "daemon off;"] 