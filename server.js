const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// 添加调试日志
console.log('Current directory:', __dirname);
try {
  if (fs.existsSync(path.join(__dirname, 'dist'))) {
    console.log('Dist directory contents:', fs.readdirSync(path.join(__dirname, 'dist')));
  } else {
    console.log('Warning: dist directory does not exist');
  }
} catch (err) {
  console.error('Error checking dist directory:', err);
}

// 静态文件服务
app.use(express.static(path.join(__dirname, 'dist')));

// 添加一个健康检查端点
app.get('/health', (req, res) => {
  res.send('OK');
});

// 记录所有请求
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 所有其他路由返回 index.html
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application not built properly. Missing index.html');
  }
});

const port = process.env.PORT || 8888;
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
  console.log('Environment:', process.env.NODE_ENV);
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Something broke!');
}); 