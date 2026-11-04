import { BLOG_CATEGORIES } from '@/utils/constants'

const labelMap = new Map(
  BLOG_CATEGORIES.map(item => [item.name.toLowerCase(), item.label])
)

const EN_CATEGORY = {
  embedded: 'Embedded',
  linux: 'Linux',
  sensor: 'Sensor',
  camera: 'Camera',
  notes: 'Notes'
}

export function getCategoryLabel(category, locale = 'zh') {
  const key = String(category || 'notes').toLowerCase()
  const zh = labelMap.get(key) || key
  if (locale === 'en') return EN_CATEGORY[key] || zh
  return zh
}

/** Prefer frontmatter category so list chips match the note taxonomy. */
const CATEGORY_DESIGN = {
  camera: 'imaging',
  sensor: 'sensor',
  linux: 'linux',
  embedded: 'embedded',
  notes: 'notes',
  life: 'life'
}

const TAG_LABELS = {
  imaging: { zh: '影像', en: 'Imaging' },
  sensor: { zh: 'Sensor', en: 'Sensor' },
  linux: { zh: 'Linux', en: 'Linux' },
  embedded: { zh: '嵌入式', en: 'Embedded' },
  notes: { zh: '笔记', en: 'Notes' },
  life: { zh: '生活', en: 'Life' },
  work: { zh: '工作思考', en: 'Work notes' },
  project: { zh: '项目', en: 'Project' }
}

const IMAGING_TAGS = [
  '影像',
  'Imaging',
  'Camera',
  '图像传感器',
  'CMOS',
  'CCD',
  'ISP'
]

export function getDesignTag(post, locale = 'zh') {
  const lang = locale === 'en' ? 'en' : 'zh'
  const tags = post?.tags || []
  const has = candidates => tags.some(tag => candidates.includes(tag))
  const cat = String(post?.category || '').toLowerCase()

  let id = 'work'
  if (has(['项目', 'Project'])) id = 'project'
  else if (has(['生活', 'Life', '生活碎片']) || cat === 'life') id = 'life'
  else if (CATEGORY_DESIGN[cat]) id = CATEGORY_DESIGN[cat]
  else if (has(IMAGING_TAGS)) id = 'imaging'
  else if (has(['工作思考', 'Work notes'])) id = 'work'

  return { id, label: TAG_LABELS[id]?.[lang] || getCategoryLabel(cat, locale) }
}
