<template>
  <div v-if="hasError" class="error-boundary">
    <el-result icon="error" title="页面加载出错" sub-title="抱歉，页面遇到了一些问题，请刷新重试">
      <template #extra>
        <el-button type="primary" @click="handleReset"> 重新加载 </el-button>
        <el-button @click="goHome"> 返回首页 </el-button>
      </template>
    </el-result>
    <div v-if="errorInfo" class="error-details">
      <el-collapse>
        <el-collapse-item title="错误详情（开发环境）" name="1">
          <pre>{{ errorInfo }}</pre>
        </el-collapse-item>
      </el-collapse>
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
  errorInfo.value = `错误信息: ${err.message}\n组件: ${info}\n堆栈: ${err.stack}`
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.error-details {
  margin-top: 20px;
  max-width: 800px;
  width: 100%;
}

.error-details pre {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.5;
}
</style>
