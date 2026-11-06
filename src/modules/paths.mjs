/** URL scheme shared by the app, command palette, and sitemap. */

function blogPostPath(post) {
  return `/blog/${post.id}/${encodeURIComponent(post.slug)}`
}

function projectPath(id) {
  return `/projects/${id}`
}

function lifePath(id) {
  return `/life/${id}`
}

export {
  blogPostPath,
  projectPath,
  lifePath
}
