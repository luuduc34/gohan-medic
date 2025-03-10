import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/UserStore";
import AuthPage from "@/views/AuthPage.vue";
import ProfilPage from "@/views/ProfilPage.vue";
import CataloguePage from "@/views/CataloguePage.vue";
import HomePage from "@/views/HomePage.vue";
import PanierPage from "@/views/PanierPage.vue";
import UnauthorizedPage from "@/views/UnauthorizedPage.vue";
import PromotionPage from "@/views/PromotionPage.vue";
import GestionPage from "@/views/GestionPage.vue";
import StockManagementPage from "@/views/StockManagementPage.vue";
import ProductDetailPage from "@/views/ProduitDetailPage.vue";
import PrescriptionUploadPage from "@/views/PrescriptionUploadPage.vue";
import PrescriptionListPage from "@/views/PrescriptionListPage.vue";
import PrescriptionManagementPage from "@/views/PrescriptionManagementPage.vue";
import PrescriptionPage from "@/views/PrescriptionPage.vue";
import OrderPage from "@/views/OrderPage.vue";
import OrderDetailPage from "@/views/OrderDetailPage.vue";

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
    path: "/Profil",
    name: "Profil",
    component: ProfilPage,
    meta: { requiresAuth: true },
  },
  { 
    path: "/Order",
    name: "Order",
    component: OrderPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/orders/:id",
    name: "OrderDetails",
    component: OrderDetailPage,
  },
  {
    path: "/Panier",
    name: "Panier",
    component: PanierPage,
  },
  {
    path: "/Gestion",
    name: "Gestion",
    component: GestionPage,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        // Menu Produits
        path: "Produits",
        name: "ProductManagement",
        component: () => import("@/views/ProductManagementPage.vue"),
      },
      {
        path: "Produits/Nouveau",
        name: "NewProductPage",
        component: () => import("@/views/NewProductPage.vue"),
      },
      {
        path: "Produits/Modifier/:id",
        name: "ModifyProductForm",
        component: () => import("@/views/ModifyProductForm.vue"),
        props: true,
      },
      // Menu Promotions
      {
        path: "Promotions",
        name: "PromotionManagement",
        component: () => import("@/views/PromotionManagementPage.vue"),
      },
           
      {
        path: "Promotions/Nouveau",
        name: "NewPromotionPage",
        component: () => import("@/views/NewPromotionPage.vue"),
      },
      {
        path: "Promotions/Modifier/:id",
        name: "ModifyPromotionForm",
        component: () => import("@/views/ModifyPromotionPage.vue"),
        props: true,
      },
      // Menu Stock
      {
        path: '/Gestion/Stock',
        name: 'StockManagementPage',
        component: StockManagementPage,
      },    
      // Menu Ordonnance
      {
        path: "/Gestion/Ordonnances",
        name: "PrescriptionManagementPage",
        component: PrescriptionManagementPage,
        meta: { requiresAuth: true, requiresAdmin: true },
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
  {
    path: "/ordonnances",
    name: "OrdonnancePage",
    component: PrescriptionPage
  },  
  {
    path: "/ordonnance",
    name: "PrescriptionListPage",
    component: PrescriptionListPage, 
  },  
  {
    path: "/ordonnance/upload", 
    name: "PrescriptionUploadPage",
    component: PrescriptionUploadPage, 
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

  // Ajout du hook pour déclencher un événement ou mettre à jour les notifications
  if (to.path.startsWith("/Gestion")) {
    window.dispatchEvent(new Event("updatePendingCount")); // Émet un événement global
  }

  // Si aucune condition n'est bloquante, continue la navigation
  next();
});


export default router;
