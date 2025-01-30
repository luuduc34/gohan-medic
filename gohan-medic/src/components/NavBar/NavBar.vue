<template>
  <header>
    <nav class="nav-container">
      <div class="menu-toggle" :class="{ open: isOpen }" @click="toggleMenu">
        <div class="bar"></div>
      </div>
      <div class="menu" :class="{ show: isOpen }">
        <div
          class="dropdown"
          @mouseover="!isMobile && (showCatalogDropdown = true)"
          @mouseleave="!isMobile && (showCatalogDropdown = false)"
          @click="isMobile && openCatalogMenu()"
        >
          <button @click="goToCat">Catalogue</button>
          <div v-if="showCatalogDropdown" class="dropdown-menu-nav">
            <button v-if="isMobile" @click="goToCatMob">Tout le catalogue</button>
            <button
              v-for="category in categories"
              :key="category.id"
              @click="handleCategoryClick(category.id)"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
        <button @click="goToProm">Promotion</button>

        <!-- Menu Gestion pour l'administrateur -->
        <div
          v-if="isAdmin"
          class="dropdown"
          @mouseover="!isMobile && (showGestionDropdown = true)"
          @mouseleave="!isMobile && (showGestionDropdown = false)"
          @click="isMobile && openGestionMenu()"
        >
          <button class="dropbtn">
            Gestion
            <span v-if="pendingCount > 0" class="badge">{{ pendingCount }}</span>
          </button>
          <div v-if="showGestionDropdown" class="dropdown-menu-nav">
            <button @click="goToGestionProduits">Produits</button>
            <button @click="goToGestionPromotions">Promotions</button>
            <button @click="goToGestionStock">Stock</button>
            <button @click="goToGestionOrdonnances">
              Ordonnances
              <span v-if="pendingCount > 0" class="badge">{{ pendingCount }}</span>
            </button>
          </div>
        </div>

        <!-- Menu Ordonnances pour les utilisateurs -->
        <div
          v-if="isAuthenticated && !isAdmin"
          class="dropdown"
          @mouseover="!isMobile && (showOrdonnanceDropdown = true)"
          @mouseleave="!isMobile && (showOrdonnanceDropdown = false)"
          @click="isMobile && openOrdonnanceMenu()"
        >
          <button class="dropbn">
            Ordonnances
            <span v-if="notificationCount > 0" class="badge">{{
              notificationCount
            }}</span>
          </button>
          <div v-if="showOrdonnanceDropdown" class="dropdown-menu-nav">
            <button @click="goToPrescriptionUpload">Uploader une ordonnance</button>
            <button @click="goToPrescriptionList">Mes ordonnances</button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { fetchCategoryProducts } from "@/services/CategoryProductService";
import { useUserStore } from "@/stores/UserStore";
import { fetchPendingPrescriptionsCount } from "@/services/PrescriptionService";

