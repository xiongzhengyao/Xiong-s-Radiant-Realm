<template>
  <ErrorBoundary>
    <div class="app-wrapper">
      <!-- 导航栏 -->
      <el-menu
        mode="horizontal"
        :router="true"
        :ellipsis="false"
        class="nav-menu"
        :default-active="$route.path"
      >
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          {{ $t('nav.home') }}
        </el-menu-item>

        <el-menu-item index="/about">
          <el-icon><User /></el-icon>
          {{ $t('nav.about') }}
        </el-menu-item>

        <el-menu-item index="/blog">
          <el-icon><Document /></el-icon>
          {{ $t('nav.blog') }}
        </el-menu-item>

        <el-menu-item index="/life">
          <el-icon><Coffee /></el-icon>
          {{ $t('nav.life') }}
        </el-menu-item>

        <el-menu-item index="/contact">
          <el-icon><Message /></el-icon>
          {{ $t('nav.contact') }}
        </el-menu-item>

        <div class="flex-grow" />

        <div class="nav-controls">
          <el-button-group class="lang-switch">
            <el-button :type="currentLocale === 'zh' ? 'primary' : ''" @click="changeLocale('zh')">
              中
            </el-button>
            <el-button :type="currentLocale === 'en' ? 'primary' : ''" @click="changeLocale('en')">
              En
            </el-button>
          </el-button-group>

          <el-switch
            v-model="isDark"
            class="theme-switch"
            inline-prompt
            :active-icon="Moon"
            :inactive-icon="Sunny"
            @change="toggleTheme"
          />
        </div>
      </el-menu>

      <!-- 主要内容区域 -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>

      <!-- 页脚 -->
      <footer class="app-footer">
        <div class="footer-content">
          <p>&copy; 2025 个人网站. All rights reserved.</p>
          <div class="footer-links">
            <a href="#">隐私政策</a>
            <span class="divider">|</span>
            <a href="#">使用条款</a>
          </div>
        </div>
      </footer>
    </div>
  </ErrorBoundary>
</template>

<script setup>
import { computed } from 'vue'
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/composables/useTheme'

const { locale } = useI18n()
const { isDark, toggleTheme } = useTheme()
const currentLocale = computed(() => locale.value)

const changeLocale = lang => {
  locale.value = lang
  // 保存语言偏好到 localStorage
  localStorage.setItem('locale', lang)
}
</script>

<style>
/* 全局样式 */
html,
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

/* 深色模式样式 */
html.dark {
  color-scheme: dark;
}
</style>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.flex-grow {
  flex-grow: 1;
}

.theme-switch {
  margin: 0 20px;
}

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 页脚样式 */
.app-footer {
  margin-top: auto;
  background-color: #f5f7fa;
  padding: 20px 0;
  text-align: center;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-links {
  margin-top: 10px;
}

.footer-links a {
  color: #606266;
  text-decoration: none;
  margin: 0 10px;
}

.footer-links a:hover {
  color: #409eff;
}

.divider {
  color: #dcdfe6;
}

/* 为路由视图添加上边距，避免被固定导航栏遮挡 */
:deep(router-view) {
  margin-top: 60px;
}
</style>
