<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-card">
      <h1>{{ $t('error.title') }}</h1>
      <p>{{ $t('error.subtitle') }}</p>
      <div class="error-actions">
        <button class="btn btn-primary" type="button" @click="handleReset">{{ $t('error.reload') }}</button>
        <button class="btn btn-outline" type="button" @click="goHome">{{ $t('error.home') }}</button>
      </div>
      <details v-if="errorInfo" class="error-details">
        <summary>{{ $t('error.details') }}</summary>
        <pre>{{ errorInfo }}</pre>
      </details>
    </div>
  </div>
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const hasError = ref(false)
const errorInfo = ref('')

onErrorCaptured((err, instance, info) => {
  hasError.value = true
  errorInfo.value = `${err.message}\n${info}\n${err.stack || ''}`
  console.error('ErrorBoundary caught an error:', err, info)
  return false
})

const handleReset = () => {
  hasError.value = false
  errorInfo.value = ''
  window.location.reload()
}

const goHome = () => {
  router.push('/')
  handleReset()
}
</script>

<style scoped>
.error-boundary {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  background: var(--color-bg);
}

.error-card {
  max-width: 480px;
  width: 100%;
  padding: var(--space-10);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  text-align: center;
}

.error-card h1 {
  font-size: 24px;
  margin-bottom: var(--space-3);
}

.error-card p {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
}

.error-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  flex-wrap: wrap;
}

.error-details {
  margin-top: var(--space-6);
  text-align: left;
}

.error-details pre {
  margin-top: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  font-size: 12px;
  overflow-x: auto;
}
</style>
