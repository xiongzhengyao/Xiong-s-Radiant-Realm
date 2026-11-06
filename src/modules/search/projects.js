import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCareer } from '@/composables/useCareer'
import { projectPath } from '../paths.js'

export function projectsProvider() {
  const { projects } = useCareer()
  const { t } = useI18n()
  const items = computed(() =>
    projects.value.map(project => ({
      key: `project-${project.id}`,
      path: projectPath(project.id),
      label: project.title,
      hint: project.company || t('command.groups.projects'),
      kind: 'projects',
      search: [
        project.title,
        project.role,
        project.description,
        project.company,
        ...(project.tags || [])
      ].join(' ')
    }))
  )

  return {
    id: 'projects',
    labelKey: 'command.groups.projects',
    order: 30,
    when: 'query',
    items
  }
}
