<template>
  <div class="contact">
    <el-row justify="center">
      <el-col :xs="22" :sm="20" :md="18" :lg="16" :xl="14">
        <h1 class="page-title">{{ $t('contact.title') }}</h1>
        
        <el-row :gutter="30">
          <!-- 联系信息卡片 -->
          <el-col :xs="24" :sm="24" :md="10">
            <el-card class="contact-info" :body-style="{ padding: '2rem' }">
              <h2 class="section-title">{{ $t('contact.info.title') }}</h2>
              <div class="info-list">
                <div class="info-item" v-for="(item, index) in contactInfo" :key="index">
                  <el-icon class="info-icon"><component :is="item.icon" /></el-icon>
                  <span>{{ item.value }}</span>
                </div>
              </div>

              <div class="social-links">
                <h2 class="section-title">{{ $t('contact.info.social') }}</h2>
                <div class="social-icons">
                  <el-tooltip 
                    v-for="(social, index) in socialLinks" 
                    :key="index"
                    :content="social.name" 
                    placement="top"
                  >
                    <el-button 
                      circle 
                      :type="social.type" 
                      @click="openLink(social.url)"
                      class="social-button"
                    >
                      <component :is="social.icon" v-if="social.isComponent" />
                      <svg v-else :viewBox="social.viewBox" class="social-svg">
                        <path :d="social.path" fill="currentColor" />
                      </svg>
                    </el-button>
                  </el-tooltip>
                </div>
              </div>
            </el-card>
          </el-col>

          <!-- 联系表单 -->
          <el-col :xs="24" :sm="24" :md="14">
            <el-card :body-style="{ padding: '2rem' }">
              <el-form
                ref="formRef"
                :model="form"
                :rules="rules"
                label-position="top"
                @submit.prevent="submitForm(formRef)"
              >
                <el-form-item :label="$t('contact.form.name')" prop="name">
                  <el-input 
                    v-model="form.name"
                    :placeholder="$t('contact.form.namePlaceholder')"
                  />
                </el-form-item>

                <el-form-item :label="$t('contact.form.email')" prop="email">
                  <el-input 
                    v-model="form.email"
                    :placeholder="$t('contact.form.emailPlaceholder')"
                  />
                </el-form-item>

                <el-form-item :label="$t('contact.form.subject')" prop="subject">
                  <el-input 
                    v-model="form.subject"
                    :placeholder="$t('contact.form.subjectPlaceholder')"
                  />
                </el-form-item>

                <el-form-item :label="$t('contact.form.message')" prop="message">
                  <el-input
                    v-model="form.message"
                    type="textarea"
                    :rows="4"
                    :placeholder="$t('contact.form.messagePlaceholder')"
                  />
                </el-form-item>

                <el-form-item>
                  <el-button 
                    type="primary" 
                    native-type="submit"
                    :loading="isSubmitting"
                    class="submit-button"
                  >
                    {{ $t('contact.form.submit') }}
                  </el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
        </el-row>

        <!-- 地图区域 -->
        <el-card class="map-section">
          <template #header>
            <h2 class="section-title">{{ $t('contact.info.location') }}</h2>
          </template>
          <div class="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=your-map-embed-url"
              width="100%" 
              height="400" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Location, Message, Phone, Connection } from '@element-plus/icons-vue'

const { t } = useI18n()
const formRef = ref()
const isSubmitting = ref(false)

// 联系信息数据
const contactInfo = [
  { icon: 'Location', value: t('contact.info.address') },
  { icon: 'Message', value: 'xiongzhengyao163@163.com' },
  { icon: 'Phone', value: '+86 188 0030 9920' }
]

// 社交媒体链接数据
const socialLinks = [
  {
    name: 'GitHub',
    type: 'info',
    url: 'https://github.com/xiongzhengyao',
    isComponent: false,
    viewBox: '0 0 16 16',
    path: 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z'
  },
  {
    name: 'CSDN',
    type: 'danger',
    url: 'https://blog.csdn.net/qq_38741583?type=blog',
    isComponent: false,
    viewBox: '0 0 1024 1024',
    path: 'M512 0c282.784 0 512 229.216 512 512s-229.216 512-512 512S0 794.784 0 512 229.216 0 512 0z m189.952 752l11.2-108.224c-31.904 9.536-100.928 16.128-147.712 16.128-134.464 0-205.728-47.296-195.328-146.304 11.584-110.688 113.152-145.696 232.64-145.696 54.784 0 122.432 8.8 151.296 18.336L768 272.704C724.544 262.24 678.272 256 599.584 256c-203.2 0-388.704 94.88-406.4 263.488C178.336 660.96 303.584 768 535.616 768c80.672 0 138.464-6.432 166.336-16z'
  },
  {
    name: '领英',
    type: 'primary',
    url: 'https://linkedin.com',
    isComponent: true,
    icon: Connection
  }
]

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const rules = {
  name: [
    { required: true, message: () => t('contact.form.required') + t('contact.form.name'), trigger: 'blur' },
    { min: 2, message: () => t('contact.form.name') + t('contact.form.minLength', { length: 2 }), trigger: 'blur' }
  ],
  email: [
    { required: true, message: () => t('contact.form.required') + t('contact.form.email'), trigger: 'blur' },
    { type: 'email', message: () => t('contact.form.invalidEmail'), trigger: 'blur' }
  ],
  subject: [
    { required: true, message: () => t('contact.form.required') + t('contact.form.subject'), trigger: 'blur' },
    { min: 2, message: () => t('contact.form.subject') + t('contact.form.minLength', { length: 2 }), trigger: 'blur' }
  ],
  message: [
    { required: true, message: () => t('contact.form.required') + t('contact.form.message'), trigger: 'blur' },
    { min: 10, message: () => t('contact.form.message') + t('contact.form.minLength', { length: 10 }), trigger: 'blur' }
  ]
}

const openLink = (url) => {
  window.open(url, '_blank', 'noopener noreferrer')
}

const submitForm = async (formEl) => {
  if (!formEl) return
  
  try {
    isSubmitting.value = true
    await formEl.validate()
    
    // TODO: 实现表单提交逻辑
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
    
    ElMessage.success(t('contact.form.success'))
    formEl.resetFields()
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error(t('contact.form.error'))
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.contact {
  padding: 2rem 1rem;
  background-color: var(--el-bg-color-page);
  min-height: calc(100vh - var(--el-header-height, 60px));
}

.page-title {
  text-align: center;
  margin-bottom: 3rem;
  color: var(--el-text-color-primary);
  font-size: 2.5rem;
  font-weight: 600;
}

.section-title {
  color: var(--el-text-color-primary);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 500;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  color: var(--el-text-color-regular);
}

.info-icon {
  margin-right: 1rem;
  font-size: 1.2rem;
  color: var(--el-color-primary);
}

.social-links {
  margin-top: 2.5rem;
}

.social-icons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.social-button {
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.social-button:hover {
  transform: translateY(-2px);
}

.social-svg {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}

.submit-button {
  width: 100%;
  margin-top: 1rem;
  height: 40px;
  font-size: 1rem;
}

.map-section {
  margin-top: 3rem;
}

.map-container {
  width: 100%;
  height: 400px;
  border-radius: var(--el-border-radius-base);
  overflow: hidden;
}

@media (max-width: 768px) {
  .contact {
    padding: 1rem;
  }

  .page-title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .el-col {
    margin-bottom: 1.5rem;
  }

  .map-container {
    height: 300px;
  }
}
</style>
