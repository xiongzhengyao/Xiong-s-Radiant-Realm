/** Extract h2/h3 headings from rendered HTML for table of contents */
export function extractHeadings(html) {
  if (!html || typeof document === 'undefined') return []

  const container = document.createElement('div')
  container.innerHTML = html
  const headings = container.querySelectorAll('h2, h3')

  return Array.from(headings).map((el, index) => {
    const id = el.id || `heading-${index}`
    return {
      id,
      text: el.textContent?.trim() || '',
      level: el.tagName === 'H2' ? 2 : 3
    }
  })
}

/** Inject id attributes into heading elements in HTML string */
export function injectHeadingIds(html) {
  if (!html) return html
  let h2Count = 0
  let h3Count = 0
  return html.replace(/<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, text) => {
    if (/\bid=/.test(attrs)) return match
    const id = tag.toLowerCase() === 'h2' ? `section-${++h2Count}` : `subsection-${++h3Count}`
    return `<${tag}${attrs} id="${id}">${text}</${tag}>`
  })
}
