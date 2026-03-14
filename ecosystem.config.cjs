module.exports = {
  apps: [
    {
      name: process.env.PM2_APP_NAME || 'xiong-radiant-realm',
      script: 'server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        HOST: process.env.HOST || '0.0.0.0',
        PORT: process.env.PORT || '8888'
      }
    }
  ]
}
