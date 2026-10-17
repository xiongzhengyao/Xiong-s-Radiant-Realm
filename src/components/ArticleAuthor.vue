<template>
  <aside class="article-author" :class="{ 'is-compact': compact }">
    <template v-if="compact">
      <p class="author-byline">
        <span class="author-name">{{ name }}</span>
        <span class="author-sep" aria-hidden="true">·</span>
        <span class="author-role">{{ shortRole }}</span>
      </p>
    </template>
    <template v-else>
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
    </template>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { APP_CONFIG } from '@/utils/constants'

defineProps({
  /** One-line byline for end-of-article placement */
  compact: { type: Boolean, default: true }
})

const { t, tm, locale } = useI18n()
const imageError = ref(false)

const name = computed(() => t('about.profile.name'))
const bio = computed(() => t('about.profile.bio'))
const shortRole = computed(() =>
  locale.value === 'zh' ? 'Camera 驱动' : t('about.profile.title')
)
const topics = computed(() => {
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
.article-author {
  max-width: var(--article-prose-max, 42rem);
}

.article-author.is-compact {
  padding: var(--space-8) 0 var(--space-2);
  margin-top: var(--space-10);
  border-top: 1px solid var(--color-divider);
}

.author-byline {
  margin: 0;
  font-size: 13px;
  font-family: var(--font-mono);
  color: var(--color-text-tertiary);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}

.author-byline .author-name {
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 13px;
  margin: 0;
}

.author-sep {
  opacity: 0.6;
}

.author-role {
  color: var(--color-text-tertiary);
}

/* Full card (optional) */
.article-author:not(.is-compact) {
  display: flex;
  gap: var(--space-4);
  align-items: flex-start;
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

.author-body .author-name {
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
