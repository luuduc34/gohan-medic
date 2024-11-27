import { createRouter, createWebHistory } from 'vue-router'

import AuthPage from '@/views/AuthPage.vue'
import CataloguePage from '@/views/CataloguePage.vue'

const routes = [
  {
    path: "/auth",
    name: "Auth",
    component: AuthPage, // Page de connexion/inscription
  },
  {
    path: "/catalogue",
    name: "Catalogue",
    component: CataloguePage,  // Page de succès après connexion
  },
  {
    path: "/",
    redirect: "/catalogue", // Redirige par défaut vers /catalogue
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router