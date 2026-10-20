import { onMounted, onUnmounted } from 'vue'

const DEFAULT_OPTIONS = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px',
  selector: '.reveal'
}

export function useReveal(options = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options }
  let observer = null

  const observe = (root = document) => {
    if (!observer || typeof root?.querySelectorAll !== 'function') return
    root.querySelectorAll(config.selector).forEach(el => {
      // Skip nodes already revealed; re-bind late-mounted journal/cards
      if (el.classList.contains('is-visible')) return
      observer.observe(el)
    })
  }

  onMounted(() => {
    observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: config.threshold, rootMargin: config.rootMargin }
    )
    observe()
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })

  return { observe }
}
