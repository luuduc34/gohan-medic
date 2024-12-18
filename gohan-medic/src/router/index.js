import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/UserStore";

import AuthPage from "@/views/AuthPage.vue";
import CataloguePage from "@/views/CataloguePage.vue";
import HomePage from "@/views/HomePage.vue";
import PanierPage from "@/views/PanierPage.vue";
import UnauthorizedPage from "@/views/UnauthorizedPage.vue";
import PromotionPage from "@/views/PromotionPage.vue";
import GestionPage from "@/views/GestionPage.vue";
import StockPage from "@/views/StockPage.vue";
import ExportCsvPage from "@/views/exportCsvPage.vue";
import ProductDetailPage from "@/views/ProduitDetailPage.vue";

const routes = [
  { 
    path: "/Home",
    name: "HomePage",
    component: HomePage,
  },
  { 
    path: "/Auth",
    name: "Auth",
    component: AuthPage,
  },
  { 
    path: "/Panier",
    name: "Panier",
    component: PanierPage,
    meta: { requiresAuth: true },
  },
  { 
    path: "/Gestion",
    name: "Gestion",
    component: GestionPage,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: "Stock",
        name: "Stock",
        component: StockPage,
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "Export",
        name: "ExportCsvPage",
        component: ExportCsvPage,
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "NewProduct",
        name: "NewProductPage",
        component: () => import("@/views/NewProductPage.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },           
      {
        path: "ModifyProduct",
        name: "ModifyProductPage",
        component: () => import("@/views/ModifyProductPage.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "ModifyProduct/:id",
        name: "ModifyProductForm",
        component: () => import("@/views/ModifyProductForm.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      }
      
      },            
    ],
  },
  { 
    path: "/Catalogue",
    name: "CataloguePage",
    component: CataloguePage,
  },
  {
    path: "/product-detail",
    name: "ProductDetail",
    component: ProductDetailPage,
  },
  { 
    path: "/Promotion",
    name: "PromotionPage",
    component: PromotionPage,
  },
  { 
    path: "/",
    redirect: "/Home",
  },
  {
    path: "/Unauthorized",
    name: "Unauthorized",
    component: UnauthorizedPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  // Vérifie si la route nécessite une authentification
  if (to.meta.requiresAuth) {
    if (!userStore.user) {
      await userStore.fetchUser(); // Récupère les informations utilisateur si elles ne sont pas encore chargées
    }

    if (!userStore.isAuthenticated) {
      return next({ path: "/Unauthorized" }); // Redirige si l'utilisateur n'est pas authentifié
    }

    // Vérifie si la route nécessite un rôle spécifique (par exemple : admin)
    if (to.meta.requiresAdmin && userStore.role !== 2) {
      return next({ path: "/Unauthorized" }); // Redirige si l'utilisateur n'a pas le rôle requis
    }
  }

  // Si aucune condition n'est bloquante, continue la navigation
  next();
});

export default router;
