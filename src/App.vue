<template>
  <ErrorBoundary>
    <a
      href="#main-content"
      class="skip-link"
    >{{ $t('nav.skipToContent') }}</a>
    <div
      class="app"
      :class="{ 'is-scrolled': isScrolled, 'is-article-reading': isArticleReading }"
    >
      <div
        class="studio-bg"
        aria-hidden="true"
      >
        <div class="studio-beams" />
        <div class="studio-stars" />
        <div class="studio-ridge" />
        <div class="studio-snow">
          <svg
            v-for="flake in flakes"
            :key="flake.id"
            class="snowflake"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            :style="flake.style"
          >
            <path
              stroke-linecap="round"
              stroke-width="1.2"
              d="M12 2.5v19M4.8 6.8l14.4 10.4M4.8 17.2l14.4-10.4M12 6.2l-1.6-2.4M12 6.2l1.6-2.4M12 17.8l-1.6 2.4M12 17.8l1.6 2.4"
            />
          </svg>
        </div>
      </div>
      <!-- Navigation -->
      <nav
        class="nav"
        role="navigation"
      >
        <div class="nav-inner">
          <router-link
            to="/"
            class="nav-logo"
          >
            <svg
              class="nav-logo-mark"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <g
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line
                  x1="12"
                  y1="3.2"
                  x2="12"
                  y2="20.8"
                />
                <line
                  x1="4.4"
                  y1="7.6"
                  x2="19.6"
                  y2="16.4"
                />
                <line
                  x1="4.4"
                  y1="16.4"
                  x2="19.6"
                  y2="7.6"
                />
                <path d="M12 5.6 L10.4 4.2 M12 5.6 L13.6 4.2" />
                <path d="M12 18.4 L10.4 19.8 M12 18.4 L13.6 19.8" />
                <path d="M6.2 8.6 L4.4 8.2 M6.2 8.6 L5.4 6.8" />
                <path d="M17.8 15.4 L19.6 15.8 M17.8 15.4 L18.6 17.2" />
                <path d="M6.2 15.4 L4.4 15.8 M6.2 15.4 L5.4 17.2" />
                <path d="M17.8 8.6 L19.6 8.2 M17.8 8.6 L18.6 6.8" />
              </g>
            </svg>
            <span class="nav-logo-text">{{ $t('nav.brand') }}</span>
          </router-link>

          <div
            class="nav-links"
            :class="{ open: mobileMenuOpen }"
          >
            <router-link
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              class="nav-link"
              :class="{ 'router-link-active': isNavActive(link.path) }"
              @click="closeMobileMenu"
              @mouseenter="prefetchRoute(link.path)"
            >
              {{ $t(link.label) }}
            </router-link>
          </div>

          <div class="nav-actions">
            <button
              type="button"
              class="nav-action-btn nav-search"
              :title="commandShortcutLabel"
              :aria-label="$t('command.open')"
              @click="openCommandPalette"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              ><circle
                cx="11"
                cy="11"
                r="8"
              /><line
                x1="21"
                y1="21"
                x2="16.65"
                y2="16.65"
              /></svg>
              <kbd class="nav-cmd-kbd">{{ commandShortcutLabel }}</kbd>
            </button>
            <span
              v-if="!showArchiveNav"
              class="nav-rule"
              aria-hidden="true"
            />
            <button
              class="nav-action-btn theme-toggle"
              :title="isDark ? $t('nav.themeLight') : $t('nav.themeDark')"
              :aria-label="isDark ? $t('nav.themeLight') : $t('nav.themeDark')"
              @click="toggleTheme(!isDark)"
            >
              <svg
                v-if="!isDark"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ><circle
                cx="12"
                cy="12"
                r="5"
              /><line
                x1="12"
                y1="1"
                x2="12"
                y2="3"
              /><line
                x1="12"
                y1="21"
                x2="12"
                y2="23"
              /><line
                x1="4.22"
                y1="4.22"
                x2="5.64"
                y2="5.64"
              /><line
                x1="18.36"
                y1="18.36"
                x2="19.78"
                y2="19.78"
              /><line
                x1="1"
                y1="12"
                x2="3"
                y2="12"
              /><line
                x1="21"
                y1="12"
                x2="23"
                y2="12"
              /><line
                x1="4.22"
                y1="19.78"
                x2="5.64"
                y2="18.36"
              /><line
                x1="18.36"
                y1="5.64"
                x2="19.78"
                y2="4.22"
              /></svg>
              <svg
                v-else
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            </button>
            <span
              v-if="showArchiveNav"
              class="nav-rule"
              aria-hidden="true"
            />
            <button
              v-if="showArchiveNav"
              type="button"
              class="nav-archive"
              :class="{ active: isArchiveOn }"
              :aria-pressed="isArchiveOn"
              @click="toggleArchive"
            >
              {{ $t('nav.archive') }}
            </button>
            <button
              class="nav-toggle"
              :class="{ active: mobileMenuOpen }"
              :aria-expanded="mobileMenuOpen"
              :aria-label="$t('nav.toggleMenu')"
              @click="mobileMenuOpen = !mobileMenuOpen"
            >
              <span /><span />
            </button>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main id="main-content">
        <router-view v-slot="{ Component, route: viewRoute }">
          <Transition
            name="page"
            mode="out-in"
          >
            <component
              :is="Component"
              :key="pageTransitionKey(viewRoute)"
            />
          </Transition>
        </router-view>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-inner container">
          <div class="footer-brand">
            <router-link
              to="/"
              class="footer-logo"
            >
              {{ $t('nav.brand') }}
            </router-link>
            <p class="footer-tagline">
              {{ $t('footer.tagline') }}
            </p>
            <a
              :href="`mailto:${email}`"
              class="footer-email-btn"
            >{{ $t('footer.emailCta') }}</a>
          </div>
          <div class="footer-grid">
            <div class="footer-col">
              <h4 class="footer-heading">
                {{ $t('footer.explore') }}
              </h4>
              <router-link
                to="/"
                class="footer-link"
              >
                {{ $t('nav.home') }}
              </router-link>
              <router-link
                to="/blog"
                class="footer-link"
              >
                {{ $t('nav.blog') }}
              </router-link>
              <router-link
                to="/projects"
                class="footer-link"
              >
                {{ $t('nav.projects') }}
              </router-link>
              <router-link
                to="/life"
                class="footer-link"
              >
                {{ $t('nav.life') }}
              </router-link>
            </div>
            <div class="footer-col">
              <h4 class="footer-heading">
                {{ $t('footer.about') }}
              </h4>
              <router-link
                to="/about"
                class="footer-link"
              >
                {{ $t('nav.about') }}
              </router-link>
              <router-link
                to="/contact"
                class="footer-link"
              >
                {{ $t('nav.contact') }}
              </router-link>
              <button
                type="button"
                class="footer-link footer-locale"
                @click="toggleLocale"
              >
                {{ currentLocale === 'zh' ? 'English' : '中文' }}
              </button>
            </div>
            <div class="footer-col">
              <h4 class="footer-heading">
                {{ $t('footer.social') }}
              </h4>
              <a
                :href="githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="footer-link footer-link--external"
              >GitHub</a>
              <a
                :href="csdnUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="footer-link footer-link--external"
              >CSDN</a>
              <a
                href="/rss.xml"
                class="footer-link"
                target="_blank"
                rel="noopener"
              >{{ $t('footer.rss') }}</a>
              <a
                href="/sitemap.xml"
                class="footer-link"
                target="_blank"
                rel="noopener"
              >{{ $t('footer.sitemap') }}</a>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; {{ new Date().getFullYear() }} Xiong Zhengyao</p>
            <p class="footer-built">
              {{ $t('footer.builtWith') }}
            </p>
          </div>
        </div>
      </footer>
      <BackToTop />
      <CommandPalette ref="commandPaletteRef" />
      <MobileTabBar />
    </div>
  </ErrorBoundary>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/composables/useTheme'
