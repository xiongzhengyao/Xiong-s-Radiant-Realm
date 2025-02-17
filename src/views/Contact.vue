<template>
  <div class="contact">
    <el-row justify="center">
      <el-col :span="16">
        <h1>{{ $t('contact.title') }}</h1>
        
        <el-row :gutter="30">
          <!-- 联系信息 -->
          <el-col :span="10">
            <div class="contact-info">
              <h2>{{ $t('contact.info.title') }}</h2>
              <div class="info-item">
                <el-icon><Location /></el-icon>
                <span>{{ $t('contact.info.address') }}</span>
              </div>
              <div class="info-item">
                <el-icon><Message /></el-icon>
                <span>xiongzhengyao163@163.com</span>
              </div>
              <div class="info-item">
                <el-icon><Phone /></el-icon>
                <span>+86 188 0030 9920</span>
              </div>

              <div class="social-links">
                <h2>{{ $t('contact.info.social') }}</h2>
                <div class="social-icons">
                  <el-tooltip content="GitHub" placement="top"> 
                    <el-button circle type="info" @click="openLink('https://github.com/xiongzhengyao')">
                      <svg height="20" width="20" viewBox="0 0 16 16" class="github-icon">
                        <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                      </svg>
                    </el-button>
                  </el-tooltip>
                  
                  <el-tooltip content="CSDN" placement="top">
                    <el-button circle type="danger" @click="openLink('https://blog.csdn.net/qq_38741583?type=blog')">
                      <svg t="1707579162705" class="csdn-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                        <path d="M512 0c282.784 0 512 229.216 512 512s-229.216 512-512 512S0 794.784 0 512 229.216 0 512 0z m189.952 752l11.2-108.224c-31.904 9.536-100.928 16.128-147.712 16.128-134.464 0-205.728-47.296-195.328-146.304 11.584-110.688 113.152-145.696 232.64-145.696 54.784 0 122.432 8.8 151.296 18.336L768 272.704C724.544 262.24 678.272 256 599.584 256c-203.2 0-388.704 94.88-406.4 263.488C178.336 660.96 303.584 768 535.616 768c80.672 0 138.464-6.432 166.336-16z" fill="currentColor"/>
                      </svg>
                    </el-button>
                  </el-tooltip>
                  
                  <el-tooltip content="领英" placement="top">
                    <el-button circle type="primary" @click="openLink('https://linkedin.com')">
                      <el-icon><Connection /></el-icon>
                    </el-button>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </el-col>

          <!-- 联系表单 -->
          <el-col :span="14">
            <el-form
              ref="formRef"
              :model="form"
              :rules="rules"
              label-position="top"
            >
              <el-form-item :label="$t('contact.form.name')" prop="name">
                <el-input v-model="form.name" />
              </el-form-item>

              <el-form-item :label="$t('contact.form.email')" prop="email">
                <el-input v-model="form.email" />
              </el-form-item>

              <el-form-item :label="$t('contact.form.subject')" prop="subject">
                <el-input v-model="form.subject" />
              </el-form-item>

              <el-form-item :label="$t('contact.form.message')" prop="message">
                <el-input
                  v-model="form.message"
                  type="textarea"
                  :rows="4"
                />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="submitForm(formRef)">
                  {{ $t('contact.form.submit') }}
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <!-- 地图区域 -->
        <div class="map-container">
          <h2>{{ $t('contact.info.location') }}</h2>
          <div class="map-placeholder">
            {{ $t('contact.info.location') }}
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const formRef = ref()
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const openLink = (url) => {
  window.open(url, '_blank')
}

const { t } = useI18n()

const rules = {
  name: [
    { required: true, message: () => t('contact.form.required') + ' ' + t('contact.form.name'), trigger: 'blur' },
    { min: 2, message: () => t('contact.form.name') + '长度至少为2个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: () => t('contact.form.required') + ' ' + t('contact.form.email'), trigger: 'blur' },
    { type: 'email', message: () => '请输入正确的' + t('contact.form.email'), trigger: 'blur' }
  ],
  subject: [
    { required: true, message: () => t('contact.form.required') + ' ' + t('contact.form.subject'), trigger: 'blur' },
    { min: 2, message: () => t('contact.form.subject') + '长度至少为2个字符', trigger: 'blur' }
  ],
  message: [
    { required: true, message: () => t('contact.form.required') + ' ' + t('contact.form.message'), trigger: 'blur' },
    { min: 10, message: () => t('contact.form.message') + '长度至少为10个字符', trigger: 'blur' }
  ]
}

const submitForm = async (formEl) => {
  if (!formEl) return

  await formEl.validate((valid, fields) => {
    if (valid) {
      ElMessage.success(t('contact.form.success'))
      formEl.resetFields()
    } else {
      console.log('验证失败', fields)
    }
  })
}
</script>

<style scoped>
.contact {
  padding: 4rem 0;
  background-color: #f5f7fa;
  min-height: 100vh;
}

h1 {
  text-align: center;
  margin-bottom: 3rem;
  color: #303133;
}

h2 {
  color: #303133;
  margin-bottom: 1.5rem;
}

.contact-info {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: #606266;
}

.info-item .el-icon {
  margin-right: 1rem;
  color: #409EFF;
}

.social-links {
  margin-top: 2rem;
}

.social-icons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-icons .el-button {
  width: 40px;
  height: 40px;
}

.social-icons .el-icon {
  font-size: 1.2em;
}

.github-icon, .csdn-icon {
  margin-top: 2px;
}

.map-container {
  margin-top: 4rem;
}

.map-placeholder {
  width: 100%;
  height: 300px;
  background-color: #e5e9f2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  border-radius: 8px;
}

:deep(.el-form-item__label) {
  font-weight: bold;
}
</style>
