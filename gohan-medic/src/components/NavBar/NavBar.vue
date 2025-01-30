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
      showCatalogDropdown: false,
      showGestionDropdown: false,
      showOrdonnanceDropdown: false,
      isOpen: false,
      screenWidth: window.innerWidth,
      categories: [],
      pendingCount: 0,
      notificationCount: 0,
      isCatalogDropdownOpen: false, // Ajout d'une variable pour contrôler l'état de l'ouverture en mobile
      isGestionDropdownOpen: false, // Ajout d'une variable pour l'admin
      isOrdonnanceDropdownOpen: false, // Ajout d'une variable pour l'utilisateur
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    isAuthenticated() {
      return this.userStore.isAuthenticated;
    },
    isAdmin() {
      return this.userStore.isAdmin;
    },
    isMobile() {
      return this.screenWidth < 1200; // Détecte si l'écran est en mode mobile
    },
  },
  methods: {
    async fetchPendingPrescriptions() {
      try {
        if (this.isAdmin) {
          const count = await fetchPendingPrescriptionsCount();
          console.log("Nombre d'ordonnances en attente (NavBar) :", count);
          this.pendingCount = count || 0; // Assurez-vous que la valeur est définie
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des ordonnances en attente :",
          error
        );
      }
    },

    toggleMenu() {
      this.isOpen = !this.isOpen;
      this.closeAllDropdowns();
    },

    closeMenu() {
      this.isOpen = false;
      this.closeAllDropdowns();
    },

    openCatalogMenu() {
      if (this.showCatalogDropdown) {
        this.showCatalogDropdown = !this.showCatalogDropdown;
      } else {
        this.closeAllDropdowns();
        this.showCatalogDropdown = !this.showCatalogDropdown;
      }
    },

    openGestionMenu() {
      if (this.showGestionDropdown) {
        this.showGestionDropdown = !this.showGestionDropdown;
      } else {
        this.closeAllDropdowns();
        this.showGestionDropdown = !this.showGestionDropdown;
      }
    },

    openOrdonnanceMenu() {
      if (this.showOrdonnanceDropdown) {
        this.showOrdonnanceDropdown = !this.showOrdonnanceDropdown;
      } else {
        this.closeAllDropdowns();
        this.showOrdonnanceDropdown = !this.showOrdonnanceDropdown;
      }
    },

    closeAllDropdowns() {
      this.showCatalogDropdown = false;
      this.showGestionDropdown = false;
      this.showOrdonnanceDropdown = false;
    },

    async fetchCategories() {
      const categories = await fetchCategoryProducts();
      this.categories = categories;
    },
    handleCategoryClick(categoryId) {
      this.$router.push({ name: "CataloguePage", query: { category: categoryId } });
      this.closeMenu();
    },
    updateScreenWidth() {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth >= 1200) {
        this.isOpen = false;
      }
    },
    goToCat() {
      if (!this.isMobile) {
        this.$router.push("/Catalogue");
        this.closeMenu();
      }
    },
    goToCatMob() {
      this.$router.push("/Catalogue");
      this.closeMenu();
    },
    goToProm() {
      this.$router.push("/Promotion");
      this.closeMenu();
    },
    goToPrescriptionUpload() {
      this.$router.push("/ordonnance/upload");
      this.closeMenu();
    },
    goToPrescriptionList() {
      this.$router.push("/ordonnance");
      this.closeMenu();
    },
    goToGestionProduits() {
      this.$router.push("/Gestion/Produits");
      this.closeMenu();
    },
    goToGestionPromotions() {
      this.$router.push("/Gestion/Promotions");
      this.closeMenu();
    },
    goToGestionStock() {
      this.$router.push("/Gestion/Stock");
      this.closeMenu();
    },
    goToGestionOrdonnances() {
      this.$router.push("/Gestion/Ordonnances");
      this.closeMenu();
    },
  },
  created() {
    window.addEventListener("updatePendingCount", (event) => {
      if (event.detail !== undefined) {
        this.pendingCount = event.detail;
      }
      console.log("Notifications mises à jour via événement global :", this.pendingCount);
    });

    window.addEventListener("resize", this.updateScreenWidth);
    this.fetchCategories();
    this.fetchPendingPrescriptions(); // Chargement initial
  },

  watch: {
    $route() {
      // Recharge le nombre d'ordonnances en attente à chaque changement de route
      this.fetchPendingPrescriptions();
    },
  },
  beforeUnmount() {
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
