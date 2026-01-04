import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import i18n from './i18n'
import ErrorBoundary from './components/ErrorBoundary.vue'

const app = createApp(App)

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error handler:', err)
  console.error('Component instance:', instance)
  console.error('Error info:', info)

  // 在生产环境中可以发送错误到日志服务
  if (import.meta.env.PROD) {
    // 可以在这里集成 Sentry 等错误追踪服务
    // Sentry.captureException(err, { extra: { info, instance } })
  }
}

// 注册全局组件
app.component('ErrorBoundary', ErrorBoundary)

app.use(createPinia())

// 按照正确的顺序安装插件
app.use(router) // 先安装路由
app.use(ElementPlus) // 然后是 UI 框架
app.use(i18n) // 最后是国际化

// 注册图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
