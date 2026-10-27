import { createWebHistory, createRouter } from 'vue-router'

// Route-level code-splitting: reduces JavaScript weight on initial landing page
const Home = () => import('./pages/Home.vue')
const Projects = () => import('./pages/Projects.vue')
const About = () => import('./pages/About.vue')
const Blog = () => import('./pages/Blog.vue')
const Admin = () => import('./pages/Admin.vue')

const SITE_URL = 'https://imanhakimi.com'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Muhammad Iman Hakimi | Creative & Cloud Developer',
        description: 'Portfolio of Muhammad Iman Hakimi - Creative Web & Cloud Developer based in Skudai, Johor. Specializing in Vue.js, React, Cloud AI (AWS SageMaker, LLaMA 3), and Cybersecurity.',
        canonical: `${SITE_URL}/`,
      }
    },
    {
      path: '/projects',
      name: 'Projects',
      component: Projects,
      meta: {
        title: 'My Work & Projects | Muhammad Iman Hakimi',
        description: 'Explore full-stack web applications, cloud AI systems, cybersecurity solutions, and real-time 3D assets by Muhammad Iman Hakimi.',
        canonical: `${SITE_URL}/projects`,
      }
    },
    {
      path: '/about',
      name: 'About',
      component: About,
      meta: {
        title: 'About Muhammad Iman Hakimi | Bio, Education & Skills',
        description: 'Learn more about Muhammad Iman Hakimi - Web & Cloud Developer in Skudai, Johor. Background in software engineering, cloud computing, and AI hackathon achievements.',
        canonical: `${SITE_URL}/about`,
      }
    },
    {
      path: '/blog',
      name: 'Blog',
      component: Blog,
      meta: {
        title: 'Engineering Blog & Tech Insights | Muhammad Iman Hakimi',
        description: 'Technical articles, cloud architecture guides, and developer insights by Muhammad Iman Hakimi.',
        canonical: `${SITE_URL}/blog`,
      }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
      meta: {
        title: 'Portfolio Administration | Iman Hakimi',
        description: 'Administrative terminal portal.',
        robots: 'noindex, nofollow',
        canonical: `${SITE_URL}/admin`,
      }
    },
    {
      path: '/database',
      name: 'Database',
      component: Admin,
      meta: {
        title: 'Database Management | Iman Hakimi',
        description: 'Portfolio database administration and content management portal.',
        robots: 'noindex, nofollow',
        canonical: `${SITE_URL}/database`,
      }
    },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// Dynamic SEO updating on route transition
router.afterEach((to) => {
  // Update document title
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }

  // Update or inject meta description
  let metaDesc = document.querySelector('meta[name="description"]')
  if (!metaDesc) {
    metaDesc = document.createElement('meta')
    metaDesc.setAttribute('name', 'description')
    document.head.appendChild(metaDesc)
  }
  if (to.meta && to.meta.description) {
    metaDesc.setAttribute('content', to.meta.description)
  }

  // Update or inject canonical link
  let canonicalLink = document.querySelector('link[rel="canonical"]')
  if (!canonicalLink) {
    canonicalLink = document.createElement('link')
    canonicalLink.setAttribute('rel', 'canonical')
    document.head.appendChild(canonicalLink)
  }
  if (to.meta && to.meta.canonical) {
    canonicalLink.setAttribute('href', to.meta.canonical)
  }

  // Update robots meta tag
  let robotsMeta = document.querySelector('meta[name="robots"]')
  if (!robotsMeta) {
    robotsMeta = document.createElement('meta')
    robotsMeta.setAttribute('name', 'robots')
    document.head.appendChild(robotsMeta)
  }
  robotsMeta.setAttribute('content', (to.meta && to.meta.robots) ? to.meta.robots : 'index, follow')
})

export { router }
export default router
