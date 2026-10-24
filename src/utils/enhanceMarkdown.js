/** Wrap code blocks with copy-button container */
export function enhanceCodeBlocks(html, labels = {}) {
  if (!html) return html
  const copy = labels.copy || 'Copy'
  const aria = labels.copyAria || labels.copy || 'Copy code'
  return html.replace(/<pre>([\s\S]*?)<\/pre>/g, (_match, inner) => {
    return `<div class="code-block-wrap"><button type="button" class="code-copy-btn" aria-label="${escapeAttr(aria)}">${escapeHtml(copy)}</button><pre>${inner}</pre></div>`
  })
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, '&#39;')
}

/** Wrap tables so wide content scrolls instead of breaking layout */
export function enhanceTables(html) {
  if (!html) return html
  return html.replace(/<table[\s\S]*?<\/table>/g, match => {
    if (match.includes('table-scroll')) return match
    return `<div class="table-scroll">${match}</div>`
  })
}

/**
 * Drop a leading H1 that duplicates the article hero title.
 * MD files stay the source of truth; this is presentation-only.
 */
export function stripDuplicateTitleHeading(html, title) {
  if (!html || !title) return html
  const match = html.match(/^\s*<h1[^>]*>([\s\S]*?)<\/h1>\s*/i)
  if (!match) return html
  const headingText = match[1].replace(/<[^>]+>/g, '').trim()
  const normalize = s => s.replace(/\s+/g, ' ').trim().toLowerCase()
  if (normalize(headingText) !== normalize(title)) return html
  return html.slice(match[0].length)
}

const NUMERIC_CELL =
  /^[~≈±]?\s*[\d.,]+\s*(%|x|×|Mbps|Gbps|Kbps|MB\/s|GB\/s|KB\/s|MB|GB|KB|Hz|kHz|MHz|GHz|ms|μs|us|ns|fps|bit|bits)?$/i

/**
 * Mark predominantly numeric columns for right-align + semibold scanning.
 * Also tags tables whose last column is numeric (CSS fallback class).
 */
export function enhanceTableNumericColumns(container) {
  if (!container) return
  container.querySelectorAll('table').forEach(table => {
    const rows = [...table.querySelectorAll('tbody tr')]
    if (!rows.length) return
    const colCount = Math.max(...rows.map(r => r.children.length), 0)
    let lastIsNumeric = false

    for (let c = 0; c < colCount; c++) {
      const cells = rows.map(r => r.children[c]).filter(Boolean)
      if (!cells.length) continue
      const numericCount = cells.filter(td => {
        const text = (td.textContent || '').trim()
        if (!text) return false
        return NUMERIC_CELL.test(text) || /^[\d.,+\-~\s%]+$/.test(text)
      }).length
      if (numericCount < Math.ceil(cells.length * 0.6)) continue

      cells.forEach(td => td.classList.add('is-numeric'))
      const th = table.querySelector(`thead tr th:nth-child(${c + 1})`)
      if (th) th.classList.add('is-numeric')
      if (c === colCount - 1) lastIsNumeric = true
    }

    if (lastIsNumeric) table.classList.add('has-numeric-last')
  })
}

export function enhanceMarkdownHtml(html, { title, copyLabel, copyAria } = {}) {
  let next = html
  if (title) next = stripDuplicateTitleHeading(next, title)
  return enhanceTables(enhanceCodeBlocks(next, { copy: copyLabel, copyAria }))
}

export function bindCodeCopyButtons(container, options = {}) {
  if (!container) return
  const {
    onCopied,
    copyLabel = 'Copy',
    copiedLabel = 'Copied',
    failedLabel = 'Failed'
  } = typeof options === 'function' ? { onCopied: options } : options

  container.querySelectorAll('.code-copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pre = btn.parentElement?.querySelector('pre')
      const code = pre?.textContent || ''
      try {
        await navigator.clipboard.writeText(code)
        btn.textContent = copiedLabel
        onCopied?.()
        window.setTimeout(() => {
          btn.textContent = copyLabel
        }, 2000)
      } catch {
        btn.textContent = failedLabel
        window.setTimeout(() => {
          btn.textContent = copyLabel
        }, 2000)
      }
    })
  })
}