import { usePageMeta } from '@/composables/usePageMeta'
import { APP_CONFIG } from '@/utils/constants'
import BackToTop from '@/components/BackToTop.vue'
import CommandPalette from '@/components/CommandPalette.vue'
import MobileTabBar from '@/components/MobileTabBar.vue'
import { prefetchRoute } from '@/composables/useNavPrefetch'

const route = useRoute()
const router = useRouter()
const { locale, t } = useI18n()
const { isDark, toggleTheme } = useTheme()
usePageMeta()
const email = APP_CONFIG.EMAIL
const githubUrl = APP_CONFIG.SOCIAL.GITHUB
const csdnUrl = APP_CONFIG.SOCIAL.CSDN
const currentLocale = computed(() => locale.value)
const mobileMenuOpen = ref(false)
const isScrolled = ref(false)
const commandPaletteRef = ref(null)
const isAppleMod = typeof navigator !== 'undefined'
  && /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent || '')
const commandShortcutLabel = computed(() => (
  isAppleMod ? t('command.shortcutMac') : t('command.shortcutWin')
))
const openCommandPalette = () => {
  commandPaletteRef.value?.show?.()
}
/** Article detail hides MobileTabBar and uses a single mini share bar */
const isArticleReading = computed(() => route.name === 'BlogPost')
const showArchiveNav = computed(() => route.path === '/projects')
const isArchiveOn = computed(() => route.query.archive === '1')
const flakes = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  style: {
    left: `${(i * 17 + 4) % 96}%`,
    top: `${(i * 23 + 6) % 92}%`,
    width: `${12 + (i % 4) * 5}px`,
    height: `${12 + (i % 4) * 5}px`,
    opacity: 0.28 + (i % 5) * 0.1,
    animationDuration: `${16 + (i % 7) * 3}s`,
    animationDelay: `${-i * 1.3}s`
  }
}))

