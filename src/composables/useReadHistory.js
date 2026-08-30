import { ref, computed } from 'vue'

const STORAGE_KEY = 'blog-read-history'
const MAX_ITEMS = 20

const history = ref(load())

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
  } catch {
    /* ignore quota errors */
  }
}

export function useReadHistory() {
  const markRead = (postId, progress = 100) => {
    const id = String(postId)
    const now = Date.now()
    const existing = history.value.find(item => item.id === id)
    if (existing) {
      existing.progress = Math.max(existing.progress, progress)
      existing.readAt = now
    } else {
      history.value.unshift({ id, progress, readAt: now })
    }
    history.value = history.value
      .sort((a, b) => b.readAt - a.readAt)
      .slice(0, MAX_ITEMS)
    persist()
  }

  const updateProgress = (postId, progress) => {
    const id = String(postId)
    const item = history.value.find(entry => entry.id === id)
    if (item) {
      item.progress = Math.max(item.progress, progress)
      persist()
      return
    }
    if (progress > 5) {
      markRead(id, progress)
    }
  }

  const isRead = postId => {
    const item = history.value.find(entry => entry.id === String(postId))
    return item ? item.progress >= 90 : false
  }

  const getProgress = postId => {
    const item = history.value.find(entry => entry.id === String(postId))
    return item?.progress ?? 0
  }

  const recentIds = computed(() => history.value.map(item => item.id))

  const continueReading = computed(() => {
    return history.value.find(item => item.progress > 5 && item.progress < 90) ?? null
  })

  return {
    history,
    recentIds,
    continueReading,
    markRead,
    updateProgress,
    isRead,
    getProgress
  }
}
