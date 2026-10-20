import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/assets/styles/fonts.css'
import '@/assets/styles/apple-design.css'
import '@/assets/styles/print.css'
import i18n from './i18n'
import ErrorBoundary from './components/ErrorBoundary.vue'

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
  console.error('Global error handler:', err)
  console.error('Component instance:', instance)
  console.error('Error info:', info)
}

app.component('ErrorBoundary', ErrorBoundary)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
