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
  border-top: 1px solid rgba(125, 106, 214, 0.22);
}

.channel-list li {
  border-bottom: 1px solid rgba(125, 106, 214, 0.18);
}

.channel-row {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: baseline;
  padding: 14px 0;
  color: inherit;
  text-decoration: none;
}

.channel-name {
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.channel-desc {
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-text-tertiary);
}

.channel-arrow {
  font-size: 18px;
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

  .channel-row {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 6px 12px;
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