const toggleArchive = () => {
  const query = { ...route.query }
  if (query.archive === '1') delete query.archive
  else query.archive = '1'
  router.replace({ path: route.path, query })
}

/* IA lock: 首页 · 笔记 · 项目 · 生活 · 关于 — no 存档 / contact in primary nav */
const navLinks = [
  { path: '/', label: 'nav.home' },
  { path: '/blog', label: 'nav.blog' },
  { path: '/projects', label: 'nav.projects' },
  { path: '/life', label: 'nav.life' },
  { path: '/about', label: 'nav.about' },
]

const toggleLocale = () => {
  const next = locale.value === 'zh' ? 'en' : 'zh'
  locale.value = next
  localStorage.setItem('locale', next)
  const query = { ...route.query }
  if (next === 'en') query.lang = 'en'
  else delete query.lang
  router.replace({ path: route.path, query })
}

const isNavActive = path => {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(`${path}/`)
}

const pageTransitionKey = viewRoute => {
  if (viewRoute.path.startsWith('/blog')) return 'blog'
  return viewRoute.path
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  document.body.style.overflow = ''
}

watch(mobileMenuOpen, open => {
  document.body.style.overflow = open ? 'hidden' : ''
})

watch(() => route.path, () => {
  closeMobileMenu()
})

const onScroll = () => {
  isScrolled.value = window.scrollY > 8
}

const onKeydown = e => {
  if (e.key === 'Escape' && mobileMenuOpen.value) {
    closeMobileMenu()
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style>
/* Global resets handled by apple-design.css */
html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
html.dark {
  color-scheme: dark;
}

/* Page route transitions — ~280ms, displacement ≤8px, out-in (no circular expand) */
.page-enter-active,
.page-leave-active {
  transition: opacity var(--duration-page) var(--ease-out),
              transform var(--duration-page) var(--ease-out);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(var(--page-enter-y));
}

.page-leave-to {
  /* Keep faint residual opacity so out-in mid-frame isn't a black void */
  opacity: var(--page-leave-opacity);
  transform: translateY(var(--page-leave-y));
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: opacity 120ms ease;
  }

  .page-enter-from,
  .page-leave-to {
    transform: none;
  }
}
</style>

<style scoped>
.skip-link {
  position: absolute;
  top: -100px;
  left: var(--space-4);
  z-index: 2000;
  padding: 10px 16px;
  background: var(--color-accent);
  color: var(--color-accent-contrast);
  border-radius: var(--radius-md);
  font-size: 14px;
  text-decoration: none;
  transition: top var(--duration-fast) var(--ease-out);
}

.skip-link:focus {
  top: var(--space-4);
}

.app {
  isolation: isolate;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
  --back-to-top-offset: var(--space-6);
}

main,
.footer {
  position: relative;
  z-index: 1;
}

@media (max-width: 734px) {
  .app {
    padding-bottom: calc(56px + env(safe-area-inset-bottom, 0px));
    /* Tab bar height + 12px clearance */
    --back-to-top-offset: calc(56px + env(safe-area-inset-bottom, 0px) + 12px);
  }

  .app.is-article-reading {
    /* One bar only: article mini share bar (48px) */
    padding-bottom: calc(48px + env(safe-area-inset-bottom, 0px));
    --back-to-top-offset: calc(48px + env(safe-area-inset-bottom, 0px) + 12px);
  }
}

/* --- Navigation --- */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: var(--nav-height);
  background: transparent;
  border-bottom: 1px solid transparent;
  transition: background var(--duration-base) var(--ease-out),
              border-color var(--duration-base) var(--ease-out),
              box-shadow var(--duration-base) var(--ease-out);
}

.is-scrolled .nav {
  background: var(--color-nav-bg);
  backdrop-filter: saturate(180%) blur(18px);
  -webkit-backdrop-filter: saturate(180%) blur(18px);
  border-bottom-color: var(--color-divider);
}

.nav-inner {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 28px;
  gap: var(--space-1);
}

.nav-logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  letter-spacing: -0.02em;
  margin-right: 0;
  justify-self: start;
  transition: opacity var(--duration-fast);
}

.nav-logo-mark {
  flex-shrink: 0;
  color: currentColor;
}

.nav-logo-text {
  display: block;
}

