/** Shared career / project structural data (localized copy lives in i18n). */
export const CAREER_ITEMS = [
  {
    id: 'dji-sensor',
    companyId: 'DJI',
    year: '2026',
    tags: ['C/C++', 'Sensor', 'Factory'],
    group: 'company',
    order: 0
  },
  {
    id: 'xiaomi-perf',
    companyId: 'Xiaomi',
    year: '2022–2026',
    tags: ['ISP', 'Performance', 'Linux'],
    group: 'company',
    order: 1
  },
  {
    id: 'bosch-edge',
    companyId: 'Bosch',
    year: '2021–2022',
    tags: ['Embedded', 'AI', 'Python'],
    group: 'company',
    order: 2
  },
  {
    id: 'isp-pipeline',
    companyId: 'Writing',
    year: 'ongoing',
    tags: ['V4L2', 'MIPI', 'Blog'],
    group: 'company',
    order: 3
  },
  {
    id: 'script-manager',
    companyId: 'Open Source',
    year: 'ongoing',
    tags: ['TypeScript', 'Tooling'],
    group: 'personal',
    url: 'https://github.com/xiongzhengyao/Script-Manager',
    order: 4
  },
  {
    id: 'log-viewer',
    companyId: 'Open Source',
    year: 'ongoing',
    tags: ['Logs', 'Debugging'],
    group: 'personal',
    url: 'https://github.com/xiongzhengyao/LogViewer',
    order: 5
  },
  {
    id: 'log-system',
    companyId: 'Open Source',
    year: 'ongoing',
    tags: ['C++', 'Logging'],
    group: 'personal',
    url: 'https://github.com/xiongzhengyao/log_system',
    order: 6
  },
  {
    id: 'scripts-android',
    companyId: 'Open Source',
    year: 'ongoing',
    tags: ['Android', 'Python'],
    group: 'personal',
    url: 'https://github.com/xiongzhengyao/scripts_android',
    order: 7
  },
  {
    id: 'cost-tracker',
    companyId: 'Personal',
    year: 'ongoing',
    tags: ['Flutter', 'Mobile'],
    group: 'personal',
    private: true,
    order: 8
  }
]

export const CAREER_COMPANY_IDS = ['DJI', 'Xiaomi', 'Bosch']
