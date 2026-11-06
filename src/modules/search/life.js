import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { lifePath } from '../paths.js'

export function lifeProvider() {
  const { t, tm } = useI18n()
  const items = computed(() => {
    const posts = tm('life.posts')
    if (!Array.isArray(posts)) return []
    return posts.map(post => ({
      key: `life-${post.id}`,
      path: lifePath(post.id),
      label: post.title,
      hint: t('command.groups.life'),
      kind: 'life',
      search: [post.title, post.description, ...(post.tags || [])].join(' ')
    }))
  })

  return {
    id: 'life',
    labelKey: 'command.groups.life',
    order: 40,
    when: 'query',
    items
  }
}
