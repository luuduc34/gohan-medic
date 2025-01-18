<template>
  <header>
    <nav class="nav-container">
      <div class="menu-toggle" :class="{ open: isOpen }" @click="toggleMenu">
        <div class="bar"></div>
      </div>
      <div class="menu" :class="{ show: isOpen }">
        <div
          class="dropdown"
          @mouseover="showCatalogDropdown = true"
          @mouseleave="showCatalogDropdown = false"
        >
          <button @click="goToCat">Catalogue</button>
          <div v-if="showCatalogDropdown" class="dropdown-menu-nav">
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
          @mouseover="showGestionDropdown = true"
          @mouseleave="showGestionDropdown = false"
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
          @mouseover="showOrdonnanceDropdown = true"
          @mouseleave="showOrdonnanceDropdown = false"
        >
          <button class="dropbn">
            Ordonnances
            <span v-if="notificationCount > 0" class="badge">{{
              notificationCount
            }}</span>
          </button>
          <div v-if="showOrdonnanceDropdown" class="dropdown-menu-nav">
            <button @click="goToPrescriptionUpload">Téléverser une ordonnance</button>
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
  },
  methods: {
    async fetchPendingPrescriptions() {
      try {
        if (this.isAdmin) {
          const count = await fetchPendingPrescriptionsCount();
          this.pendingCount = count;
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
    },
    async fetchCategories() {
      const categories = await fetchCategoryProducts();
      this.categories = categories;
    },
    handleCategoryClick(categoryId) {
      this.$router.push({ name: "CataloguePage", query: { category: categoryId } });
    },
    updateScreenWidth() {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth >= 1200) {
        this.isOpen = false;
      }
    },
    goToCat() {
      this.$router.push("/Catalogue");
    },
    goToProm() {
      this.$router.push("/Promotion");
    },
    goToPrescriptionUpload() {
      this.$router.push("/ordonnance/upload");
    },
    goToPrescriptionList() {
      this.$router.push("/ordonnance");
    },
    goToGestionProduits() {
      this.$router.push("/Gestion/Produits");
    },
    goToGestionPromotions() {
      this.$router.push("/Gestion/Promotions");
    },
    goToGestionStock() {
      this.$router.push("/Gestion/Stock");
    },
    goToGestionOrdonnances() {
      this.$router.push("/Gestion/Ordonnances");
    },
  },
  async created() {
    window.addEventListener("resize", this.updateScreenWidth);
    this.fetchCategories();
    await this.fetchPendingPrescriptions();
  },
  unmounted() {
    window.removeEventListener("resize", this.updateScreenWidth);
  },
};
</script>

<style>
/* Styles pour le menu déroulant Ordonnances */
.dropdown {
  position: relative;
  z-index: 9000;
}

.dropdown-menu-nav {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
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

/* Autres styles pour la navigation */
.nav-container {
  display: flex;
  position: relative;
  flex-direction: column;
  background-color: #f8f8f8;
}

.menu {
  list-style: none;
  margin: 0;
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
