import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import catalog from '../catalog.mjs'
import { pageProvider } from './page'
import { notesProvider } from './notes'
import { projectsProvider } from './projects'
import { lifeProvider } from './life'

const factories = [pageProvider, notesProvider, projectsProvider, lifeProvider]

export function useCommandIndex() {
  const { t } = useI18n()
  const query = ref('')
  const providers = factories.map(create => create()).sort((a, b) => a.order - b.order)

  const known = new Set(providers.map(provider => provider.id))
  for (const mod of catalog) {
    if (mod.search && !known.has(mod.search)) {
      console.warn(
        `[modules] "${mod.id}" declares search "${mod.search}" but no provider is registered`
      )
    }
  }

  const filteredItems = computed(() => {
    const q = query.value.trim().toLowerCase()
    const active = q ? providers : providers.filter(provider => provider.when !== 'query')
    const pool = active.flatMap(provider => provider.items.value)
    if (!q) return pool
    return pool
      .filter(item => {
        const hay = `${item.label} ${item.hint} ${item.search || ''} ${item.path}`.toLowerCase()
        return hay.includes(q)
      })
      .slice(0, 24)
  })

  const groupedResults = computed(() =>
    providers
      .map(provider => ({
        id: provider.id,
        label: t(provider.labelKey),
        items: filteredItems.value.filter(item => item.kind === provider.id)
      }))
      .filter(group => group.items.length)
  )

  const flatItems = computed(() => groupedResults.value.flatMap(group => group.items))

  const prepare = () => Promise.all(providers.map(provider => provider.prepare?.()))

  return { query, groupedResults, flatItems, prepare }
}
