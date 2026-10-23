/** Shared career / project structural data (localized copy lives in i18n). */
export const CAREER_ITEMS = [
  {
    id: 'dji-sensor',
    companyId: 'DJI',
    year: '2026',
    tags: ['C/C++', 'Sensor', 'Factory'],
    group: 'company',
    image: '/images/drone-studio.jpg',
    order: 0
  },
  {
    id: 'xiaomi-perf',
    companyId: 'Xiaomi',
    year: '2022–2026',
    tags: ['ISP', 'Performance', 'Linux'],
    group: 'company',
    image: '/images/plant.jpg',
    order: 1
  },
  {
    id: 'bosch-edge',
    companyId: 'Bosch',
    year: '2021–2022',
    tags: ['Embedded', 'AI', 'Python'],
    group: 'company',
    image: '/images/desk.jpg',
    order: 2
  },
  {
    id: 'isp-pipeline',
    companyId: 'Writing',
    year: 'ongoing',
    tags: ['V4L2', 'MIPI', 'Blog'],
    group: 'company',
    image: '/images/dashboard.svg',
    order: 3
  },
  {
    id: 'script-manager',
    companyId: 'Open Source',
    year: 'ongoing',
    tags: ['TypeScript', 'Tooling'],
    group: 'personal',
    url: 'https://github.com/xiongzhengyao/Script-Manager',
    image: '/images/laptop.jpg',
    order: 4
  },
  {
    id: 'log-viewer',
    companyId: 'Open Source',
    year: 'ongoing',
    tags: ['Logs', 'Debugging'],
    group: 'personal',
    url: 'https://github.com/xiongzhengyao/LogViewer',
    image: '/images/firmware-ui.svg',
    order: 5
  },
  {
    id: 'log-system',
    companyId: 'Open Source',
    year: 'ongoing',
    tags: ['C++', 'Logging'],
    group: 'personal',
    url: 'https://github.com/xiongzhengyao/log_system',
    image: '/images/hero-workspace.svg',
    order: 6
  },
  {
    id: 'scripts-android',
    companyId: 'Open Source',
    year: 'ongoing',
    tags: ['Android', 'Python'],
    group: 'personal',
    url: 'https://github.com/xiongzhengyao/scripts_android',
    image: '/images/app-ui.svg',
    order: 7
  },
  {
    id: 'cost-tracker',
    companyId: 'Personal',
    year: 'ongoing',
    tags: ['Flutter', 'Mobile'],
    group: 'personal',
    private: true,
    image: '/images/sunset-sea.jpg',
    order: 8
  }
]

export const CAREER_COMPANY_IDS = ['DJI', 'Xiaomi', 'Bosch']
