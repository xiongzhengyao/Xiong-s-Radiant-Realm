/**
 * 站点模块清单。这是新增栏目时唯一要登记的地方。
 *
 * 加一个页面：
 * 1. 在这里追加一项（路由、导航、页脚、底栏、站点地图、外壳样式）。
 * 2. 在 src/modules/loaders.js 增加同名组件加载器。
 * 3. 若该栏目有可搜索内容：
 *    - 在 src/modules/content-sources.mjs 登记集合（站点地图深链）
 *    - 在 src/modules/search/ 增加一个 provider，并在 search/index.js 挂上
 *
 * 不需要再改 App.vue、router、MobileTabBar、CommandPalette、generate-feeds。
 *
 * 路由上的外壳标记会原样进 vue-router meta：
 * - home：首页夜景底
 * - quietSky：安静星空（只打在列表页，详情页保持现状）
 * - infoPage：信息页，压低颗粒和光束
 * - articleReading：阅读态，收起底栏和遮幅
 * - transitionGroup：相同值的路由切换不拆掉页面实例（笔记列表/详情）
 * - highlightNav：当前路由高亮另一条导航（联系页高亮「关于」）
 */

export default [
  {
    id: 'home',
    order: 10,
    label: 'nav.home',
    component: 'home',
    nav: { primary: true, tab: true, icon: 'home', path: '/' },
    footer: 'explore',
    command: true,
    sitemap: { path: '/', changefreq: 'weekly', order: 10 },
    routes: [
      {
        path: '/',
        name: 'Home',
        titleKey: 'meta.homeTitle',
        descKey: 'meta.homeDesc',
        home: true,
        quietSky: true
      }
    ]
  },
  {
    id: 'blog',
    order: 20,
    label: 'nav.blog',
    component: 'blog',
    nav: { primary: true, tab: true, icon: 'blog', path: '/blog' },
    footer: 'explore',
    command: true,
    notFound: true,
    search: 'notes',
    sitemap: { path: '/blog', changefreq: 'weekly', order: 40 },
    routes: [
      {
        path: '/blog',
        name: 'Blog',
        titleKey: 'meta.blogTitle',
        descKey: 'meta.blogDesc',
        infoPage: true,
        transitionGroup: 'blog'
      },
      {
        path: '/blog/:id/:slug',
        name: 'BlogPost',
        props: true,
        titleKey: 'meta.blogTitle',
        descKey: 'meta.blogDesc',
        infoPage: true,
        articleReading: true,
        transitionGroup: 'blog'
      }
    ]
  },
  {
    id: 'projects',
    order: 30,
    label: 'nav.projects',
    component: 'projects',
    nav: { primary: true, tab: true, icon: 'projects', path: '/projects' },
    footer: 'explore',
    command: true,
    notFound: true,
    search: 'projects',
    sitemap: { path: '/projects', changefreq: 'weekly', order: 30 },
    routes: [
      {
        path: '/projects',
        name: 'Projects',
        titleKey: 'meta.projectsTitle',
        descKey: 'meta.projectsDesc',
        quietSky: true
      },
      {
        path: '/projects/:id',
        name: 'ProjectDetail',
        props: true,
        titleKey: 'meta.projectsTitle',
        descKey: 'meta.projectsDesc'
      }
    ]
  },
  {
    id: 'life',
    order: 40,
    label: 'nav.life',
    component: 'life',
    nav: { primary: true, tab: true, icon: 'life', path: '/life' },
    footer: 'explore',
    command: true,
    search: 'life',
    sitemap: { path: '/life', changefreq: 'weekly', order: 50 },
    routes: [
      {
        path: '/life',
        name: 'Life',
        titleKey: 'meta.lifeTitle',
        descKey: 'meta.lifeDesc',
        quietSky: true
      },
      {
        path: '/life/:id',
        name: 'LifeDetail',
        props: true,
        titleKey: 'meta.lifeTitle',
        descKey: 'meta.lifeDesc'
      }
    ]
  },
  {
    id: 'about',
    order: 50,
    label: 'nav.about',
    component: 'about',
    nav: { primary: true, tab: true, icon: 'about', path: '/about' },
    footer: 'about',
    command: true,
    notFound: true,
    sitemap: { path: '/about', changefreq: 'monthly', order: 20 },
    routes: [
      {
        path: '/about',
        name: 'About',
        titleKey: 'meta.aboutTitle',
        descKey: 'meta.aboutDesc',
        infoPage: true
      }
    ]
  },
  {
    id: 'contact',
    order: 60,
    label: 'nav.contact',
    component: 'contact',
    footer: 'about',
    command: true,
    notFound: true,
    sitemap: { path: '/contact', changefreq: 'yearly', order: 60 },
    routes: [
      {
        path: '/contact',
        name: 'Contact',
        titleKey: 'meta.contactTitle',
        descKey: 'meta.contactDesc',
        infoPage: true,
        highlightNav: '/about'
      }
    ]
  },
  {
    id: 'resume',
    order: 70,
    sitemap: { path: '/resume.html', changefreq: 'monthly', order: 70 }
  },
  {
    id: 'notFound',
    order: 1000,
    component: 'notFound',
    routes: [
      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        infoPage: true
      }
    ]
  }
]
