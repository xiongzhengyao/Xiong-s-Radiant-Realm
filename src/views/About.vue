<template>
  <div class="about">
    <!-- Profile Header -->
    <section class="profile-hero">
      <div class="container-narrow">
        <div class="profile-top reveal">
          <div class="avatar-wrapper">
            <img
              v-if="!imageError"
              class="avatar"
              src="/images/profile.jpg"
              alt="熊正耀"
              @error="handleImageError"
            />
            <div v-else class="avatar-fallback">ZY</div>
          </div>
          <h1>熊正耀</h1>
          <p class="profile-title">Camera 驱动软件工程师</p>
          <p class="profile-bio">
            专注于 Camera 驱动开发，热衷于探索新技术和解决复杂问题。
          </p>
          <div class="profile-meta">
            <span class="meta-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              上海
            </span>
            <span class="meta-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              3 年+工作经验
            </span>
            <span class="meta-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              xiongzhengyao163@163.com
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills -->
    <section class="section">
      <div class="container-narrow">
        <h2 class="about-section-title reveal">专业技能</h2>
        <div class="skills-row">
          <div v-for="(group, idx) in skillGroups" :key="group.name" class="skill-group reveal" :class="'reveal-delay-' + (idx + 1)">
            <h4>{{ group.name }}</h4>
            <div class="skill-tags">
              <span class="tag" v-for="skill in group.items" :key="skill">{{ skill }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Experience -->
    <section class="section" style="background: var(--color-bg-secondary)">
      <div class="container-narrow">
        <h2 class="about-section-title reveal">工作经历</h2>
        <div class="timeline">
          <div v-for="(exp, idx) in workExperience" :key="idx" class="timeline-item reveal" :class="'reveal-delay-' + (idx + 1)">
            <div class="timeline-marker"></div>
            <div class="timeline-card">
              <div class="timeline-header">
                <div>
                  <h3>{{ exp.position }}</h3>
                  <p class="timeline-company">{{ exp.company }}</p>
                </div>
                <span class="timeline-period">{{ exp.period }}</span>
              </div>
              <p class="timeline-desc">{{ exp.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Education -->
    <section class="section">
      <div class="container-narrow">
        <h2 class="about-section-title reveal">教育经历</h2>
        <div class="timeline">
          <div v-for="(edu, idx) in educationHistory" :key="idx" class="timeline-item reveal" :class="'reveal-delay-' + (idx + 1)">
            <div class="timeline-marker"></div>
            <div class="timeline-card">
              <div class="timeline-header">
                <div>
                  <h3>{{ edu.degree }}</h3>
                  <p class="timeline-company">{{ edu.school }} · {{ edu.major }}</p>
                </div>
                <span class="timeline-period">{{ edu.period }}</span>
              </div>
              <p class="timeline-desc">{{ edu.details }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const imageError = ref(false)
const handleImageError = () => { imageError.value = true }

const skillGroups = [
  { name: '编程语言', items: ['C/C++', 'Python', 'Shell'] },
  { name: '嵌入式开发', items: ['ARM', 'Linux 驱动', 'Sensor 驱动'] },
  { name: '开发工具', items: ['Git', 'VSCode', 'Cursor', 'Jira', 'Confluence'] }
]

const workExperience = [
{
    period: '2026.02 - 至今',
    position: 'Camera 驱动软件工程师',
    company: '大疆',
    description: '负责 Camera 驱动开发，包括 Sensor 驱动开发、产线自动化测试等工作。'
  },
  {
    period: '2022.08 - 2026.02',
    position: 'Camera 驱动软件工程师',
    company: '小米',
    description: '负责 Camera 驱动开发，包括 Sensor 驱动开发、性能优化等工作。'
  },
  {
    period: '2021.09 - 2022.03',
    position: '嵌入式软件工程师',
    company: '博世 (中国) 投资有限公司',
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
    details: '主修课程：C 语言、C++、数字信号处理、嵌入式系统、汽车原理等'
  }
]

let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible')
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  )
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
})

onUnmounted(() => { observer?.disconnect() })
</script>

<style scoped>
.about {
  padding-top: var(--nav-height);
}

/* --- Profile Hero --- */
.profile-hero {
  padding: var(--space-20) 0 var(--space-12);
  text-align: center;
  background: var(--color-bg);
}

.profile-top {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-wrapper {
  width: 120px;
  height: 120px;
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-6);
  box-shadow: var(--shadow-lg);
  border: 3px solid var(--color-bg);
  outline: 1px solid var(--color-border);
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 700;
  color: var(--color-text-tertiary);
  background: var(--color-bg-secondary);
}

.profile-top h1 {
  font-size: 36px;
  margin-bottom: var(--space-2);
}

.profile-title {
  font-size: 19px;
  color: var(--color-accent);
  font-weight: 500;
  margin-bottom: var(--space-4);
}

.profile-bio {
  font-size: 17px;
  color: var(--color-text-secondary);
  max-width: 480px;
  line-height: 1.58;
  margin-bottom: var(--space-6);
}

.profile-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-5);
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 14px;
  color: var(--color-text-secondary);
}

.meta-item svg {
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

/* --- Section Title --- */
.about-section-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: var(--space-8);
  letter-spacing: -0.02em;
}

/* --- Skills --- */
.skills-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
}

.skill-group {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.skill-group h4 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: var(--space-3);
  color: var(--color-text);
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

/* --- Timeline --- */
.timeline {
  position: relative;
  padding-left: var(--space-8);
}

.timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 8px;
  bottom: 8px;
  width: 1px;
  background: var(--color-border);
}

.timeline-item {
  position: relative;
  padding-bottom: var(--space-8);
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: calc(-1 * var(--space-8) + 2px);
  top: 8px;
  width: 11px;
  height: 11px;
  border-radius: var(--radius-full);
  background: var(--color-accent);
  border: 2px solid var(--color-bg);
  box-shadow: 0 0 0 2px var(--color-accent);
}

.timeline-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: box-shadow var(--duration-base) var(--ease-out);
}

.timeline-card:hover {
  box-shadow: var(--shadow-md);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-4);
  margin-bottom: var(--space-3);
}

.timeline-header h3 {
  font-size: 18px;
  font-weight: 600;
}

.timeline-company {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.timeline-period {
  font-size: 13px;
  color: var(--color-text-tertiary);
  white-space: nowrap;
  flex-shrink: 0;
  padding-top: 3px;
}

.timeline-desc {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* --- Responsive --- */
@media (max-width: 734px) {
  .profile-hero {
    padding: var(--space-12) 0 var(--space-8);
  }

  .avatar-wrapper {
    width: 96px;
    height: 96px;
  }

  .profile-top h1 {
    font-size: 28px;
  }

  .skills-row {
    grid-template-columns: 1fr;
  }

  .profile-meta {
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
  }

  .timeline-header {
    flex-direction: column;
    gap: var(--space-1);
  }
}
</style>
