import { createRouter, createWebHistory } from 'vue-router'

import AuthPage from '@/views/AuthPage.vue'
import CataloguePage from '@/views/CataloguePage.vue'
import HomePage from '@/views/HomePage.vue'

const routes = [
  {
    path: "/Home",
    name: "HomePage",
    component: HomePage,  // Page de succès après connexion
  },
  {
    path: "/auth",
    name: "Auth",
    component: AuthPage, // Page de connexion/inscription
  },
  {
    path: "/catalogue",
    name: "CataloguePage",
    component: CataloguePage,  // Page de succès après connexion
  },
  {
    path: "/",
    redirect: "/Home", // Redirige par défaut vers /HomePage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router