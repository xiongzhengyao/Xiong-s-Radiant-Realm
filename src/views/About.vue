<template>
  <div class="about">
    <el-row justify="center">
      <el-col :span="16">
        <div class="profile-container">
          <!-- 个人照片和基本信息 -->
          <div class="profile-header">
            <div class="profile-image-container">
              <el-image
                class="profile-image"
                src="/images/profile.jpg"
                :preview-src-list="['/images/profile.jpg']"
                fit="cover"
                loading="lazy"
              >
                <template #error>
                  <div class="image-placeholder">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </div>
            
            <div class="profile-info">
              <h1>熊正耀</h1>
              <p class="title">Camera驱动软件工程师</p>
              <p class="bio">专注于Camera驱动开发，热衷于探索新技术和解决复杂问题。</p>
              
              <div class="profile-stats">
                <div class="stat-item">
                  <el-icon><Timer /></el-icon>
                  <span>2年工作经验</span>
                </div>
                <div class="stat-item">
                  <el-icon><Location /></el-icon>
                  <span>中国，上海</span>
                </div>
                <div class="stat-item">
                  <el-icon><Message /></el-icon>
                  <span>xiongzhengyao163@163.com</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 技能和专长 -->
          <div class="section">
            <h2>专业技能</h2>
            <div class="skills-container">
              <div class="skill-group">
                <h3>编程语言</h3>
                <div class="skill-items">
                  <el-tag>C/C++</el-tag>
                  <el-tag>Python</el-tag>
                  <el-tag>Shell</el-tag>
                </div>
              </div>
              
              <div class="skill-group">
                <h3>嵌入式开发</h3>
                <div class="skill-items">
                  <el-tag type="success">ARM</el-tag>
                  <el-tag type="success">Linux驱动</el-tag>
                  <el-tag type="success">RTOS</el-tag>
                </div>
              </div>
              
              <div class="skill-group">
                <h3>开发工具</h3>
                <div class="skill-items">
                  <el-tag type="warning">Git</el-tag>
                  <el-tag type="warning">VSCode</el-tag>
                  <el-tag type="warning">Eclipse</el-tag>
                </div>
              </div>
            </div>
          </div>

          <!-- 工作经历 -->
          <div class="section">
            <h2>工作经历</h2>
            <el-timeline>
              <el-timeline-item
                v-for="(experience, index) in workExperience"
                :key="index"
                :timestamp="experience.period"
                placement="top"
              >
                <el-card>
                  <h3>{{ experience.position }}</h3>
                  <h4>{{ experience.company }}</h4>
                  <p>{{ experience.description }}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>

          <!-- 教育经历 -->
          <div class="section">
            <h2>教育经历</h2>
            <el-timeline>
              <el-timeline-item
                v-for="(education, index) in educationHistory"
                :key="index"
                :timestamp="education.period"
                placement="top"
              >
                <el-card>
                  <h3>{{ education.degree }}</h3>
                  <h4>{{ education.school }}</h4>
                  <p>{{ education.major }}</p>
                  <p class="education-details">{{ education.details }}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Picture, Timer, Location, Message } from '@element-plus/icons-vue'

const workExperience = [
  {
    period: '2022.08 - 至今',
    position: 'Camera驱动软件工程师',
    company: '小米',
    description: '负责Camera驱动开发，包括Camera驱动开发、系统优化等工作。'
  },
  {
    period: '2021.09 - 2022.03',
    position: '嵌入式软件工程师',
    company: '博世(中国)投资有限公司',
    description: '负责嵌入式系统开发，包括大模型部署、图像采集处理、系统优化等工作。'
  }
]

const educationHistory = [
  {
    period: '2019.09 - 2022.06',
    degree: '硕士研究生',
    school: '上海大学',
    major: '机械工程',
    details: '研究方向：机械制造及其自动化'
  },
  {
    period: '2015.09 - 2019.06',
    degree: '学士',
    school: '南京航空航天大学金城学院',
    major: '车辆工程',
    details: '主修课程：C语言、C++、数字信号处理、嵌入式系统、汽车原理等'
  }
]
</script>

<style scoped>
.about {
  padding: 4rem 0;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.profile-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.profile-header {
  display: flex;
  gap: 3rem;
  margin-bottom: 3rem;
}

.profile-image-container {
  flex-shrink: 0;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #909399;
}

.profile-info {
  flex-grow: 1;
}

.profile-info h1 {
  margin: 0 0 0.5rem 0;
  color: #303133;
}

.profile-info .title {
  font-size: 1.2rem;
  color: #409EFF;
  margin-bottom: 1rem;
}

.profile-info .bio {
  color: #606266;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.profile-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #606266;
}

.section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #ebeef5;
}

.section h2 {
  color: #303133;
  margin-bottom: 1.5rem;
}

.skills-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.skill-group h3 {
  color: #606266;
  margin-bottom: 1rem;
}

.skill-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

:deep(.el-timeline-item__node) {
  background-color: #409EFF;
}

:deep(.el-timeline-item__timestamp) {
  color: #909399;
}

.el-card {
  margin-bottom: 1rem;
}

.el-card h3 {
  color: #303133;
  margin: 0 0 0.5rem 0;
}

.el-card h4 {
  color: #606266;
  margin: 0 0 0.5rem 0;
  font-weight: normal;
}

.el-card p {
  color: #606266;
  margin: 0;
  line-height: 1.6;
}

.education-details {
  color: #67c23a;  /* 使用绿色突出显示研究方向/主修课程 */
  margin-top: 0.5rem;
  font-size: 0.9em;
}

/* 调整卡片内容的间距 */
.el-card h3 {
  margin-bottom: 0.5rem;
}

.el-card h4 {
  margin-bottom: 0.5rem;
}

.el-card p {
  margin-bottom: 0.3rem;
}
</style>
