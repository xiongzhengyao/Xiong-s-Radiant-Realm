<template>
  <div class="contact">
    <div
      class="contact-atmosphere"
      aria-hidden="true"
    >
      <div class="contact-mesh" />
    </div>

    <section class="contact-board">
      <header class="contact-intro reveal">
        <p class="page-kicker">
          {{ $t('contact.eyebrow') }}
        </p>
        <h1 class="page-title">
          {{ $t('contact.title') }}
        </h1>
        <p class="page-lede">
          {{ $t('contact.subtitle') }}
        </p>
      </header>

      <div class="contact-panels">
        <article class="contact-card reveal">
          <h2>{{ $t('contact.info.title') }}</h2>
          <ul class="contact-meta">
            <li>{{ $t('contact.info.address') }}</li>
            <li>
              <a :href="`mailto:${email}`">{{ email }}</a>
            </li>
            <li v-if="showPhone">
              <a :href="`tel:${phoneTel}`">{{ phone }}</a>
            </li>
          </ul>
          <a
            class="btn btn-primary contact-mail"
            :href="`mailto:${email}`"
          >
            {{ $t('contact.emailCta') }}
          </a>
          <p class="contact-hint">
            {{ $t('contact.responseTime') }}
          </p>
        </article>

        <article class="contact-card reveal reveal-delay-1">
          <h2>{{ $t('contact.info.social') }}</h2>
          <ul class="channel-list">
            <li>
              <a
                class="channel-link"
                :href="githubUrl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span
                  class="channel-icon"
                  aria-hidden="true"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  ><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" /></svg>
                </span>
                <span class="channel-copy">
                  <span class="channel-name">GitHub</span>
                  <span class="channel-desc">{{ $t('contact.channels.github') }}</span>
                </span>
                <span
                  class="channel-arrow"
                  aria-hidden="true"
                >›</span>
              </a>
            </li>
            <li>
              <a
                class="channel-link"
                :href="csdnUrl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span
                  class="channel-icon"
                  aria-hidden="true"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 1024 1024"
                    fill="currentColor"
                  ><path d="M512 0c282.784 0 512 229.216 512 512s-229.216 512-512 512S0 794.784 0 512 229.216 0 512 0z m189.952 752l11.2-108.224c-31.904 9.536-100.928 16.128-147.712 16.128-134.464 0-205.728-47.296-195.328-146.304 11.584-110.688 113.152-145.696 232.64-145.696 54.784 0 122.432 8.8 151.296 18.336L768 272.704C724.544 262.24 678.272 256 599.584 256c-203.2 0-388.704 94.88-406.4 263.488C178.336 660.96 303.584 768 535.616 768c80.672 0 138.464-6.432 166.336-16z" /></svg>
                </span>
                <span class="channel-copy">
                  <span class="channel-name">CSDN</span>
                  <span class="channel-desc">{{ $t('contact.channels.csdn') }}</span>
                </span>
                <span
                  class="channel-arrow"
                  aria-hidden="true"
                >›</span>
              </a>
            </li>
          </ul>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useReveal } from '@/composables/useReveal'
import { APP_CONFIG } from '@/utils/constants'

const email = APP_CONFIG.EMAIL
const phone = APP_CONFIG.PHONE
const showPhone = APP_CONFIG.SHOW_PHONE === true
const phoneTel = computed(() => String(phone || '').replace(/\s+/g, ''))
const githubUrl = APP_CONFIG.SOCIAL.GITHUB
const csdnUrl = APP_CONFIG.SOCIAL.CSDN

useReveal()
</script>

<style scoped>
.contact {
  position: relative;
  padding-top: var(--nav-height);
  min-height: 100vh;
  overflow: hidden;
}

.contact-atmosphere {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.contact-mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 40% at 20% 25%, var(--color-mesh-1) 0%, transparent 60%),
    radial-gradient(ellipse 45% 35% at 80% 70%, var(--color-mesh-2) 0%, transparent 55%);
}


.contact-board {
  position: relative;
  z-index: 1;
  max-width: var(--max-width-wide);
  margin: 0 auto;
  padding: 36px 24px 80px;
}

.contact-intro {
  max-width: 560px;
  margin-bottom: 28px;
}


.contact-intro h1 {
  margin: 0 0 12px;
  font-family: var(--font-serif);
  font-size: clamp(40px, 5vw, 56px);
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.15;
}


.contact-panels {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  align-items: stretch;
}

.contact-card {
  padding: 24px 24px 22px;
  background: var(--color-card-bg);
  border: 1px solid var(--color-card-border);
  border-radius: 12px;
  border-color: rgba(125, 106, 214, 0.18);
  box-shadow: none;
}

.contact-card h2 {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 600;
}

.contact-meta {
  list-style: none;
  margin: 0 0 22px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-meta li {
  font-size: 15px;
  color: var(--color-text-secondary);
}

.contact-meta a {
  color: var(--color-accent);
  text-decoration: none;
}

.contact-meta a:hover {
  text-decoration: underline;
}

.contact-mail {
  display: inline-flex;
  text-decoration: none;
  margin-bottom: 12px;
}

.contact-hint {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-text-tertiary);
}

.channel-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.channel-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 14px;
  border-radius: 16px;
  border: 1px solid var(--color-card-border);
  background: var(--color-bg-secondary);
  color: inherit;
  text-decoration: none;
  transition:
    border-color var(--duration-fast) var(--ease-out),
    transform 0.12s var(--ease-out),
    background var(--duration-fast) var(--ease-out);
}

.channel-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--color-card-bg);
  color: var(--color-text);
  flex: 0 0 auto;
}

.channel-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.channel-name {
  font-size: 15px;
  font-weight: 600;
}

.channel-desc {
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.channel-arrow {
  font-size: 22px;
  line-height: 1;
  color: var(--color-text-tertiary);
}

@media (hover: hover) and (pointer: fine) {
  .channel-link:hover {
    border-color: var(--color-accent);
    transform: translateY(-1px);
  }
}

.channel-link:active {
  transform: scale(0.99);
}

@media (max-width: 780px) {
  .contact-panels {
    grid-template-columns: 1fr;
  }

  .contact-board {
    padding: 28px 18px 64px;
  }

  .contact-intro h1 {
    font-size: 40px;
  }
}
</style>
