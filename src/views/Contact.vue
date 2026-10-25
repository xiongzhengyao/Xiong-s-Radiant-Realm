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

      <div class="contact-letter reveal">
        <p class="letter-place">
          {{ $t('contact.info.address') }}
        </p>
        <a
          class="letter-email"
          :href="`mailto:${email}`"
        >{{ email }}</a>
        <a
          v-if="showPhone"
          class="letter-phone"
          :href="`tel:${phoneTel}`"
        >{{ phone }}</a>
        <p class="letter-hint">
          {{ $t('contact.responseTime') }}
        </p>
        <a
          class="text-link"
          :href="`mailto:${email}`"
        >
          {{ $t('contact.emailCta') }}
        </a>
      </div>

      <ol class="channel-index reveal reveal-delay-1">
        <li>
          <a
            class="channel-row"
            :href="githubUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="channel-name">GitHub</span>
            <span class="channel-desc">{{ $t('contact.channels.github') }}</span>
            <span
              class="channel-arrow"
              aria-hidden="true"
            >›</span>
          </a>
        </li>
        <li>
          <a
            class="channel-row"
            :href="csdnUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="channel-name">CSDN</span>
            <span class="channel-desc">{{ $t('contact.channels.csdn') }}</span>
            <span
              class="channel-arrow"
              aria-hidden="true"
            >›</span>
          </a>
        </li>
      </ol>
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
  max-width: 720px;
  margin: 0 auto;
  padding: clamp(36px, 6vh, 64px) 28px 80px;
}

.contact-intro {
  margin-bottom: 36px;
}

.contact-letter {
  margin-bottom: 48px;
  padding-bottom: 36px;
  border-bottom: 1px solid rgba(125, 106, 214, 0.22);
}

.letter-place {
  margin: 0 0 12px;
  font-size: 13px;
  letter-spacing: 0.04em;
  color: var(--color-text-tertiary);
}

.letter-email {
  display: block;
  margin: 0 0 8px;
  font-family: var(--font-serif);
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.25;
  color: var(--color-text);
  text-decoration: none;
}

.letter-email:hover {
  color: var(--color-accent);
}

.letter-phone {
  display: block;
  margin: 0 0 16px;
  font-size: 15px;
  color: var(--color-text-secondary);
  text-decoration: none;
}

.letter-phone:hover {
  color: var(--color-accent);
}

.letter-hint {
  margin: 0 0 24px;
  font-size: 14px;
  line-height: 1.55;
  color: var(--color-text-secondary);
}

.text-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid var(--color-accent);
  border-radius: 2px;
  background: var(--color-accent);
  color: #fff;
  font-size: 13px;
  letter-spacing: 0.14em;
  text-decoration: none;
  transition: transform 0.12s ease, background 0.2s ease, color 0.2s ease;
}

html.dark .text-link {
  color: #1a1428;
}

.text-link:active {
  transform: scale(0.98);
}

.text-link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}

.channel-index {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid rgba(125, 106, 214, 0.28);
}

.channel-index li {
  border-bottom: 1px solid rgba(125, 106, 214, 0.2);
}

.channel-row {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr) auto;
  gap: 16px;
  align-items: baseline;
  padding: 20px 0;
  color: inherit;
  text-decoration: none;
}

.channel-name {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.channel-desc {
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

.channel-arrow {
  font-size: 20px;
  line-height: 1;
  color: var(--color-text-tertiary);
  transition: transform 0.2s ease, color 0.2s ease;
}

@media (hover: hover) and (pointer: fine) {
  .channel-row:hover .channel-name {
    color: var(--color-accent);
  }

  .channel-row:hover .channel-arrow {
    color: var(--color-accent);
    transform: translateX(3px);
  }
}

.channel-row:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
}

@media (max-width: 640px) {
  .contact-board {
    padding: 28px 18px 64px;
  }

  .channel-row {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px 12px;
  }

  .channel-name {
    grid-column: 1;
  }

  .channel-desc {
    grid-column: 1;
  }

  .channel-arrow {
    grid-column: 2;
    grid-row: 1 / span 2;
    align-self: center;
  }
}
</style>
