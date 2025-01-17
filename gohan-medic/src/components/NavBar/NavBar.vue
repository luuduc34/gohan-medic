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

        <!-- Menu Gestion -->
        <div
          v-if="isAdmin"
          class="dropdown"
          @mouseover="showGestionDropdown = true"
          @mouseleave="showGestionDropdown = false"
        >
          <button class="dropbtn">Gestion</button>
          <div v-if="showGestionDropdown" class="dropdown-menu-nav">
            <button @click="goToGestionProduits">Produits</button>
            <button @click="goToGestionPromotions">Promotions</button>
            <button @click="goToGestionStock">Stock</button>
            <button @click="goToGestionOrdonnances">Ordonnances</button>
          </div>
        </div>

        <!-- Menu Ordonnances pour tous -->
        <div
          v-if="isAuthenticated && !isAdmin"
          class="dropdown"
          @mouseover="showGestionDropdown = true"
          @mouseleave="showGestionDropdown = false"
        >
          <button class="dropbn">Ordonnances</button>
          <div v-if="showGestionDropdown" class="dropdown-menu-nav">
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

export default {
  name: "NavBar",
  data() {
    return {
      showCatalogDropdown: false,
      showGestionDropdown: false,
      isOpen: false,
      screenWidth: window.innerWidth,
      categories: [],
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
  created() {
    window.addEventListener("resize", this.updateScreenWidth);
    this.fetchCategories();
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

/* Ajoute une interaction au survol */
.dropdown:hover .dropdown-menu-nav,
.dropdown:focus-within .dropdown-menu-nav {
  display: block;
}

/* Autres styles pour la navigation */
.nav-container {
  display: flex;
  position: relative;
  flex-direction: column;
  background-color: #f8f8f8;
}

/* Style pour le menu principal */
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
</style>
