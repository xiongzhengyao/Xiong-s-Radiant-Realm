<template>
  <div class="contact">
    <!-- Header -->
    <section class="contact-hero">
      <div class="container-narrow">
        <h1 class="reveal">{{ $t('contact.title') }}</h1>
        <p class="contact-hero-sub reveal reveal-delay-1">
          期待与你的交流。无论是技术讨论还是项目合作，都欢迎联系。
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container-narrow">
        <div class="contact-grid">
          <!-- Contact Info -->
          <div class="contact-info reveal">
            <h2>{{ $t('contact.info.title') }}</h2>

            <div class="info-list">
              <div class="info-row">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{{ $t('contact.info.address') }}</span>
              </div>
              <div class="info-row">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>xiongzhengyao163@163.com</span>
              </div>
              <div class="info-row">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>+86 188 0030 9920</span>
              </div>
            </div>

            <div class="social-section">
              <h3>{{ $t('contact.info.social') }}</h3>
              <div class="social-links">
                <a href="https://github.com/xiongzhengyao" target="_blank" rel="noopener" class="social-link" title="GitHub">
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
                </a>
                <a href="https://blog.csdn.net/qq_38741583" target="_blank" rel="noopener" class="social-link" title="CSDN">
                  <svg width="20" height="20" viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 0c282.784 0 512 229.216 512 512s-229.216 512-512 512S0 794.784 0 512 229.216 0 512 0z m189.952 752l11.2-108.224c-31.904 9.536-100.928 16.128-147.712 16.128-134.464 0-205.728-47.296-195.328-146.304 11.584-110.688 113.152-145.696 232.64-145.696 54.784 0 122.432 8.8 151.296 18.336L768 272.704C724.544 262.24 678.272 256 599.584 256c-203.2 0-388.704 94.88-406.4 263.488C178.336 660.96 303.584 768 535.616 768c80.672 0 138.464-6.432 166.336-16z"/></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener" class="social-link" title="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="contact-form-wrap reveal reveal-delay-1">
            <h2>发送消息</h2>
            <form @submit.prevent="submitForm" class="contact-form">
              <div class="form-group">
                <label>{{ $t('contact.form.name') }}</label>
                <input
                  v-model="form.name"
                  type="text"
                  :placeholder="$t('contact.form.name')"
                  required
                />
              </div>
              <div class="form-group">
                <label>{{ $t('contact.form.email') }}</label>
                <input
                  v-model="form.email"
                  type="email"
                  :placeholder="$t('contact.form.email')"
                  required
                />
              </div>
              <div class="form-group">
                <label>{{ $t('contact.form.subject') }}</label>
                <input
                  v-model="form.subject"
                  type="text"
                  :placeholder="$t('contact.form.subject')"
                  required
                />
              </div>
              <div class="form-group">
                <label>{{ $t('contact.form.message') }}</label>
                <textarea
                  v-model="form.message"
                  rows="5"
                  :placeholder="$t('contact.form.message')"
                  required
                ></textarea>
              </div>
              <button type="submit" class="btn btn-primary submit-btn" :disabled="isSubmitting">
                <span v-if="isSubmitting">发送中...</span>
                <span v-else>{{ $t('contact.form.submit') }}</span>
                <svg v-if="!isSubmitting" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const isSubmitting = ref(false)

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitForm = async () => {
  if (!form.name || !form.email || !form.message) return
  try {
    isSubmitting.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success(t('contact.form.success'))
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  } catch {
    ElMessage.error(t('contact.form.error'))
  } finally {
    isSubmitting.value = false
  }
}

let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible') }),
    { threshold: 0.1 }
  )
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
})

onUnmounted(() => { observer?.disconnect() })
</script>

<style scoped>
.contact {
  padding-top: var(--nav-height);
  min-height: 100vh;
  background: var(--color-bg);
}

/* --- Hero --- */
.contact-hero {
  padding: var(--space-20) 0 var(--space-8);
  text-align: center;
}

.contact-hero h1 {
  font-size: clamp(32px, 5vw, 48px);
  margin-bottom: var(--space-3);
}

.contact-hero-sub {
  font-size: 19px;
  color: var(--color-text-secondary);
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.58;
}

/* --- Grid --- */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: var(--space-10);
  align-items: start;
}

.contact-info h2,
.contact-form-wrap h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: var(--space-6);
}

/* --- Info --- */
.info-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.info-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: 15px;
  color: var(--color-text-secondary);
}

.info-row svg {
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.social-section {
  margin-top: var(--space-10);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border);
}

.social-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: var(--space-4);
}

.social-links {
  display: flex;
  gap: var(--space-3);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  transition: all var(--duration-fast) var(--ease-out);
}

.social-link:hover {
  background: var(--color-accent);
  color: #fff;
  transform: translateY(-2px);
}

/* --- Form --- */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
}

.form-group input,
.form-group textarea {
  padding: 12px 16px;
  font-size: 15px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-input-border);
  background: var(--color-input-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-input-focus);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--color-text-tertiary);
}

.submit-btn {
  width: 100%;
  font-size: 17px;
  padding: 14px 24px;
  margin-top: var(--space-2);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* --- Responsive --- */
@media (max-width: 734px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: var(--space-10);
  }

  .contact-hero {
    padding: var(--space-12) 0 var(--space-6);
  }
}
</style>
