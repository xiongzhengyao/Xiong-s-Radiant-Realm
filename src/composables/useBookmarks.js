import { ref, computed } from 'vue'

const STORAGE_KEY = 'blog-bookmarks'

const bookmarks = ref(load())

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks.value))
  } catch {
    /* ignore */
  }
}

export function useBookmarks() {
  const isBookmarked = postId => bookmarks.value.includes(String(postId))

  const toggleBookmark = postId => {
    const id = String(postId)
    if (bookmarks.value.includes(id)) {
      bookmarks.value = bookmarks.value.filter(item => item !== id)
    } else {
      bookmarks.value = [id, ...bookmarks.value]
    }
    persist()
    return bookmarks.value.includes(id)
  }

  const bookmarkedIds = computed(() => [...bookmarks.value])

  return { bookmarks, bookmarkedIds, isBookmarked, toggleBookmark }
}
