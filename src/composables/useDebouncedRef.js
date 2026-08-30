import { ref, watch, onUnmounted } from 'vue'

export function useDebouncedRef(source, delay = 200) {
  const debounced = ref(source.value)
  let timer = null

  watch(source, value => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debounced.value = value
    }, delay)
  })

  onUnmounted(() => clearTimeout(timer))

  return debounced
}
