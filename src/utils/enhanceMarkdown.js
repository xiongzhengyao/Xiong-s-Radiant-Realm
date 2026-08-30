/** Wrap code blocks with copy-button container */
export function enhanceCodeBlocks(html) {
  if (!html) return html
  return html.replace(/<pre>([\s\S]*?)<\/pre>/g, (_match, inner) => {
    return `<div class="code-block-wrap"><button type="button" class="code-copy-btn" aria-label="Copy code">Copy</button><pre>${inner}</pre></div>`
  })
}

export function bindCodeCopyButtons(container, onCopied) {
  if (!container) return
  container.querySelectorAll('.code-copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pre = btn.parentElement?.querySelector('pre')
      const code = pre?.textContent || ''
      try {
        await navigator.clipboard.writeText(code)
        const original = btn.textContent
        btn.textContent = 'Copied'
        onCopied?.()
        window.setTimeout(() => {
          btn.textContent = original
        }, 2000)
      } catch {
        btn.textContent = 'Failed'
      }
    })
  })
}
