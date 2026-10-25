import { createMemoryHistory, createRouter } from 'vue-router'

import Home from './pages/Home.vue'
import Gallery from './pages/Gallery.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/gallery', component: AboutView },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

createApp(App).use(router).mount('#app')