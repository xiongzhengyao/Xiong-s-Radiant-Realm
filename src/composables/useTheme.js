import { ref, watch } from 'vue'

const isDark = ref(false)

export function useTheme() {
  // 从 localStorage 读取主题设置
  const loadTheme = () => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved) {
        isDark.value = saved === 'dark'
      } else {
        // 检测系统主题
        if (typeof window !== 'undefined') {
          isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
        }
      }
      applyTheme()
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error)
    }
  }

  // 应用主题
  const applyTheme = () => {
    if (typeof document === 'undefined') return

    if (isDark.value) {
      document.documentElement.classList.add('dark')
      try {
        localStorage.setItem('theme', 'dark')
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error)
      }
    } else {
      document.documentElement.classList.remove('dark')
      try {
        localStorage.setItem('theme', 'light')
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error)
      }
    }
  }

  // 切换主题
  const toggleTheme = value => {
    isDark.value = value
    applyTheme()
  }

  // 监听系统主题变化
  const watchSystemTheme = () => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = e => {
      if (!localStorage.getItem('theme')) {
        isDark.value = e.matches
        applyTheme()
      }
    }
    mediaQuery.addEventListener('change', handleChange)

    // 返回清理函数
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }

  // 初始化主题
  if (typeof window !== 'undefined') {
    loadTheme()
    watchSystemTheme()
  }

  watch(isDark, applyTheme)

  return {
    isDark,
    toggleTheme
  }
}
