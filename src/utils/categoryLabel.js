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

const TAG_LABELS = {
  work: { zh: '工作思考', en: 'Work notes' },
  imaging: { zh: '影像', en: 'Imaging' },
  life: { zh: '生活', en: 'Life' },
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
  else if (has(IMAGING_TAGS) || cat === 'camera') id = 'imaging'
  else if (has(['工作思考', 'Work notes'])) id = 'work'
  // sensor / linux / embedded / notes stay as work unless tagged above

  return { id, label: TAG_LABELS[id][lang] }
}
