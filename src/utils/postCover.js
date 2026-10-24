import { hashSeed } from '@/utils/coverArt'

/** Explicit covers so the notes grid never stacks the same photo. */
const NOTE_COVERS = {
  'qualcomm-dual-cam-camnoc-bandwidth': '/images/drone-white.jpg',
  '计算': '/images/coffee.jpg',
  'linux-system-programming': '/images/laptop.jpg',
  'i2c-i3c-protocols': '/images/desk.jpg',
  'image-sensors': '/images/plant.jpg',
  'environmental-sensors': '/images/rain.jpg',
  'inertial-sensors': '/images/cherry.jpg',
  'learning-resources': '/images/cafe.jpg'
}

const COVER_POOL = [
  '/images/drone-studio.jpg',
  '/images/drone-white.jpg',
  '/images/laptop.jpg',
  '/images/desk.jpg',
  '/images/plant.jpg',
  '/images/cafe.jpg',
  '/images/coffee.jpg',
  '/images/rain.jpg',
  '/images/cherry.jpg',
  '/images/beach.jpg',
  '/images/sunset-sea.jpg',
  '/images/mountains.jpg'
]

const CATEGORY_COVER = {
  linux: '/images/laptop.jpg',
  camera: '/images/drone-white.jpg',
  sensor: '/images/plant.jpg',
  embedded: '/images/desk.jpg',
  life: '/images/beach.jpg',
  notes: '/images/cafe.jpg'
}

/**
 * Resolve a cover image for a blog / notes post.
 * Prefer frontmatter image, then per-slug map, then category, then a stable pool pick.
 */
export function getPostCover(post) {
  if (!post) return COVER_POOL[0]
  if (post.image) return post.image

  const slug = String(post.slug || '')
  if (slug && NOTE_COVERS[slug]) return NOTE_COVERS[slug]

  const cat = String(post.category || '').toLowerCase()
  if (CATEGORY_COVER[cat]) return CATEGORY_COVER[cat]

  const key = slug || String(post.id || post.title || 'note')
  return COVER_POOL[hashSeed(key) % COVER_POOL.length]
}
