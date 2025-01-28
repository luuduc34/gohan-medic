<template>
  <div class="home">
    <!-- Section héroïque : introduction de la plateforme -->
    <header class="hero-section">
      <h1>Bienvenue sur Gohan-Medic</h1>
      <p>Vos solutions pharmaceutiques en ligne.</p>
    </header>

    <!-- Barre de recherche pour filtrer les produits -->
    <div class="search-container">
      <SearchBar v-model:searchQuery="searchQuery" />
    </div>

    <!-- Section Nouveautés -->
    <section class="carousel-section">
      <h2>Nouveautés</h2>
      <div class="carousel-container">
        <button class="arrow left" @click="scrollCarousel('newProducts', 'left')">
          ⬅️
        </button>
        <div class="carousel" ref="newProductsCarousel">
          <ProductCard
            v-for="product in filteredNewProducts.slice(0, itemsPerPage * 2)"
            :key="product.id"
            :product="product"
            @click="openProductDetail(product)"
          />
        </div>
        <button class="arrow right" @click="scrollCarousel('newProducts', 'right')">
          ➡️
        </button>
      </div>
    </section>

    <!-- Section Promotions -->
    <section class="carousel-section">
      <h2>Promotions</h2>
      <div class="carousel-container">
        <button class="arrow left" @click="scrollCarousel('promotions', 'left')">
          ⬅️
        </button>
        <div class="carousel" ref="promotionsCarousel">
          <ProductCard
            v-for="product in filteredPromotions.slice(0, itemsPerPage * 2)"
            :key="product.id"
            :product="product"
            @click="openProductDetail(product)"
          />
        </div>
        <button class="arrow right" @click="scrollCarousel('promotions', 'right')">
          ➡️
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import SearchBar from "@/components/SearchBar/SearchBar.vue";
import { fetchProducts } from "@/services/ProductService";
import { fetchPromotionsForMultipleProducts } from "@/services/PromotionService";
import ProductCard from "@/components/Product/ProductCard.vue";
import { useProductStore } from "@/stores/ProductStore";

export default {
  name: "HomePage",
  components: {
    SearchBar,
    ProductCard,
  },
  data() {
    return {
      searchQuery: "",
      newProducts: [],
      promotions: [],
      itemsPerPage: 4, // Défaut : 4 items affichés
    };
  },
  async created() {
    try {
      const allProducts = await fetchProducts();
      const promotionsByProduct = await fetchPromotionsForMultipleProducts(
        allProducts.map((product) => product.id)
      );

      const enrichedProducts = allProducts.map((product) => {
        const promotion = promotionsByProduct[product.id];
        return promotion ? { ...product, promotion } : product;
      });

      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);

      this.newProducts = enrichedProducts.filter((product) => {
        const createdAt = new Date(product.created_at);
        return createdAt >= thirtyDaysAgo;
      });

      this.promotions = enrichedProducts.filter((product) => product.promotion);
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error.message);
    }
  },
  computed: {
    filteredNewProducts() {
      return this.newProducts.filter((product) =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    filteredPromotions() {
      return this.promotions.filter((product) =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    adjustItemsPerPage() {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1200) {
        this.itemsPerPage = 4;
      } else if (screenWidth >= 800) {
        this.itemsPerPage = 3;
      } else {
        this.itemsPerPage = 2;
      }
    },
    scrollCarousel(refName, direction) {
      const carousel = this.$refs[`${refName}Carousel`];
      const scrollAmount = 300;
      carousel.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    },
    openProductDetail(product) {
      const productStore = useProductStore();
      productStore.setProduct(product);
      this.$router.push({ name: "ProductDetail" });
    },
  },
  mounted() {
    this.adjustItemsPerPage();
    window.addEventListener("resize", this.adjustItemsPerPage);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.adjustItemsPerPage);
  },
};
</script>

<style scoped>
.search-container {
  margin: 20px auto;
  text-align: center;
}

.hero-section {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(120deg, #d9e6f2, #f0f8ff);
  color: #333;
}

.hero-section h1 {
  font-size: 3rem;
  font-weight: bold;
}

.hero-section p {
  font-size: 1.25rem;
  margin-top: 10px;
}

.carousel-section {
  margin: 40px auto;
  max-width: 1200px;
}

.carousel-section h2 {
  font-size: 2rem;
  color: #007bff;
  margin-bottom: 20px;
  text-align: center;
}

/* Conteneur du carrousel ajusté */
.carousel-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  overflow: visible; /* Permet d'afficher les flèches correctement */
  max-width: 1200px; /* Limite la largeur */
  margin: 0 auto; /* Centrer le carrousel */
}

/* Ajustement des cartes */
.carousel {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 10px;
  width: 100%;
}

.carousel::-webkit-scrollbar {
  display: none;
}

.carousel::-webkit-scrollbar-thumb {
  background: #007bff;
  border-radius: 8px;
}

.carousel::-webkit-scrollbar-track {
  background: #f0f0f0;
}

/* Taille des cartes produit dynamique selon itemsPerPage */
.carousel .product-card {
  flex: 0 0 calc(100% / v-bind(itemsPerPage) - 1rem);
  max-width: calc(100% / v-bind(itemsPerPage) - 1rem);
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 35px; /* Réduction de la taille */
  height: 35px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10; /* S'assurer que les flèches restent visibles */
}

.arrow.left {
  left: -10px; /* Ajustement pour éviter de dépasser */
}

.arrow.right {
  right: -10px; /* Ajustement pour éviter de dépasser */
}

.arrow:hover {
  background: #0056b3;
}

/* Ajustement dynamique de la taille des cartes */
.carousel .product-card {
  flex: 0 0 calc(100% / v-bind(itemsPerPage) - 1rem);
  max-width: calc(100% / v-bind(itemsPerPage) - 1rem);
}
</style>
