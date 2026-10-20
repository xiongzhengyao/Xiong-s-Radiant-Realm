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

// 边缘可缓存的 SPA HTML（浏览器不长期缓存，CF 可短时缓存）
// 发布后需 purge CF 上的 `/`（见 DEPLOYMENT.md）
const HTML_CACHE_CONTROL =
  'public, max-age=0, s-maxage=120, stale-while-revalidate=60'
const FEED_CACHE_CONTROL =
  'public, max-age=0, s-maxage=300, stale-while-revalidate=60'
const FEED_BASENAMES = new Set(['manifest.json', 'rss.xml', 'sitemap.xml'])

const setHtmlCacheHeaders = (res) => {
  if (NODE_ENV === 'production') {
    res.setHeader('Cache-Control', HTML_CACHE_CONTROL)
  } else {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
  }
}

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
// 缓存策略：
// 1) 带 hash 的 /assets/* 长期 immutable
// 2) index.html / SPA HTML：edge 短缓存（s-maxage），浏览器 max-age=0
// 3) manifest / rss / sitemap：edge 短缓存
app.use(
  express.static(DIST_DIR, {
    maxAge: NODE_ENV === 'production' ? '1y' : 0,
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      const isHtml = path.extname(filePath) === '.html'
      if (isHtml) {
        setHtmlCacheHeaders(res)
        return
      }

      const base = path.basename(filePath)
      if (FEED_BASENAMES.has(base)) {
        if (NODE_ENV === 'production') {
          res.setHeader('Cache-Control', FEED_CACHE_CONTROL)
        }
        return
      }

      if (NODE_ENV === 'production') {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      }
    }
  })
)

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

// 静态资源扩展名：express.static 未命中时返回真实 404，绝不回退到 index.html
const STATIC_ASSET_EXT =
  /\.(js|css|map|ico|png|svg|woff2?|jpe?g|webp|gif|txt|xml|json)$/i

// Vite / 源码路径：生产环境不应命中，避免被 SPA 吞成 200 HTML
const DEV_ONLY_PREFIXES = ['/@vite/', '/src/', '/node_modules/']

const sendNotFound = (req, res) => {
  res.status(404).type('application/json').json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`
  })
}

// 在 SPA fallback 之前：开发路径与缺失静态资源一律 404（非 HTML）
app.get('*', (req, res, next) => {
  const requestPath = req.path

  if (DEV_ONLY_PREFIXES.some((prefix) => requestPath.startsWith(prefix))) {
    return sendNotFound(req, res)
  }

  // 带静态扩展名的请求若落到此处，说明 dist 中无对应文件
  if (STATIC_ASSET_EXT.test(requestPath)) {
    return sendNotFound(req, res)
  }

  return next()
})

// SPA 路由处理 - 无扩展名的客户端路由返回 index.html
app.get('*', (req, res) => {
  if (fs.existsSync(INDEX_FILE)) {
    setHtmlCacheHeaders(res)
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