export default {
  name: "NavBar",
  data() {
    return {
      showCatalogDropdown: false, // Gère l'affichage du menu déroulant du catalogue
      showGestionDropdown: false, // Gère l'affichage du menu déroulant de gestion (admin)
      showOrdonnanceDropdown: false, // Gère l'affichage du menu déroulant des ordonnances (utilisateur)
      isOpen: false, // État du menu mobile
      screenWidth: window.innerWidth, // Stocke la largeur de l'écran pour adapter l'affichage
      categories: [], // Liste des catégories de produits
      pendingCount: 0, // Nombre d'ordonnances en attente pour l'admin
      notificationCount: 0, // Compteur de notifications (non utilisé pour l’instant)
      isCatalogDropdownOpen: false, // État du menu catalogue en version mobile
      isGestionDropdownOpen: false, // État du menu gestion en version mobile
      isOrdonnanceDropdownOpen: false, // État du menu ordonnance en version mobile
    };
  },
  computed: {
    userStore() {
      return useUserStore(); // Récupère le store utilisateur
    },
    isAuthenticated() {
      return this.userStore.isAuthenticated; // Vérifie si l'utilisateur est connecté
    },
    isAdmin() {
      return this.userStore.isAdmin; // Vérifie si l'utilisateur est un admin
    },
    isMobile() {
      return this.screenWidth < 1200; // Détermine si l'affichage est en mode mobile
    },
  },
  methods: {
    // Récupère le nombre d'ordonnances en attente si l'utilisateur est un admin
    async fetchPendingPrescriptions() {
      try {
        if (this.isAdmin) {
          const count = await fetchPendingPrescriptionsCount();
          console.log("Nombre d'ordonnances en attente (NavBar) :", count);
          this.pendingCount = count || 0;
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des ordonnances en attente :",
          error
        );
      }
    },

    // Ouvre/Ferme le menu mobile
    toggleMenu() {
      this.isOpen = !this.isOpen;
      this.closeAllDropdowns();
    },

    // Ferme complètement le menu mobile
    closeMenu() {
      this.isOpen = false;
      this.closeAllDropdowns();
    },

    // Ouvre/Ferme le menu déroulant du catalogue
    openCatalogMenu() {
      if (this.showCatalogDropdown) {
        this.showCatalogDropdown = !this.showCatalogDropdown;
      } else {
        this.closeAllDropdowns();
        this.showCatalogDropdown = !this.showCatalogDropdown;
      }
    },

    // Ouvre/Ferme le menu déroulant de gestion (admin)
    openGestionMenu() {
      if (this.showGestionDropdown) {
        this.showGestionDropdown = !this.showGestionDropdown;
      } else {
        this.closeAllDropdowns();
        this.showGestionDropdown = !this.showGestionDropdown;
      }
    },

    // Ouvre/Ferme le menu déroulant des ordonnances
    openOrdonnanceMenu() {
      if (this.showOrdonnanceDropdown) {
        this.showOrdonnanceDropdown = !this.showOrdonnanceDropdown;
      } else {
        this.closeAllDropdowns();
        this.showOrdonnanceDropdown = !this.showOrdonnanceDropdown;
      }
    },

    // Ferme tous les menus déroulants
    closeAllDropdowns() {
      this.showCatalogDropdown = false;
      this.showGestionDropdown = false;
      this.showOrdonnanceDropdown = false;
    },

    // Récupère les catégories de produits
    async fetchCategories() {
      const categories = await fetchCategoryProducts();
      this.categories = categories;
    },

    // Redirige vers une catégorie spécifique et ferme le menu
    handleCategoryClick(categoryId) {
      this.$router.push({ name: "CataloguePage", query: { category: categoryId } });
      this.closeMenu();
    },

    // Met à jour la largeur de l'écran pour ajuster l'affichage
    updateScreenWidth() {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth >= 1200) {
        this.isOpen = false;
      }
    },

    // Redirige vers la page Catalogue (version desktop)
    goToCat() {
      if (!this.isMobile) {
        this.$router.push("/Catalogue");
        this.closeMenu();
      }
    },

    // Redirige vers la page Catalogue (version mobile)
    goToCatMob() {
      this.$router.push("/Catalogue");
      this.closeMenu();
    },

    // Redirige vers la page des promotions
    goToProm() {
      this.$router.push("/Promotion");
      this.closeMenu();
    },

    // Redirige vers l'upload d'ordonnance
    goToPrescriptionUpload() {
      this.$router.push("/ordonnance/upload");
      this.closeMenu();
    },

    // Redirige vers la liste des ordonnances
    goToPrescriptionList() {
      this.$router.push("/ordonnance");
      this.closeMenu();
    },

    // Redirige vers la gestion des produits
    goToGestionProduits() {
      this.$router.push("/Gestion/Produits");
      this.closeMenu();
    },

    // Redirige vers la gestion des promotions
    goToGestionPromotions() {
      this.$router.push("/Gestion/Promotions");
      this.closeMenu();
    },

    // Redirige vers la gestion du stock
    goToGestionStock() {
      this.$router.push("/Gestion/Stock");
      this.closeMenu();
    },

    // Redirige vers la gestion des ordonnances
    goToGestionOrdonnances() {
      this.$router.push("/Gestion/Ordonnances");
      this.closeMenu();
    },
  },

  created() {
    // Écoute les mises à jour du nombre d'ordonnances en attente via un événement global
    window.addEventListener("updatePendingCount", (event) => {
      if (event.detail !== undefined) {
        this.pendingCount = event.detail;
      }
      console.log("Notifications mises à jour via événement global :", this.pendingCount);
    });

    // Écoute le redimensionnement de l'écran pour adapter l'affichage
    window.addEventListener("resize", this.updateScreenWidth);

    // Charge les catégories et le nombre d'ordonnances en attente au démarrage
    this.fetchCategories();
    this.fetchPendingPrescriptions();
  },

  watch: {
    // Recharge le nombre d'ordonnances en attente à chaque changement de page
    $route() {
      this.fetchPendingPrescriptions();
    },
  },

  beforeUnmount() {
    // Supprime les écouteurs d'événements au démontage du composant
    window.removeEventListener("updatePendingCount", this.fetchPendingPrescriptions);
    window.removeEventListener("resize", this.updateScreenWidth);
  },
};
</script>

