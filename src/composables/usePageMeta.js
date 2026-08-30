import { watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { APP_CONFIG } from '@/utils/constants'

const pageOverride = ref(null)

const setMeta = (name, content) => {
  if (!content || typeof document === 'undefined') return
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

const setProperty = (property, content) => {
  if (!content || typeof document === 'undefined') return
  let el = document.querySelector(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

const setLink = (rel, href, extra = {}) => {
  if (!href || typeof document === 'undefined') return
  const selector = extra.hreflang
    ? `link[rel="${rel}"][hreflang="${extra.hreflang}"]`
    : `link[rel="${rel}"]`
  let el = document.querySelector(selector)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    if (extra.hreflang) el.setAttribute('hreflang', extra.hreflang)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

const setHreflang = path => {
  const cleanPath = path.split('?')[0] || '/'
  const base = `${APP_CONFIG.SITE_URL}${cleanPath}`
  setLink('alternate', base, { hreflang: 'zh-CN' })
  setLink('alternate', `${base}?lang=en`, { hreflang: 'en' })
  setLink('alternate', base, { hreflang: 'x-default' })
}

const setJsonLd = data => {
  if (typeof document === 'undefined') return
  let el = document.getElementById('json-ld')
  if (!data) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('script')
    el.id = 'json-ld'
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

const setArticleMeta = (property, content) => {
  if (!content || typeof document === 'undefined') return
  let el = document.querySelector(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

const buildSiteJsonLd = t => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: APP_CONFIG.TITLE,
      url: APP_CONFIG.SITE_URL,
      description: APP_CONFIG.DESCRIPTION,
      inLanguage: ['zh-CN', 'en']
    },
    {
      '@type': 'Person',
      name: t('about.profile.name'),
      jobTitle: t('about.profile.title'),
      url: APP_CONFIG.SITE_URL,
      email: APP_CONFIG.EMAIL,
      sameAs: [
        'https://github.com/xiongzhengyao',
        'https://blog.csdn.net/qq_38741583'
      ]
    }
  ]
})

export function setPageMetaOverride(meta) {
  pageOverride.value = meta
}

export function clearPageMetaOverride() {
  pageOverride.value = null
}

export function usePageMeta() {
  const route = useRoute()
  const { t, locale } = useI18n()

  const apply = () => {
    const override = pageOverride.value
    const titleKey = route.meta?.titleKey
    const descKey = route.meta?.descKey

    let pageTitle = titleKey ? t(titleKey) : APP_CONFIG.TITLE
    let description = descKey ? t(descKey) : APP_CONFIG.DESCRIPTION

    if (override?.title) pageTitle = override.title
    if (override?.description) description = override.description

    document.title = pageTitle === APP_CONFIG.TITLE ? pageTitle : `${pageTitle} · ${APP_CONFIG.TITLE}`
    setMeta('description', description)
    setProperty('og:title', document.title)
    setProperty('og:description', description)
    setProperty('og:type', override?.type || 'website')
    const ogImage = override?.image || `${APP_CONFIG.SITE_URL}${APP_CONFIG.IMAGES.OG_DEFAULT}`
    setProperty('og:image', ogImage)
    setProperty('og:url', override?.canonical || `${APP_CONFIG.SITE_URL}${route.fullPath.split('?')[0]}`)
    if (override?.publishedTime) {
      setArticleMeta('article:published_time', override.publishedTime)
    } else {
      document.querySelector('meta[property="article:published_time"]')?.remove()
    }
    setMeta('twitter:card', override?.type === 'article' ? 'summary_large_image' : 'summary')
    setMeta('twitter:title', document.title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', ogImage)
    document.documentElement.lang = locale.value === 'zh' ? 'zh-CN' : 'en'

    const canonicalPath = override?.canonical
      ? override.canonical.replace(APP_CONFIG.SITE_URL, '')
      : route.path
    const canonical = override?.canonical || `${APP_CONFIG.SITE_URL}${canonicalPath}`
    setLink('canonical', canonical)
    setHreflang(route.path)
    setJsonLd(override?.jsonLd ?? buildSiteJsonLd(t))
  }

  watch([() => route.path, locale, pageOverride], apply, { immediate: true, deep: true })
}
