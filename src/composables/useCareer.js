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
        role: copy.role || '',
        chip: copy.chip || 'tools',
        tags: copy.tags || item.tags,
        group: item.group || 'company',
        url: item.url || null,
        private: Boolean(item.private)
      }
    })
  )

  const companyProjects = computed(() => projects.value.filter(p => p.group === 'company'))
  const personalProjects = computed(() => projects.value.filter(p => p.group === 'personal'))

  const companyIds = CAREER_COMPANY_IDS

  return { projects, companyProjects, personalProjects, companyIds }
}
