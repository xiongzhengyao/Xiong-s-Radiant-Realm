<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <p class="hero-eyebrow animate-fade-in-up">{{ $t('home.subtitle') }}</p>
        <h1 class="hero-title animate-fade-in-up" style="animation-delay: 0.1s">
          {{ $t('home.welcome') }}
        </h1>
        <div class="hero-actions animate-fade-in-up" style="animation-delay: 0.25s">
          <button class="btn btn-primary" @click="$router.push('/blog')">
            {{ $t('home.viewProjects') }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
          <button class="btn btn-outline" @click="$router.push('/about')">
            {{ $t('about.title') }}
          </button>
        </div>
      </div>
      <div class="hero-scroll-hint animate-fade-in" style="animation-delay: 0.6s">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </section>

    <!-- Skills -->
    <section class="section skills-section">
      <div class="container">
        <div class="section-header reveal">
          <h2>{{ $t('home.skills.title') }}</h2>
        </div>
        <div class="skills-grid">
          <div class="skill-card reveal" v-for="(skill, index) in skills" :key="skill.key" :class="'reveal-delay-' + (index + 1)">
            <div class="skill-icon" :style="{ background: skill.gradient }">
              <svg v-html="skill.svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></svg>
            </div>
            <h3>{{ $t(`home.skills.${skill.key}.name`) }}</h3>
            <p>{{ $t(`home.skills.${skill.key}.description`) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section cta-section">
      <div class="container">
        <div class="cta-content reveal">
          <h2>{{ $t('home.blog.title') }}</h2>
          <p>探索技术博客，发现嵌入式开发、Camera 驱动与 Linux 系统的深度文章。</p>
          <button class="btn btn-primary" @click="$router.push('/blog')">
            {{ $t('home.blog.readMore') }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const skills = [
  {
    key: 'embedded',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    svg: '<rect x="4" y="4" width="16" height="16" rx="2"/><line x1="9" y1="9" x2="9" y2="9.01"/><line x1="15" y1="9" x2="15" y2="9.01"/><path d="M9 15h6"/>'
  },
  {
    key: 'image',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    svg: '<circle cx="12" cy="12" r="3.5"/><path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12z"/>'
  },
  {
    key: 'linux',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    svg: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>'
  }
]

let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        }
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  )
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
.home {
  padding-top: var(--nav-height);
}

/* --- Hero --- */
.hero {
  min-height: calc(100vh - var(--nav-height));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: var(--color-hero-bg);
  color: var(--color-hero-text);
  padding: var(--space-16) var(--space-6);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0, 113, 227, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 70% 60%, rgba(100, 80, 200, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 720px;
}

.hero-eyebrow {
  font-size: 17px;
  font-weight: 400;
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-4);
  letter-spacing: 0.02em;
}

.hero-title {
  font-size: clamp(40px, 7vw, 72px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.035em;
  color: var(--color-hero-text);
  margin-bottom: var(--space-10);
  background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.7) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

html.dark .hero-title {
  background: linear-gradient(180deg, #f5f5f7 0%, rgba(245, 245, 247, 0.65) 100%);
  -webkit-background-clip: text;
  background-clip: text;
}

.hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.hero .btn-primary {
  font-size: 17px;
  padding: 14px 28px;
}

.hero .btn-outline {
  color: rgba(255, 255, 255, 0.8);
  border-color: rgba(255, 255, 255, 0.3);
  font-size: 17px;
  padding: 14px 28px;
}

.hero .btn-outline:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.5);
}

.hero-scroll-hint {
  position: absolute;
  bottom: var(--space-8);
  color: rgba(255, 255, 255, 0.3);
  animation: float 2.5s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

/* --- Skills --- */
.skills-section {
  background: var(--color-bg);
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.section-header h2 {
  margin-bottom: var(--space-3);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

.skill-card {
  text-align: center;
  padding: var(--space-10) var(--space-6);
  background: var(--color-card-bg);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  transition: transform var(--duration-base) var(--ease-out),
              box-shadow var(--duration-base) var(--ease-out);
}

.skill-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.skill-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-5);
}

.skill-card h3 {
  font-size: 20px;
  margin-bottom: var(--space-2);
}

.skill-card p {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* --- CTA --- */
.cta-section {
  background: var(--color-bg-secondary);
}

.cta-content {
  text-align: center;
  max-width: 560px;
  margin: 0 auto;
}

.cta-content h2 {
  margin-bottom: var(--space-4);
}

.cta-content p {
  font-size: 17px;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-8);
  line-height: 1.58;
}

/* --- Responsive --- */
@media (max-width: 734px) {
  .skills-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .skill-card {
    padding: var(--space-6);
  }

  .hero-actions {
    flex-direction: column;
  }

  .hero .btn-primary,
  .hero .btn-outline {
    width: 100%;
    max-width: 280px;
  }
}

@media (min-width: 735px) and (max-width: 1068px) {
  .skills-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-4);
  }
}
</style>