<style>
/* Container du menu */
.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f8f8;
  padding: 10px 20px;
  position: relative; /* Nécessaire pour la position du menu */
}

/* Menu classique (version large) */
.menu {
  background: none;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
}

.menu button {
  background: none;
  border: none;
  padding: 10px 20px;
  text-align: center;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.menu button:hover {
  background-color: #ddd;
  border-radius: 8px;
}

.menu.show {
  display: flex;
}

.menu button:last-child {
  border-bottom: none;
}

/* Styles pour les menus déroulants */
.dropdown {
  background: none;
  position: relative;
  z-index: 9000;
}

.dropdown-menu-nav {
  position: absolute;
  top: 100%;
  left: 0;
  background: none;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 9001;
}

.dropdown-menu-nav button {
  display: block;
  margin: 5px 0;
  width: 100%;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.dropdown-menu-nav button:hover {
  background-color: #f1f1f1;
  color: #333;
  border-radius: 5px;
}

/* Styles pour le menu burger */
.menu-toggle {
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 20px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  position: relative;
}

.bar {
  width: 30px;
  height: 3px;
  background-color: #333;
  position: absolute;
  transition: all 0.3s ease-in-out;
}

.bar::before,
.bar::after {
  content: "";
  width: 30px;
  height: 3px;
  background-color: #333;
  position: absolute;
  left: 0;
  transition: all 0.3s ease-in-out;
}

.bar::before {
  top: -8px;
}

.bar::after {
  bottom: -8px;
}

/* État ouvert (croix) */
.menu-toggle.open .bar {
  background-color: transparent;
}

.menu-toggle.open .bar::before {
  transform: rotate(45deg);
  top: 0;
}

.menu-toggle.open .bar::after {
  transform: rotate(-45deg);
  bottom: 0;
}

/* Transition pour le menu */
.menu.show {
  animation: slideDown 0.3s ease-in-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsive - Mobile (max-width: 1199px) */
@media (max-width: 1199px) {
  /* Menu Burger */
  .menu {
    background: none;
    display: none;
    position: absolute;
    top: 100%;
    width: 100%;
    flex-direction: column;
    background-color: #f8f8f8;
    z-index: 9000;
  }

  .menu.show {
    background: none;
    display: flex;
  }

  .menu-toggle {
    background: none;
    display: flex;
    z-index: 10000;
  }

  .menu button {
    padding: 15px;
    text-align: center;
    font-size: 16px;
    width: 40%;
    background-color: white;
    border-top: 1px solid #ccc;
  }

  .dropdown-menu-nav {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 90%;
    background-color: #f1f1f1;
    border: none;
    box-shadow: none;
    z-index: 1000;
  }

  .dropdown-menu-nav button {
    justify-content: center;
    padding: 12px 15px;
  }
}

/* Responsive - Desktop (min-width: 1200px) */
@media (min-width: 1200px) {
  /* Menu normal (pas burger) */
  .menu {
    display: flex;
    flex-direction: row;
    margin: 0;
  }

  .menu button {
    border-bottom: none;
  }

  .menu-toggle {
    display: none;
  }

  .dropdown-menu-nav {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .dropdown-menu-nav button {
    width: auto;
    padding: 10px 20px;
    font-size: 16px;
  }
}

/* Badge Notifications */
.badge {
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: bold;
  margin-left: 8px;
}
</style>
