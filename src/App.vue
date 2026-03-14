<template>
  <ErrorBoundary>
    <div class="app" :class="{ 'is-scrolled': isScrolled }">
      <!-- Navigation -->
      <nav class="nav glass" role="navigation">
        <div class="nav-inner">
          <router-link to="/" class="nav-logo">XZY</router-link>

          <button class="nav-toggle" :class="{ active: mobileMenuOpen }" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Toggle menu">
            <span></span><span></span>
          </button>

          <div class="nav-links" :class="{ open: mobileMenuOpen }">
            <router-link v-for="link in navLinks" :key="link.path" :to="link.path" class="nav-link" @click="mobileMenuOpen = false">
              {{ $t(link.label) }}
            </router-link>
          </div>

          <div class="nav-actions">
            <button class="nav-action-btn" @click="toggleLocale" :title="currentLocale === 'zh' ? 'English' : '中文'">
              {{ currentLocale === 'zh' ? 'En' : '中' }}
            </button>
            <button class="nav-action-btn theme-toggle" @click="toggleTheme(!isDark)" :title="isDark ? 'Light mode' : 'Dark mode'">
              <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main>
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-inner container">
          <div class="footer-grid">
            <div class="footer-col">
              <h4 class="footer-heading">探索</h4>
              <router-link to="/" class="footer-link">{{ $t('nav.home') }}</router-link>
              <router-link to="/blog" class="footer-link">{{ $t('nav.blog') }}</router-link>
              <router-link to="/life" class="footer-link">{{ $t('nav.life') }}</router-link>
            </div>
            <div class="footer-col">
              <h4 class="footer-heading">关于</h4>
              <router-link to="/about" class="footer-link">{{ $t('nav.about') }}</router-link>
              <router-link to="/contact" class="footer-link">{{ $t('nav.contact') }}</router-link>
            </div>
            <div class="footer-col">
              <h4 class="footer-heading">社交</h4>
              <a href="https://github.com/xiongzhengyao" target="_blank" rel="noopener" class="footer-link">GitHub</a>
              <a href="https://blog.csdn.net/qq_38741583" target="_blank" rel="noopener" class="footer-link">CSDN</a>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; {{ new Date().getFullYear() }} Xiong Zhengyao. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  </ErrorBoundary>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/composables/useTheme'

const { locale } = useI18n()
const { isDark, toggleTheme } = useTheme()
const currentLocale = computed(() => locale.value)
const mobileMenuOpen = ref(false)
const isScrolled = ref(false)

const navLinks = [
  { path: '/', label: 'nav.home' },
  { path: '/about', label: 'nav.about' },
  { path: '/blog', label: 'nav.blog' },
  { path: '/life', label: 'nav.life' },
  { path: '/contact', label: 'nav.contact' },
]

const toggleLocale = () => {
  const next = locale.value === 'zh' ? 'en' : 'zh'
  locale.value = next
  localStorage.setItem('locale', next)
}

const onScroll = () => {
  isScrolled.value = window.scrollY > 8
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
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
</style>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
}

/* --- Navigation --- */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: var(--nav-height);
  border-bottom: 1px solid var(--color-divider);
  transition: border-color var(--duration-base) var(--ease-out),
              box-shadow var(--duration-base) var(--ease-out);
}

.is-scrolled .nav {
  border-bottom-color: var(--color-border);
  box-shadow: var(--shadow-xs);
}

.nav-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 22px;
  gap: var(--space-1);
}

.nav-logo {
  font-size: 21px;
  font-weight: 700;
  color: var(--color-text);
  text-decoration: none;
  letter-spacing: -0.03em;
  margin-right: auto;
  transition: opacity var(--duration-fast);
}

.nav-logo:hover {
  opacity: 0.7;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0;
}

.nav-link {
  font-size: 14px;
  font-weight: 400;
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  transition: color var(--duration-fast) var(--ease-out),
              background var(--duration-fast) var(--ease-out);
  white-space: nowrap;
}

.nav-link:hover {
  color: var(--color-text);
}

.nav-link.router-link-exact-active {
  color: var(--color-text);
  font-weight: 500;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin-left: auto;
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
  font-weight: 500;
  font-family: var(--font-sans);
  transition: color var(--duration-fast), background var(--duration-fast);
}

.nav-action-btn:hover {
  color: var(--color-text);
  background: var(--color-accent-light);
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

/* --- Page transition --- */
.page-enter-active,
.page-leave-active {
  transition: opacity var(--duration-base) var(--ease-out);
}

.page-enter-from {
  opacity: 0;
}

.page-leave-to {
  opacity: 0;
}

/* --- Footer --- */
.footer {
  margin-top: auto;
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
  padding: var(--space-12) 0 var(--space-8);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
  margin-bottom: var(--space-10);
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
  transition: color var(--duration-fast);
  line-height: 1.5;
}

.footer-link:hover {
  color: var(--color-accent);
}

.footer-bottom {
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border);
}

.footer-bottom p {
  font-size: 13px;
  color: var(--color-text-tertiary);
  margin: 0;
}

/* --- Mobile responsive --- */
@media (max-width: 734px) {
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
    transition: opacity var(--duration-base) var(--ease-out);
  }

  .nav-links.open {
    opacity: 1;
    pointer-events: auto;
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
</style>
