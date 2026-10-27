<template>
  <div class="contact">
    <section class="curtain reveal">
      <p class="page-kicker">
        {{ $t('contact.eyebrow') }}
      </p>
      <h1 class="curtain-title">
        {{ $t('contact.title') }}
      </h1>
      <p class="curtain-lede">
        {{ $t('contact.subtitle') }}
      </p>

      <p class="curtain-place">
        {{ $t('contact.info.address') }}
      </p>
      <a
        class="curtain-email"
        :href="`mailto:${email}`"
      >{{ email }}</a>
      <a
        v-if="showPhone"
        class="curtain-phone"
        :href="`tel:${phoneTel}`"
      >{{ phone }}</a>
      <p class="curtain-hint">
        {{ $t('contact.responseTime') }}
      </p>
      <a
        class="text-link"
        :href="`mailto:${email}`"
      >
        {{ $t('contact.emailCta') }}
      </a>

      <ol class="credits">
        <li>
          <a
            class="credit-row"
            :href="githubUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="credit-name">GitHub</span>
            <span class="credit-desc">{{ $t('contact.channels.github') }}</span>
          </a>
        </li>
        <li>
          <a
            class="credit-row"
            :href="csdnUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="credit-name">CSDN</span>
            <span class="credit-desc">{{ $t('contact.channels.csdn') }}</span>
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
  background: transparent;
}

.curtain {
  max-width: 680px;
  margin: 0 auto;
  padding:
    clamp(64px, 14vh, 120px)
    28px
    calc(var(--cinema-letterbox) + 96px);
  text-align: center;
}

.curtain-title {
  margin: 0 0 18px;
  font-family: var(--font-serif);
  font-size: clamp(48px, 6.5vw, 80px);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.05;
  text-wrap: balance;
}

.curtain-lede {
  margin: 0 auto 48px;
  max-width: 26em;
  font-size: 17px;
  line-height: 1.7;
  color: var(--color-text-secondary);
  text-wrap: pretty;
}

.curtain-place {
  margin: 0 0 12px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.curtain-email {
  display: block;
  margin: 0 0 10px;
  font-family: var(--font-serif);
  font-size: clamp(26px, 4vw, 40px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.25;
  color: var(--color-text);
  text-decoration: none;
  transition: color var(--duration-base) var(--ease-cinema);
}

@media (hover: hover) and (pointer: fine) {
  .curtain-email:hover {
    color: var(--color-accent);
  }
}

.curtain-phone {
  display: block;
  margin: 0 0 16px;
  font-size: 15px;
  color: var(--color-text-secondary);
  text-decoration: none;
}

.curtain-hint {
  margin: 0 0 28px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.text-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 20px;
  border: 1px solid var(--color-accent);
  border-radius: 2px;
  background: var(--color-accent);
  color: var(--color-accent-contrast);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
  transition:
    background var(--duration-base) var(--ease-cinema),
    border-color var(--duration-base) var(--ease-cinema),
    transform var(--duration-press) var(--ease-out);
}

.text-link:active {
  transform: scale(0.98);
}

@media (hover: hover) and (pointer: fine) {
  .text-link:hover {
    background: var(--color-accent-hover);
    border-color: var(--color-accent-hover);
  }
}

.text-link:focus-visible,
.credit-row:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}

.credits {
  list-style: none;
  margin: 56px auto 0;
  padding: 0;
  max-width: 420px;
  border-top: 1px solid rgba(125, 106, 214, 0.28);
  text-align: left;
}

.credits li {
  border-bottom: 1px solid rgba(125, 106, 214, 0.2);
}

.credit-row {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 12px;
  align-items: baseline;
  padding: 18px 0;
  color: inherit;
  text-decoration: none;
}

.credit-name {
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 700;
  transition: color var(--duration-base) var(--ease-cinema);
}

.credit-desc {
  font-size: 13px;
  color: var(--color-text-tertiary);
}

@media (hover: hover) and (pointer: fine) {
  .credit-row:hover .credit-name {
    color: var(--color-accent);
  }
}
</style>
