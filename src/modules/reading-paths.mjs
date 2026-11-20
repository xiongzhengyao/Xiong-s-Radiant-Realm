/**
 * Curated note sequences. Chronological prev/next jumps topics;
 * a path keeps a reader inside one subject, in the order you'd learn it.
 */

export const readingPaths = [
  {
    id: 'camera-to-first-frame',
    titleKey: 'blog.paths.cameraToFirstFrame.title',
    ledeKey: 'blog.paths.cameraToFirstFrame.lede',
    slugs: [
      'image-sensors',
      'i2c-i3c-protocols',
      '计算',
      'qualcomm-dual-cam-camnoc-bandwidth',
      'camera-stream-on-bringup-checklist',
      'camera-first-frame-cold-start'
    ]
  }
]

export function locateInPath(slug, paths = readingPaths) {
  if (!slug) return null
  for (const path of paths) {
    const index = path.slugs.indexOf(slug)
    if (index === -1) continue
    return {
      path,
      index,
      total: path.slugs.length,
      prevSlug: index > 0 ? path.slugs[index - 1] : null,
      nextSlug: index < path.slugs.length - 1 ? path.slugs[index + 1] : null
    }
  }
  return null
}

export function stepsForPath(path, postsBySlug) {
  if (!path) return []
  const lookup = postsBySlug || new Map()
  return path.slugs
    .map((slug, index) => ({
      slug,
      index,
      post: lookup.get(slug) || null
    }))
    .filter(step => step.post)
}
