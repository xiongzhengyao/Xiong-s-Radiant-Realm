import { createI18n } from 'vue-i18n'
import en from './en.js'
import zh from './zh.js'

// 从 localStorage 读取保存的语言偏好
const getSavedLocale = () => {
  try {
    const saved = localStorage.getItem('locale')
    if (saved && (saved === 'zh' || saved === 'en')) {
      return saved
    }
  } catch (error) {
    console.warn('Failed to read locale from localStorage:', error)
  }
  return 'zh' // 默认中文
}

const i18n = createI18n({
  legacy: false,
  locale: getSavedLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
})

export default i18n
