const PHOTO_KEYS = {
  '/images/drone-white.jpg': 'photos.droneWhite',
  '/images/drone-studio.jpg': 'photos.droneStudio',
  '/images/city.jpg': 'photos.city',
  '/images/desk.jpg': 'photos.desk',
  '/images/laptop.jpg': 'photos.laptop',
  '/images/plant.jpg': 'photos.plant',
  '/images/coffee.jpg': 'photos.coffee',
  '/images/cafe.jpg': 'photos.cafe',
  '/images/rain.jpg': 'photos.rain',
  '/images/cherry.jpg': 'photos.cherry',
  '/images/beach.jpg': 'photos.beach',
  '/images/sunset-sea.jpg': 'photos.sunsetSea',
  '/images/mountains.jpg': 'photos.mountains',
  '/images/book.jpg': 'photos.book',
  '/images/profile.jpg': 'photos.profile'
}

export function coverAlt(title) {
  return String(title ?? '').replace(/\s+/g, ' ').trim()
}

export function photoAltKey(src) {
  const path = String(src || '').split('?')[0]
  return PHOTO_KEYS[path] || ''
}

export function resolveCoverAlt(src, title, translate) {
  const key = photoAltKey(src)
  if (key && typeof translate === 'function') {
    const described = coverAlt(translate(key))
    if (described) return described
  }
  return coverAlt(title)
}

