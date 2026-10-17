<template>
  <aside class="article-author">
    <div class="author-avatar">
      <img
        v-if="!imageError"
        :src="profileImage"
        :alt="name"
        @error="imageError = true"
      />
      <span v-else class="author-fallback">{{ initials }}</span>
    </div>
    <div class="author-body">
      <p class="author-label">{{ $t('blog.author.label') }}</p>
      <p class="author-name">{{ name }}</p>
      <p class="author-bio">{{ bio }}</p>
      <div v-if="topics.length" class="author-topics">
        <span class="author-topics-label">{{ $t('home.expertise.eyebrow') }}</span>
        <span v-for="topic in topics" :key="topic" class="author-topic">{{ topic }}</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { APP_CONFIG } from '@/utils/constants'

const { t, tm } = useI18n()
const imageError = ref(false)

const name = computed(() => t('about.profile.name'))
const bio = computed(() => t('about.profile.bio'))
const topics = computed(() => {
  // Prefer dedicated focusing topics when present; otherwise reuse skill names.
  const focusing = tm('home.focusing.topics')
  if (Array.isArray(focusing) && focusing.length) return focusing.slice(0, 3)
  return [
    t('home.skills.embedded.name'),
    t('home.skills.image.name'),
    t('home.skills.linux.name')
  ]
})
const profileImage = APP_CONFIG.IMAGES.PROFILE
const initials = computed(() => {
  const n = name.value || ''
  return n.slice(0, 2).toUpperCase()
})
</script>

<style scoped>
/* Compact byline — not a promo card */
.article-author {
  display: flex;
  gap: var(--space-4);
  align-items: flex-start;
  max-width: var(--article-prose-max, 42rem);
  padding: 0 0 var(--space-8);
  margin-bottom: var(--space-2);
  border: none;
  background: transparent;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--color-border);
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 16px;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--color-text-tertiary);
  background: var(--color-bg-secondary);
}

.author-label {
  font-size: 10px;
  font-weight: 600;
  font-family: var(--font-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  margin: 0 0 2px;
}

.author-name {
  font-size: 15px;
  font-weight: 600;
  font-family: var(--font-mono);
  margin: 0 0 var(--space-1);
}

.author-bio {
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-2);
  max-width: 48ch;
}

.author-topics {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}

.author-topics-label {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--color-text-tertiary);
}

.author-topic {
  font-size: 11px;
  font-family: var(--font-mono);
  padding: 2px 0;
  border-radius: 0;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--color-accent-border);
  color: var(--color-text-secondary);
}
</style>
