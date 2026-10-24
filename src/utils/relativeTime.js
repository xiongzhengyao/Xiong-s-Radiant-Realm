function parseDate(dateStr) {
  const match = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  }
  const date = new Date(dateStr)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatRelativeDate(dateStr, locale = 'zh') {
  if (!dateStr) return ''
  const date = parseDate(dateStr)
  if (!date) return String(dateStr)

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const days = Math.max(0, Math.round((startOfToday - startOfDate) / 86400000))
  const sameYear = date.getFullYear() === now.getFullYear()

  if (locale === 'en') {
    if (days <= 1) return 'Today'
    if (days < 7) return `${days}d ago`
    if (days < 14) return 'Last week'
    if (sameYear) return date.toLocaleDateString('en', { month: 'short', day: 'numeric' })
    return date.toLocaleDateString('en', { year: 'numeric', month: 'short' })
  }

  if (days <= 1) return '今天'
  if (days < 7) return `${days} 天前`
  if (days < 14) return '上周'
  if (sameYear) return `${date.getMonth() + 1}月更新`
  return `${date.getFullYear()}年${date.getMonth() + 1}月`
}
