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
      <div class="author-topics">
        <span class="author-topics-label">{{ $t('home.focusing.label') }}</span>
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
const topics = computed(() => tm('home.focusing.topics').slice(0, 3))
const profileImage = APP_CONFIG.IMAGES.PROFILE
const initials = computed(() => {
  const n = name.value || ''
  return n.slice(0, 2).toUpperCase()
})
</script>

<style scoped>
.article-author {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-5);
  margin-bottom: var(--space-8);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
}

.author-avatar {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid var(--color-border);
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
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-tertiary);
  background: var(--color-card-bg);
}

.author-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  margin: 0 0 var(--space-1);
}

.author-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 var(--space-1);
}

.author-bio {
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-3);
}

.author-topics {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}

.author-topics-label {
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.author-topic {
  font-size: 11px;
  font-family: var(--font-mono);
  padding: 3px 8px;
  border-radius: var(--radius-full);
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}
</style>
