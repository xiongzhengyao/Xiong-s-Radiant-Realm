import { APP_CONFIG } from '@/utils/constants'

/**
 * Optional privacy-friendly analytics.
 * Set APP_CONFIG.ANALYTICS_SRC (script URL) and APP_CONFIG.ANALYTICS_ID if you enable a provider.
 * Nothing loads when ANALYTICS_SRC is empty.
 */
export function useAnalytics() {
  const install = () => {
    if (typeof document === 'undefined') return
    const src = APP_CONFIG.ANALYTICS_SRC
    if (!src) return
    if (document.querySelector(`script[data-snowhush-analytics="1"]`)) return

    const script = document.createElement('script')
    script.defer = true
    script.src = src
    script.dataset.snowhushAnalytics = '1'
    if (APP_CONFIG.ANALYTICS_ID) {
      script.dataset.domain = APP_CONFIG.ANALYTICS_ID
    }
    document.head.appendChild(script)
  }

  return { install }
}
