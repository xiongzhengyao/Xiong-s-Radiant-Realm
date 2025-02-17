import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import i18n from './i18n'

const app = createApp(App)
app.use(createPinia())

// 按照正确的顺序安装插件
app.use(router)  // 先安装路由
app.use(ElementPlus)  // 然后是 UI 框架
app.use(i18n)  // 最后是国际化

// 注册图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
