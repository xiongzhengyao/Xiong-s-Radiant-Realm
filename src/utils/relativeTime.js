export function formatRelativeDate(dateStr, locale = 'zh') {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return String(dateStr)
  const days = Math.max(0, Math.round((Date.now() - date.getTime()) / 86400000))
  if (locale === 'en') {
    if (days <= 1) return 'Today'
    if (days < 7) return `${days}d ago`
    if (days < 14) return 'Last week'
    return date.toLocaleDateString('en', { month: 'short', day: 'numeric' })
  }
  if (days <= 1) return '今天'
  if (days < 7) return `${days} 天前`
  if (days < 14) return '上周'
  return `${date.getMonth() + 1}月更新`
}
