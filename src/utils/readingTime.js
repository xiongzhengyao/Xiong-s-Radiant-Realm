/** Estimate reading time from markdown/plain text (words per minute). */
export function getReadingTimeMinutes(text, wpm = 220) {
  if (!text) return 1
  const plain = String(text)
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#>*_`[\]()]/g, '')
    .trim()
  const cjk = (plain.match(/[\u4e00-\u9fff]/g) || []).length
  const words = plain.split(/\s+/).filter(Boolean).length
  const minutes = Math.ceil((cjk / 400) + (words / wpm))
  return Math.max(1, minutes)
}
