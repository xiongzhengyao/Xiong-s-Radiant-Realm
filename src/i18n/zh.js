export default {
  nav: {
    home: '首页',
    about: '关于',
    projects: '项目',
    blog: '笔记',
    contact: '联系',
    life: '生活',
    brand: 'Snowhush',
    archive: '存档',
    skipToContent: '跳到主要内容',
    toggleMenu: '切换导航菜单',
    themeLight: '切换到浅色模式',
    themeDark: '切换到深色模式',
    mobileNav: '移动端导航'
  },
  common: {
    backToTop: '回到顶部'
  },
  command: {
    title: '快速搜索',
    placeholder: '搜索页面、笔记、项目、生活…',
    empty: '没有匹配的结果',
    open: '打开快速搜索',
    shortcutMac: '⌘K',
    shortcutWin: 'Ctrl K',
    groups: {
      pages: '页面',
      notes: '笔记',
      projects: '项目',
      life: '生活'
    }
  },
  career: {
    yearOngoing: '持续'
  },
  error: {
    title: '页面加载出错',
    subtitle: '抱歉，页面遇到了一些问题，请刷新重试。',
    reload: '重新加载',
    home: '返回首页',
    details: '错误详情'
  },
  notFound: {
    title: '页面不存在',
    desc: '你访问的链接可能已失效，或页面已被移除。',
    home: '返回首页',
    blog: '浏览博客',
    back: '返回上一页',
    quickLinks: '快速导航'
  },
  meta: {
    homeTitle: 'Snowhush',
    homeDesc: '把光写进系统，把安静留在页面。Camera 驱动 · 摄影与海报',
    aboutTitle: '关于我',
    aboutDesc: '熊正耀 — Camera 驱动软件工程师，曾就职于大疆、小米、博世',
    blogTitle: '笔记',
    blogDesc: '嵌入式、Camera 驱动与日常记录',
    lifeTitle: '生活点滴',
    lifeDesc: '旅行、摄影、读书与日常感悟',
    projectsTitle: '作品',
    projectsDesc: 'Camera 系统、工具与嵌入式作品',
    contactTitle: '有事说一声',
    contactDesc: '写信聊聊技术、作品或任何事'
  },
  footer: {
    explore: '探索',
    about: '关于',
    social: '社交',
    tagline: 'Quiet as fresh snow.',
    emailCta: '写一封信',
    builtWith: '用 Vue 3 构建',
    rss: 'RSS 订阅',
    sitemap: '网站地图'
  },
  home: {
    hello: '你好，我是 Snowhush。',
    helloPrefix: '你好，我是',
    helloName: 'Snowhush',
    helloSuffix: '。',
    headline: '把光写进系统',
    sub: '在 DJI 做 Camera Driver，专注于影像工具与飞行系统的创造。',
    roleLine: "Camera Driver {'@'} DJI · 上海",
    kicker: 'Camera',
    ctaWork: '作品',
    ctaNotes: '笔记',
    heroAlt: '白色无人机正面特写，云台镜头居中',
    indexNotes: '笔记',
    indexWork: '作品',
    indexLife: '生活',
    chaptersLabel: '续映',
    exploreWork: '探索我的工作',
    readNotes: '阅读最新笔记',
    latestNotes: '最新笔记',
    featuredProject: '精选项目',
    projectProgress: '精选项目',
    projectMeta: '3月更新',
    lifeMoments: '生活瞬间',
    daysAgo: '{n} 天前',
    lastWeek: '上周',
    coreContribution: '核心贡献',
    lifeCaption: '海边走走，换换脑子。',
    lifeTag: '生活碎片',
    noteTag: '工作思考',
    fallbackNoteTitle: '',
    fallbackNoteExcerpt: '',
    continue: {
      eyebrow: '继续阅读',
      cta: '从上次离开的地方继续'
    }
  },
  about: {
    title: '关于',
    eyebrow: '人物',
    intro: '从博世到小米、大疆，\n在 Camera 系统里把一件事做深。',
    contactCta: '联系我',
    resumeCta: '打开简历',
    resumePrint: '打印本页',
    profile: {
      name: '熊正耀',
      nameAccent: '耀',
      title: "Camera 驱动软件工程师 {'@'} 大疆 · 上海",
      bio: '从博世到小米、大疆，在 Camera 系统里把一件事做深。',
      location: '上海',
      years: '{n} 年+工作经验'
    },
    skillsFlat: ['C/C++', 'Python', 'ARM', 'Sensor', 'Linux'],
    sections: {
      skills: '专业技能',
      experience: '工作经历',
      education: '教育经历'
    },
    experience: {
      eyebrow: '职业路径'
    },
    educationLabel: '教育经历',
    educationSummary: '上大硕·机械 · 南航金城学士·车辆',
    skillGroups: [
      { name: '编程语言', items: ['C/C++', 'Python', 'Shell'] },
      { name: '嵌入式开发', items: ['ARM', 'Linux 驱动', 'Sensor 驱动'] },
      { name: '开发工具', items: ['Git', 'VSCode', 'Cursor', 'Jira', 'Confluence'] }
    ],
    work: [
      {
        period: '2026.02–',
        position: '相机驱动研发',
        company: '大疆',
        description: '负责影像链路驱动与相机软件栈'
      },
      {
        period: '2022.08–2026.02',
        position: '影像系统优化',
        company: '小米',
        description: '梳理首帧出图链路，优化 sensor / ISP 初始化与冷启动路径'
      },
      {
        period: '2021.09–2022.03',
        position: '嵌入式软件开发',
        company: '博世',
        description: '端侧 AI 图像采集与嵌入式处理流水线'
      }
    ],
    education: [
      {
        period: '2019.09–2022.06',
        degree: '硕士研究生',
        school: '上海大学',
        major: '机械工程',
        details: '研究方向：机械制造及其自动化'
      },
      {
        period: '2015.09–2019.06',
        degree: '学士',
        school: '南京航空航天大学金城学院',
        major: '车辆工程',
        details: '主修课程：C 语言、C++、数字信号处理、嵌入式系统、汽车原理等'
      }
    ]
  },
  blog: {
    eyebrow: 'Notes',
    title: '笔记',
    subtitle: '记录与创造。',
    all: '全部',
    searchPlaceholder: '搜索...',
    clearSearch: '清除搜索',
    yearLabel: '年份',
    tagLabel: '标签',
    designTags: [
      { id: 'imaging', label: '影像' },
      { id: 'sensor', label: 'Sensor' },
      { id: 'linux', label: 'Linux' },
      { id: 'embedded', label: '嵌入式' },
      { id: 'notes', label: '笔记' },
      { id: 'life', label: '生活' }
    ],
    loadMore: '加载更多',
    latest: '最新',
    readingProgress: '已读 {n}%',
    readMore: '阅读全文',
    empty: '没有找到匹配的文章',
    backToList: '返回文章列表',
    keywords: '关键词',
    readTime: '{n} 分钟阅读',
    noImage: '文章配图',
    toc: '目录',
    tocCount: '{n} 节',
    tocClose: '关闭',
    copyLink: '复制链接',
    copySuccess: '链接已复制',
    breadcrumbBlog: '笔记',
    breadcrumbNav: '面包屑导航',
    moreActions: '更多操作',
    relatedTitle: '相关文章',
    share: '分享',
    print: '打印',
    codeCopy: '复制',
    codeCopyAria: '复制代码',
    codeCopied: '已复制',
    read: '已读',
    allTags: '全部标签',
    sortLabel: '排序方式',
    sortNewest: '最新发布',
    sortOldest: '最早发布',
    sortTitle: '按标题',
    bookmark: '收藏',
    bookmarked: '已收藏',
    bookmarkFilter: '收藏',
    bookmarkEmpty: '还没有收藏的笔记。打开一篇文章，点右上角 ⋯ 即可收藏。',
    bookmarkAdded: '已加入收藏',
    bookmarkRemoved: '已取消收藏',
    copyFailed: '复制失败',
    author: {
      label: '作者'
    }
  },
  life: {
    eyebrow: '生活记录',
    title: '生活相册',
    subtitle: '记录生活中的美好瞬间与感悟',
    all: '全部',
    searchPlaceholder: '搜索...',
    empty: '暂无相关内容',
    viewAll: '查看全部',
    closeDetail: '关闭',
    openDetail: '查看详情',

    categories: {
      travel: '旅行',
      food: '美食',
      reading: '读书',
      photography: '摄影',
      thoughts: '随想'
    },
    posts: [
      {
        id: 'shanghai-weekend',
        title: '上海周末游记',
        date: '2025-10-12',
        description: '周末在上海的人文探索之旅。外滩的江风、田子坊的窄巷，把一周写驱动的脑子换一换。',
        tags: ['旅行', '城市'],
        category: 'travel',
        image: '/images/city.jpg'
      },
      {
        id: 'cherry-spring',
        title: '春日路边的樱',
        date: '2025-03-28',
        description: '路过一片樱花，手机随手拍。不追求大片，只想把那天的浅粉留住。',
        tags: ['摄影', '春天'],
        category: 'photography',
        image: '/images/cherry.jpg'
      },
      {
        id: 'rain-commute',
        title: '雨天通勤',
        date: '2025-06-18',
        description: '雨声盖过耳机里的播客。城市在水里，人也慢一点。',
        tags: ['摄影', '城市'],
        category: 'photography',
        image: '/images/rain.jpg'
      },
      {
        id: 'cafe-debug',
        title: '咖啡馆里的日志',
        date: '2025-08-03',
        description: '拿着一杯美式对着 log 发呆。有些 bug 需要咖啡因，有些只需要离开工位。',
        tags: ['随想', '工作'],
        category: 'thoughts',
        image: '/images/cafe.jpg'
      },
      {
        id: 'coffee-morning',
        title: '晨间咖啡',
        date: '2025-01-19',
        description: '开工前十分钟的安静。蒸汽、杯沿、还没打开的 IDE。',
        tags: ['美食', '日常'],
        category: 'food',
        image: '/images/coffee.jpg'
      },
      {
        id: 'beach-clear',
        title: '海边走走',
        date: '2024-11-02',
        description: '把脑子清空再回来。海风比任何 standup 都管用。',
        tags: ['旅行', '放松'],
        category: 'travel',
        image: '/images/beach.jpg'
      },
      {
        id: 'sunset-sea',
        title: '日落海岸线',
        date: '2024-09-15',
        description: '追光到天暗。曝光与白平衡想太多，不如先按下快门。',
        tags: ['摄影', '海边'],
        category: 'photography',
        image: '/images/sunset-sea.jpg'
      },
      {
        id: 'desk-night',
        title: '夜深工位',
        date: '2024-07-22',
        description: '灯只留一盏。调试到段落处，才发现窗外已经黑透。',
        tags: ['随想', '工作'],
        category: 'thoughts',
        image: '/images/desk.jpg'
      },
      {
        id: 'plant-corner',
        title: '窗边绿植',
        date: '2024-05-08',
        description: '养不活很贵的花，但养得活一盆懒人绿。生活需要一点不会 crash 的东西。',
        tags: ['日常'],
        category: 'thoughts',
        image: '/images/plant.jpg'
      },
      {
        id: 'photo-yearbook',
        title: '年度摄影精选',
        date: '2024-02-08',
        description: '用镜头记下四季与城市光影。海报感偶尔有，更多是路过时的一眼。',
        tags: ['摄影', '艺术'],
        category: 'photography',
        image: '/images/mountains.jpg'
      },
      {
        id: 'sapiens-notes',
        title: '读《人类简史》有感',
        date: '2024-02-05',
        description: '从认知革命到科技革命。写系统的人偶尔也要抬头看看更大的时间尺度。',
        tags: ['读书', '思考'],
        category: 'reading',
        image: '/images/book.jpg'
      }
    ]
  },
  projects: {
    eyebrow: '作品集',
    title: '项目',
    subtitle: '公司项目与开源工具 — 从 Camera 驱动到日常工程效率。',
    all: '全部',
    searchPlaceholder: '搜索项目...',
    chips: {
      firmware: '固件',
      tools: '工具',
      app: 'App'
    },
    rolePrefix: '核心角色',
    groups: {
      all: '全部',
      company: '公司项目',
      personal: '开源 / 个人'
    },
    privateRepo: '私有仓库',
    viewOnGithub: '查看仓库',
    empty: '没有找到匹配的项目',
    archiveHint: '可按公司 / 开源筛选。开源仓库默认与公司项目一同展示。',
    archiveEmpty: '暂无开源或个人项目。',
    caseProblem: '问题',
    caseApproach: '做法',
    caseResult: '结果',
    caseClose: '收起案例',
    caseOpen: '查看案例',
    items: [
      {
        id: 'dji-sensor',
        company: 'DJI',
        year: '2026',
        title: 'Sensor 驱动产线自动化',
        role: 'Camera Driver 系统开发',
        chip: 'firmware',
        description: 'Sensor 驱动 bring-up 与产线自动化测试框架，覆盖初始化、寄存器校验与异常路径。',
        tags: ['固件优化'],
        case: {
          problem: '新 Sensor / 模组上线时，手工 bring-up 与产线抽检路径不一致，异常难复现。',
          approach: '把电源、时钟、总线、ID、初始化表、链路、出流收成可脚本化检查点，接入产线自动化。',
          result: '换模组时排查有固定顺序；异常路径可回归，减少「只在工位复现」的黑洞。'
        }
      },
      {
        id: 'xiaomi-perf',
        company: 'Xiaomi',
        year: '2022–2026',
        title: 'Camera 冷启动优化',
        role: '影像工具主程',
        chip: 'firmware',
        description: '梳理首帧出图链路，优化 sensor / ISP 初始化路径，降低冷启动延迟。',
        tags: ['固件优化'],
        case: {
          problem: '打开相机到预览可交互偏慢，优化点分散在驱动、ISP 与显示，缺少统一时间轴。',
          approach: '定义首帧口径，按阶段打点；合并重复等待，允许安全的并行，按场景拆初始化表。',
          result: '冷启动路径可度量；产品侧感知到的「打开变快」能对应到具体阶段收益。'
        }
      },
      {
        id: 'bosch-edge',
        company: 'Bosch',
        year: '2021–2022',
        title: '端侧 AI 图像采集',
        role: '嵌入式开发',
        chip: 'firmware',
        description: '嵌入式平台模型部署与图像采集处理流水线，串联采集、预处理与推理。',
        tags: ['稳定性'],
        case: {
          problem: '端侧采集与推理流水线耦合紧，换模型或分辨率时回归成本高。',
          approach: '拆成采集、预处理、推理三段接口，固定缓冲与错误码约定，补关键路径压测。',
          result: '换模型时主要改中间段；采集侧稳定性问题可单独定位。'
        }
      },
      {
        id: 'isp-pipeline',
        company: 'Writing',
        year: '持续',
        title: 'ISP Pipeline 技术写作',
        role: '技术写作',
        chip: 'tools',
        description: '将 Camera 系统经验沉淀为可复用的技术博客与工程笔记。',
        tags: ['效率工具'],
        case: {
          problem: '项目里的经验留在口头与私有文档，新人上手慢，对外也难展示。',
          approach: '把可公开部分写成结构化笔记：路径图、清单、算例，统一放在本站。',
          result: '形成可持续更新的公开知识库，求职与协作时有据可查。'
        }
      },
      {
        id: 'script-manager',
        company: 'Open Source',
        year: '持续',
        title: 'Script-Manager',
        role: '工具主程',
        chip: 'tools',
        description: 'TypeScript 脚本管理工具，统一组织、运行与维护本地脚本工作流。',
        tags: ['效率工具'],
        case: {
          problem: '本地脚本散落各处，参数与运行方式不统一，分享成本高。',
          approach: '用 TypeScript 做统一入口：组织、运行、维护脚本，开源到 GitHub。',
          result: '个人与协作场景有同一套调用方式；仓库可直接访问。'
        }
      },
      {
        id: 'log-viewer',
        company: 'Open Source',
        year: '持续',
        title: 'LogViewer',
        role: '工具开发',
        chip: 'tools',
        description: '日志查看器，面向调试场景的日志浏览与检索。',
        tags: ['效率工具']
      },
      {
        id: 'log-system',
        company: 'Open Source',
        year: '持续',
        title: 'log_system',
        role: '底层驱动',
        chip: 'firmware',
        description: 'C++ 日志系统，提供结构化日志与可扩展写入路径。',
        tags: ['固件']
      },
      {
        id: 'scripts-android',
        company: 'Open Source',
        year: '持续',
        title: 'scripts_android',
        role: '调试工具',
        chip: 'tools',
        description: 'Android 调试脚本集合，加速日常抓 log、环境检查与问题复现。',
        tags: ['效率工具']
      },
      {
        id: 'cost-tracker',
        company: 'Personal',
        year: '持续',
        title: 'cost-tracker',
        role: 'UI/UX 设计与开发',
        chip: 'app',
        description: 'Flutter 记账 App，记录日常开销与分类统计（私有仓库）。',
        tags: ['跨平台']
      }
    ]
  },
  contact: {
    title: '联系我',
    eyebrow: '保持联系',
    subtitle: '期待与你的交流。无论是技术讨论还是项目合作，都欢迎写信。',
    emailCta: '发送邮件',
    responseTime: '通常在 1–2 个工作日内回复。',
    intentsTitle: '想聊什么',
    intents: {
      collab: {
        label: '项目合作',
        subject: '合作咨询 · snowhush.com',
        body: '你好，我想聊聊合作机会：\n\n'
      },
      tech: {
        label: '技术讨论',
        subject: '技术讨论 · snowhush.com',
        body: '你好，我想请教 / 讨论：\n\n'
      },
      hello: {
        label: '随便打个招呼',
        subject: '你好 · snowhush.com',
        body: '你好，\n\n'
      }
    },
    channels: {
      github: '开源项目与日常代码',
      csdn: '技术文章与工程笔记'
    },
    info: {
      title: '联系方式',
      email: '邮箱',
      phone: '电话',
      location: '地址',
      social: '也可以在这里找到我',
      address: '中国，上海市'
    }
  }
}
