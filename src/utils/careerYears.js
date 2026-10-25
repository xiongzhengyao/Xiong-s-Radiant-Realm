import { APP_CONFIG } from '@/utils/constants'

function parseStart (value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return null
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

/** Completed years of work experience from CAREER_START to `now`. */
export function getCareerYears (now = new Date()) {
  const start = parseStart(APP_CONFIG.CAREER_START)
  if (!start || Number.isNaN(now.getTime())) return 0

  let years = now.getFullYear() - start.getFullYear()
  const monthDelta = now.getMonth() - start.getMonth()
  const dayDelta = now.getDate() - start.getDate()
  if (monthDelta < 0 || (monthDelta === 0 && dayDelta < 0)) {
    years -= 1
  }
  return Math.max(0, years)
}
