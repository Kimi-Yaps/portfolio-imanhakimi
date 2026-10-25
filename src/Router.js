import { createWebHistory, createRouter } from 'vue-router'

import Home from './pages/Home.vue'
import Gallery from './pages/Gallery.vue'
import Projects from './pages/Projects.vue'
import About from './pages/About.vue'
import Blog from './pages/Blog.vue'
import Admin from './pages/Admin.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/admin', component: Admin },
    { path: '/gallery', component: Gallery },
    { path: '/projects', component: Projects },
    { path: '/about', component: About },
    { path: '/blog', component: Blog },
  ]
})

export { router }
export default router
