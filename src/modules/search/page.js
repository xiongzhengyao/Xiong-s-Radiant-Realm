import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import catalog from '../catalog.mjs'
import { commandPages } from '../query.mjs'

export function pageProvider() {
  const { t } = useI18n()
  const items = computed(() =>
    commandPages(catalog).map(page => ({
      key: page.key,
      path: page.path,
      label: t(page.labelKey),
      hint: t('command.groups.pages'),
      kind: 'page'
    }))
  )

  return {
    id: 'page',
    labelKey: 'command.groups.pages',
    order: 10,
    when: 'always',
    items
  }
}
