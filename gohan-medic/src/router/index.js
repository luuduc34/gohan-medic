import { createRouter, createWebHistory } from 'vue-router'

import AuthPage from '@/views/AuthPage.vue'
import CataloguePage from '@/views/CataloguePage.vue'
import HomePage from '@/views/HomePage.vue'
import { supabase } from '@/lib/supabaseClient'

let localUser;

const routes = [
  {
    path: "/Home",
    name: "HomePage",
    component: HomePage,  // Page d'accueil
  },
  {
    path: "/Auth",
    name: "Auth",
    component: AuthPage, // Page de connexion/inscription

  },
  {
    path: "/Catalogue",
    name: "CataloguePage",
    component: CataloguePage,  // Page du catalogue
    // meta: {requiresAuth: true}
    // meta: {requiresAdmin: true}
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

// recuperer user
async function getUser(next) {
  localUser = await supabase.auth.getSession();
  if(localUser.data.session == null) {
    next('/unauthorized')
  }
  else {
    next();
  }
}

// auth requis
router.beforeEach((to, from, next) =>{
  if (to.meta.requiresAuth) {
    getUser(next);
  }
  else {
    next();
  }
})

export default router