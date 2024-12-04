// Importation des modules nécessaires pour la gestion des routes
import { createRouter, createWebHistory } from 'vue-router'

// Importation des pages/views utilisées dans les routes
import AuthPage from '@/views/AuthPage.vue'
import CataloguePage from '@/views/CataloguePage.vue'
import HomePage from '@/views/HomePage.vue'
import PanierPage from '@/views/PanierPage.vue'
import UnauthorizedPage from '@/views/UnauthorizedPage.vue'

// Importation du client Supabase pour vérifier l'authentification
import { supabase } from '@/lib/supabaseClient'

let localUser;

// Définition des routes de l'application
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
    path: "/Panier",
    name: "Panier",
    component: PanierPage, // Page du panier
    meta: {requiresAuth: true} // Page nécessite une authentification
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
  },
  {
    path: "/Unauthorized",
    name: "Unauthorized",
    component: UnauthorizedPage, // Page affichée pour les accès non autorisés
  }
]

// Création du routeur avec l'historique de navigation
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Fonction pour vérifier l'authentification de l'utilisateur avant de permettre l'accès aux pages
async function getUser(next) {
  localUser = await supabase.auth.getSession();
  if(localUser.data.session == null) {
    next('/unauthorized')  // Si l'utilisateur n'est pas authentifié, redirige vers la page Unauthorized
  }
  else {
    next();  // Si l'utilisateur est authentifié, continue la navigation
  }
}

// Vérification de l'authentification avant chaque route nécessitant une connexion
router.beforeEach((to, from, next) =>{
  if (to.meta.requiresAuth) {
    getUser(next);  // Vérifie l'authentification si la route nécessite un utilisateur connecté
  }
  else {
    next();  // Permet la navigation si aucune authentification n'est requise
  }
})

export default router
