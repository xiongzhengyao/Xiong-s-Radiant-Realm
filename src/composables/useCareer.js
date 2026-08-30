import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { CAREER_ITEMS, CAREER_COMPANY_IDS } from '@/data/career'

export function useCareer() {
  const { t, tm } = useI18n()

  const projectCopyById = computed(() => {
    const items = tm('projects.items')
    if (!Array.isArray(items)) return {}
    return Object.fromEntries(items.map(item => [item.id, item]))
  })

  const projects = computed(() =>
    CAREER_ITEMS.map(item => {
      const copy = projectCopyById.value[item.id] || {}
      return {
        ...item,
        company: copy.company || item.companyId,
        year: copy.year || (item.year === 'ongoing' ? t('career.yearOngoing') : item.year),
        title: copy.title || '',
        description: copy.description || '',
        tags: copy.tags || item.tags
      }
    })
  )

  const companyIds = CAREER_COMPANY_IDS

  return { projects, companyIds }
}
