<template>
  <header>
    <nav class="nav-container">
      <div class="menu-toggle" :class="{ open: isOpen }" @click="toggleMenu">
        <div class="bar"></div>
      </div>
      <div class="menu" :class="{ show: isOpen }">
        <!-- Menu déroulant pour Catalogue -->
        <div
          class="dropdown"
          @mouseover="showCatalogDropdown = true"
          @mouseleave="showCatalogDropdown = false"
        >
          <button @click="goToCat">Catalogue</button>
          <div v-if="showCatalogDropdown" class="dropdown-menu-nav">
            <!-- Boutons pour chaque catégorie -->
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
      </div>
    </nav>
  </header>
</template>

<script>
import { fetchCategoryProducts } from "@/services/CategoryProductService";

export default {
  name: "NavBar",
  data() {
    return {
      showCatalogDropdown: false, // Contrôle le menu déroulant catalogue
      isOpen: false, // État du menu (fermé par défaut)
      screenWidth: window.innerWidth, // Largeur actuelle de l'écran
      categories: [], // Stocke les catégories récupérées
    };
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen; // Inverse l'état du menu
    },
    async fetchCategories() {
      const categories = await fetchCategoryProducts();
      this.categories = categories;
    },
    handleCategoryClick(categoryId) {
      console.log("Catégorie sélectionnée :", categoryId);
      this.$router.push({ name: "CataloguePage", query: { category: categoryId } });
    },

    // Fonction pour mettre à jour la largeur de l'écran
    updateScreenWidth() {
      this.screenWidth = window.innerWidth;
      // Si l'écran est assez large (par exemple, >= 1200px), fermez le menu
      if (this.screenWidth >= 1200) {
        this.isOpen = false;
      }
    },

    // Navigation
    goToCat() {
      this.$router.push("/Catalogue");
    },
    goToProm() {
      this.$router.push("/Promotion");
    },
  },

  created() {
    // Écoutez les changements de taille de la fenêtre
    window.addEventListener("resize", this.updateScreenWidth);

    this.fetchCategories();
  },

  unmounted() {
    // Nettoyez l'écouteur d'événements lors de la destruction du composant
    window.removeEventListener("resize", this.updateScreenWidth);
  },
};
</script>

<style>
.dropdown {
  position: relative;
  z-index: 9000;
}

.dropdown-menu-nav {
  position: absolute;
  top: 100%;
  left: 10px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 9001;
}

.dropdown-menu-nav button {
  display: block;
  margin: 0 10px;
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

/* Affiche le menu déroulant au survol du bouton */
.dropdown:focus-within .dropdown-menu-nav,
.dropdown:hover .dropdown-menu-nav,
.dropdown-menu-nav:hover {
  display: block;
}

/* Navigation principale */
.nav-container {
  display: flex;
  position: relative;
  flex-direction: column;
  background-color: #f8f8f8;
}

/* Bouton menu burger */
.menu-toggle {
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

/* Menu */
.menu {
  list-style: none;
  margin: 0;
  position: absolute;
  top: 40px;
  left: 10px;
  background: #f8f8f8;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: none; /* Menu masqué par défaut */
  flex-direction: column; /* Par défaut, le menu est en colonne */
  z-index: 1000;
}

.menu.show {
  display: flex;
}

.menu button {
  background: none;
  border: none;
  padding: 10px 20px;
  text-align: left;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
}

.menu button:hover {
  background-color: #f0f0f0;
}

.menu button:last-child {
  border-bottom: none;
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

/* Lorsque l'écran est supérieur à 1200px */
@media (min-width: 1200px) {
  .menu {
    display: flex;
    position: static;
    top: auto;
    left: auto;
    flex-direction: row;
    background: none;
    box-shadow: none;
    border: none;
  }

  .menu button {
    border-bottom: none;
    margin: 0 10px;
  }

  /* Cacher le bouton burger */
  .menu-toggle {
    display: none;
  }
}

/* Lorsque l'écran est inférieur à 1200px */
@media (max-width: 1199px) {
  .menu {
    display: none;
    flex-direction: column;
  }

  .menu.show {
    display: flex;
  }
}
</style>
