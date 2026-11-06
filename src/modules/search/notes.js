import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBlogStore } from '@/stores/blogStore'
import { blogPostPath } from '../paths.js'

export function notesProvider() {
  const blogStore = useBlogStore()
  const { t } = useI18n()
  const items = computed(() =>
    blogStore.posts.map(post => ({
      key: `note-${post.id}`,
      path: blogPostPath(post),
      label: post.title,
      hint: t('command.groups.notes'),
      kind: 'notes',
      search: [post.title, post.excerpt, ...(post.tags || [])].join(' ')
    }))
  )

  return {
    id: 'notes',
    labelKey: 'command.groups.notes',
    order: 20,
    when: 'query',
    items,
    prepare: () => blogStore.ensureLoaded()
  }
}
