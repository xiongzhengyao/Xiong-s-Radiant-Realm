import { BLOG_CATEGORIES } from '@/utils/constants'

const labelMap = new Map(
  BLOG_CATEGORIES.map(item => [item.name.toLowerCase(), item.label])
)

export function getCategoryLabel(category, locale = 'zh') {
  const key = String(category || 'notes').toLowerCase()
  const zh = labelMap.get(key) || key
  if (locale === 'en') {
    const enMap = {
      embedded: 'Embedded',
      linux: 'Linux',
      sensor: 'Sensor',
      notes: 'Notes'
    }
    return enMap[key] || zh
  }
  return zh
}
