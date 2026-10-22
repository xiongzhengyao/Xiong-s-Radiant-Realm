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

const TAG_LABELS = {
  work: { zh: '工作思考', en: 'Work notes' },
  imaging: { zh: '影像', en: 'Imaging' },
  life: { zh: '生活', en: 'Life' },
  project: { zh: '项目', en: 'Project' }
}

export function getDesignTag(post, locale = 'zh') {
  const lang = locale === 'en' ? 'en' : 'zh'
  const tags = post?.tags || []
  const has = candidates => tags.some(tag => candidates.includes(tag))
  let id = 'work'
  if (has(['项目', 'Project'])) id = 'project'
  else if (has(['生活', 'Life', '生活碎片'])) id = 'life'
  else if (has(['影像', 'Imaging'])) id = 'imaging'
  else if (has(['工作思考', 'Work notes'])) id = 'work'
  else {
    const cat = String(post?.category || '').toLowerCase()
    if (cat === 'sensor' || cat === 'camera') id = 'imaging'
    else if (cat === 'life') id = 'life'
  }
  return { id, label: TAG_LABELS[id][lang] }
}
