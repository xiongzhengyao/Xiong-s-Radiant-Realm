/** Shared career / project structural data (localized copy lives in i18n). */
export const CAREER_ITEMS = [
  {
    id: 'matrice-30',
    companyId: 'DJI',
    year: '2026',
    tags: ['固件优化'],
    group: 'company',
    showcase: true,
    image: '/images/drone-studio.jpg',
    order: 0
  },
  {
    id: 'camera-toolchain',
    companyId: 'DJI',
    year: '2026',
    tags: ['效率工具'],
    group: 'company',
    showcase: true,
    image: '/images/dashboard.svg',
    order: 1
  },
  {
    id: 'altitude-flight',
    companyId: 'DJI',
    year: '2026',
    tags: ['稳定性'],
    group: 'company',
    showcase: true,
    image: '/images/mountains.jpg',
    order: 2
  },
  {
    id: 'vision-algo',
    companyId: 'DJI',
    year: '2025',
    tags: ['视觉算法'],
    group: 'company',
    showcase: true,
    image: '/images/drone-white.jpg',
    order: 3
  },
  {
    id: 'flight-app',
    companyId: 'Personal',
    year: '2025',
    tags: ['跨平台'],
    group: 'personal',
    showcase: true,
    image: '/images/app-ui.svg',
    order: 4
  },
  {
    id: 'firmware-tool',
    companyId: 'Open Source',
    year: 'ongoing',
    tags: ['固件'],
    group: 'personal',
    showcase: true,
    image: '/images/firmware-ui.svg',
    order: 5
  },
  {
    id: 'dji-sensor',
    companyId: 'DJI',
    year: '2026',
    tags: ['C/C++', 'Sensor', 'Factory'],
    group: 'company',
    showcase: false,
    image: '/images/drone-studio.jpg',
    order: 6
  },
  {
    id: 'xiaomi-perf',
    companyId: 'Xiaomi',
    year: '2022–2026',
    tags: ['ISP', 'Performance', 'Linux'],
    group: 'company',
    showcase: false,
    image: '/images/laptop.jpg',
    order: 7
  },
  {
    id: 'bosch-edge',
    companyId: 'Bosch',
    year: '2021–2022',
    tags: ['Embedded', 'AI', 'Python'],
    group: 'company',
    showcase: false,
    image: '/images/desk.jpg',
    order: 8
  },
  {
    id: 'isp-pipeline',
    companyId: 'Writing',
    year: 'ongoing',
    tags: ['V4L2', 'MIPI', 'Blog'],
    group: 'company',
    showcase: false,
    image: '/images/dashboard.svg',
    order: 9
  },
  {
    id: 'script-manager',
    companyId: 'Open Source',
    year: 'ongoing',
    tags: ['TypeScript', 'Tooling'],
    group: 'personal',
    url: 'https://github.com/xiongzhengyao/Script-Manager',
    showcase: false,
    image: '/images/laptop.jpg',
    order: 10
  },
  {
    id: 'log-viewer',
    companyId: 'Open Source',
    year: 'ongoing',
    tags: ['Logs', 'Debugging'],
    group: 'personal',
    url: 'https://github.com/xiongzhengyao/LogViewer',
    showcase: false,
    image: '/images/firmware-ui.svg',
    order: 11
  },
  {
    id: 'log-system',
    companyId: 'Open Source',
    year: 'ongoing',
    tags: ['C++', 'Logging'],
    group: 'personal',
    url: 'https://github.com/xiongzhengyao/log_system',
    showcase: false,
    image: '/images/firmware-ui.svg',
    order: 12
  },
  {
    id: 'scripts-android',
    companyId: 'Open Source',
    year: 'ongoing',
    tags: ['Android', 'Python'],
    group: 'personal',
    url: 'https://github.com/xiongzhengyao/scripts_android',
    showcase: false,
    image: '/images/app-ui.svg',
    order: 13
  },
  {
    id: 'cost-tracker',
    companyId: 'Personal',
    year: 'ongoing',
    tags: ['Flutter', 'Mobile'],
    group: 'personal',
    private: true,
    showcase: false,
    image: '/images/desk.jpg',
    order: 14
  }
]

export const CAREER_COMPANY_IDS = ['DJI', 'Xiaomi', 'Bosch']
