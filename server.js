const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()

// 配置
const PORT = process.env.PORT || 8888
const HOST = process.env.HOST || '0.0.0.0'
const NODE_ENV = process.env.NODE_ENV || 'development'
const DIST_DIR = path.join(__dirname, 'dist')
const INDEX_FILE = path.join(DIST_DIR, 'index.html')

// 日志工具函数
const logger = {
  info: (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
  error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`)
}

// 启动前检查
const checkDistDirectory = () => {
  try {
    if (!fs.existsSync(DIST_DIR)) {
      logger.warn(`Dist directory does not exist: ${DIST_DIR}`)
      logger.warn('Please run "npm run build" first')
      return false
    }

    if (!fs.existsSync(INDEX_FILE)) {
      logger.error(`Index file not found: ${INDEX_FILE}`)
      return false
    }

    logger.info(`Dist directory found: ${DIST_DIR}`)
    return true
  } catch (err) {
    logger.error(`Error checking dist directory: ${err.message}`)
    return false
  }
}

// 请求日志中间件
const requestLogger = (req, res, next) => {
  if (NODE_ENV === 'development') {
    logger.info(`${req.method} ${req.url} - ${req.ip}`)
  }
  next()
}

// 安全头设置
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  next()
})

// 静态文件服务
app.use(express.static(DIST_DIR, {
  maxAge: NODE_ENV === 'production' ? '1y' : '0',
  etag: true,
  lastModified: true
}))

// 请求日志
app.use(requestLogger)

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// SPA 路由处理 - 所有其他路由返回 index.html
app.get('*', (req, res) => {
  if (fs.existsSync(INDEX_FILE)) {
    res.sendFile(INDEX_FILE)
  } else {
    res.status(404).json({
      error: 'Application not built properly',
      message: 'Missing index.html. Please run "npm run build" first.'
    })
  }
})

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`
  })
})

// 全局错误处理
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`)
  logger.error(err.stack)

  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message,
    ...(NODE_ENV === 'development' && { stack: err.stack })
  })
})

// 启动服务器
const startServer = () => {
  // 开发环境不强制检查 dist 目录
  if (NODE_ENV === 'production' && !checkDistDirectory()) {
    logger.error('Server startup failed: dist directory check failed')
    process.exit(1)
  }

  app.listen(PORT, HOST, () => {
    logger.info(`Server running at http://${HOST}:${PORT}`)
    logger.info(`Environment: ${NODE_ENV}`)
    logger.info(`Node version: ${process.version}`)
  })
}

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully')
  process.exit(0)
})

// 未捕获的异常处理
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`)
  logger.error(err.stack)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`)
  process.exit(1)
})

// 启动服务器
startServer() 