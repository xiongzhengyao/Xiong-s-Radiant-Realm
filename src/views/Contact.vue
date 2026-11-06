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

      <p class="intents-label">
        {{ $t('contact.intentsTitle') }}
      </p>
      <div class="intent-row">
        <a
          v-for="key in intentKeys"
          :key="key"
          class="text-link"
          :class="{ 'text-link--quiet': key !== 'collab' }"
          :href="mailtoFor(key)"
        >
          {{ $t(`contact.intents.${key}.label`) }}
        </a>
      </div>

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
import { useI18n } from 'vue-i18n'
import { useReveal } from '@/composables/useReveal'
import { APP_CONFIG } from '@/utils/constants'

const { t } = useI18n()
const email = APP_CONFIG.EMAIL
const phone = APP_CONFIG.PHONE
const showPhone = APP_CONFIG.SHOW_PHONE === true
const phoneTel = computed(() => String(phone || '').replace(/\s+/g, ''))
const githubUrl = APP_CONFIG.SOCIAL.GITHUB
const csdnUrl = APP_CONFIG.SOCIAL.CSDN
const intentKeys = ['collab', 'tech', 'hello']

const mailtoFor = key => {
  const subject = encodeURIComponent(t(`contact.intents.${key}.subject`))
  const body = encodeURIComponent(t(`contact.intents.${key}.body`))
  return `mailto:${email}?subject=${subject}&body=${body}`
}

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

.intents-label {
  margin: 0 0 14px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
}

.intent-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.text-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-sm);
  background: var(--color-accent);
  color: var(--color-accent-contrast);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  transition:
    background var(--duration-base) var(--ease-cinema),
    border-color var(--duration-base) var(--ease-cinema),
    color var(--duration-base) var(--ease-cinema),
    transform var(--duration-press) var(--ease-out);
}

.text-link--quiet {
  background: transparent;
  color: var(--color-accent);
}

.text-link:active {
  transform: scale(0.98);
}

@media (hover: hover) and (pointer: fine) {
  .text-link:hover {
    background: var(--color-accent-hover);
    border-color: var(--color-accent-hover);
    color: var(--color-accent-contrast);
  }

  .text-link--quiet:hover {
    background: var(--color-accent-light);
    color: var(--color-accent);
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
  border-top: 1px solid var(--color-border);
  text-align: left;
}

.credits li {
  border-bottom: 1px solid var(--color-divider);
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
