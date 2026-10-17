/** Max grapheme-ish length for TOC entries (CJK-friendly: count code points). */
const TOC_MAX_H2 = 64
const TOC_MAX_H3 = 28

/**
 * Spec / data-row headings pollute navigation (resolutions, bitrates, sums of numbers).
 * Keep TOC to short section titles only.
 */
function isTocWorthy(text, level) {
  const t = String(text || '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!t) return false

  const len = [...t].length
  const maxLen = level === 2 ? TOC_MAX_H2 : TOC_MAX_H3
  if (len > maxLen) return false

  // Dimension / resolution rows: "5760 × 3240", "4096 x 2304"
  if (/\d+\s*[×xX]\s*\d+/.test(t)) return false
  // Bitrate / fps / bit-depth dumps in the title itself
  if (/\d+\s*(bit|bits|fps)\b/i.test(t) && len > 16) return false
  if (/\d+(\.\d+)?\s*(GB\/s|MB\/s|Kbps|Mbps|Gbps)/i.test(t)) return false

  return true
}

/** Extract h2/h3 headings from rendered HTML for table of contents */
export function extractHeadings(html) {
  if (!html || typeof document === 'undefined') return []

  const container = document.createElement('div')
  container.innerHTML = html
  const headings = container.querySelectorAll('h2, h3')

  return Array.from(headings)
    .map((el, index) => {
      const id = el.id || `heading-${index}`
      const text = el.textContent?.trim() || ''
      const level = el.tagName === 'H2' ? 2 : 3
      return { id, text, level }
    })
    .filter(item => isTocWorthy(item.text, item.level))
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
