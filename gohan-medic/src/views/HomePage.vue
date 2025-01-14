<template>
  <div class="home">
    <!-- Section héroïque -->
    <header class="hero-section">
      <h1>Bienvenue sur Gohan-Medic</h1>
      <p>Vos solutions pharmaceutiques en ligne.</p>
    </header>

    <!-- Section de recherche -->
    <div class="search-container">
      <SearchBar v-model:searchQuery="searchQuery" />
    </div>

    <!-- Carrousel des nouveautés -->
    <section class="carousel-section">
      <h2>Nouveautés</h2>
      <div class="carousel-container">
        <button class="arrow left" @click="scrollCarousel('newProducts', 'left')">
          ⬅️
        </button>
        <div class="carousel" ref="newProductsCarousel">
          <ProductCard
            v-for="product in filteredNewProducts"
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

    <!-- Carrousel des promotions -->
    <section class="carousel-section">
      <h2>Promotions</h2>
      <div class="carousel-container">
        <button class="arrow left" @click="scrollCarousel('promotions', 'left')">
          ⬅️
        </button>
        <div class="carousel" ref="promotionsCarousel">
          <ProductCard
            v-for="product in filteredPromotions"
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
      searchQuery: "", // Requête de recherche
      newProducts: [], // Nouveaux produits
      promotions: [], // Produits en promotion
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
};
</script>

<style scoped>
/* Ajout de style pour le conteneur de recherche */
.search-container {
  margin: 20px auto;
  text-align: center;
}

/* Section héroïque et autres styles */
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

.carousel-container {
  position: relative;
  display: flex;
  align-items: center;
}

.carousel {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 10px;
  scroll-behavior: smooth;
}

.carousel::-webkit-scrollbar {
  height: 8px;
}

.carousel::-webkit-scrollbar-thumb {
  background: #007bff;
  border-radius: 8px;
}

.carousel::-webkit-scrollbar-track {
  background: #f0f0f0;
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.arrow.left {
  left: -20px;
}

.arrow.right {
  right: -20px;
}

.arrow:hover {
  background: #0056b3;
}
</style>