.nav-logo:hover {
  opacity: 0.7;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
}

.nav-link {
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 400;
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  position: relative;
  transition: color var(--duration-fast) var(--ease-out),
              background var(--duration-fast) var(--ease-out);
  white-space: nowrap;
}

@media (hover: hover) and (pointer: fine) {
  .nav-link:hover {
    color: var(--color-text);
  }
}

.nav-link.router-link-active {
  color: var(--color-text);
  font-weight: 600;
  background: transparent;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 12px;
  right: 12px;
  height: 1px;
  width: auto;
  transform: none;
  border-radius: 0;
  background: var(--color-nav-current);
  opacity: 0.9;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-self: end;
}

.nav-rule {
  width: 1px;
  height: 16px;
  margin: 0 8px;
  background: var(--color-divider);
}

.nav-archive {
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  font: inherit;
  font-size: 14px;
  padding: 6px 8px;
  cursor: pointer;
  border-radius: var(--radius-sm);
}

.nav-archive.active {
  color: var(--color-text);
  font-weight: 600;
}

.nav-search {
  width: auto;
  min-width: 36px;
  padding: 0 10px;
  gap: 6px;
}

.nav-cmd-kbd {
  font-size: 11px;
  line-height: 1;
  padding: 3px 5px;
  border-radius: 5px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
  color: var(--color-text-tertiary);
  font-family: var(--font-sans);
}

.nav-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font-sans);
  transition: color var(--duration-fast) var(--ease-out),
              background var(--duration-fast) var(--ease-out),
              transform 0.12s var(--ease-out);
}

.nav-action-btn:active {
  transform: scale(0.92);
  transition: transform 0.1s var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .nav-action-btn:hover {
    color: var(--color-text);
    background: var(--color-accent-light);
  }
}

/* Mobile menu toggle */
.nav-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 8px;
  border-radius: var(--radius-full);
  transition: transform 0.12s var(--ease-out);
}

.nav-toggle:active {
  transform: scale(0.92);
  transition: transform 0.1s var(--ease-out);
}

.nav-toggle span {
  display: block;
  width: 100%;
  height: 1.5px;
  background: var(--color-text);
  border-radius: 2px;
  transition: transform var(--duration-base) var(--ease-out),
              opacity var(--duration-fast);
}

.nav-toggle.active span:first-child {
  transform: translateY(3.25px) rotate(45deg);
}

.nav-toggle.active span:last-child {
  transform: translateY(-3.25px) rotate(-45deg);
}

/* --- Footer --- */
.footer {
  margin-top: auto;
  position: relative;
  background: transparent;
  border-top: none;
  padding: var(--space-16) 0 var(--space-8);
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--color-accent) 50%,
    transparent 100%
  );
  opacity: 0.4;
}

.footer-inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  max-width: var(--max-width-wide);
}

.footer-brand {
  max-width: 360px;
}

.footer-logo {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  letter-spacing: -0.03em;
}

.footer-tagline {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: var(--space-3) 0 var(--space-4);
  line-height: 1.5;
}

.footer-email-btn {
  display: inline-flex;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-accent);
  text-decoration: none;
}

@media (hover: hover) and (pointer: fine) {
  .footer-email-btn:hover {
    text-decoration: underline;
  }
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
}

.footer-heading {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-4);
  letter-spacing: 0;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.footer-link {
  font-size: 13px;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-out);
  line-height: 1.5;
}

.footer-link--external::after {
  content: ' ↗';
  font-size: 11px;
  opacity: 0.45;
}

.footer-locale {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  font: inherit;
}

@media (hover: hover) and (pointer: fine) {
  .footer-link:hover {
    color: var(--color-accent);
  }
}

.footer-bottom {
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.footer-built {
  font-size: 13px;
  color: var(--color-text-tertiary);
  margin: 0;
}

.footer-bottom p {
  font-size: 13px;
  color: var(--color-text-tertiary);
  margin: 0;
}

/* --- Mobile responsive --- */
@media (max-width: 734px) {
  .nav-cmd-kbd {
    display: none;
  }

  .nav-toggle {
    display: flex;
  }

  .nav-links {
    position: fixed;
    top: var(--nav-height);
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-4);
    background: var(--color-nav-bg);
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    opacity: 0;
    pointer-events: none;
    transform: translateY(-8px);
    transform-origin: top center;
    transition: opacity var(--duration-base) var(--ease-out),
                transform var(--duration-base) var(--ease-out);
  }

  .nav-links.open {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }

  .nav-link {
    font-size: 18px;
    padding: 12px 24px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
}

@media (max-width: 734px) and (prefers-reduced-motion: reduce) {
  .nav-links {
    transform: none;
    transition: opacity var(--duration-fast) ease;
  }
}
</style>
