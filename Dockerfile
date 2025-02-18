# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# 添加调试信息
RUN ls -la /app
RUN ls -la /app/dist || echo "dist directory not created"

# 生产阶段
FROM node:18-alpine
WORKDIR /app
# 复制构建后的文件
COPY --from=builder /app/dist ./dist
# 复制服务器文件和依赖
COPY --from=builder /app/server.js ./
COPY --from=builder /app/package*.json ./
RUN npm install --production

# 添加调试信息
RUN ls -la /app
RUN ls -la /app/dist || echo "dist directory not copied"

EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["npm", "start"] 