<template>
  <div class="home">
    <!-- Section héroïque -->
    <header class="hero-section">
      <h1>Bienvenue sur Gohan-Medic</h1>
      <p>Vos solutions pharmaceutiques en ligne.</p>
    </header>

    <!-- Carrousel des nouveautés -->
    <section class="carousel-section">
      <h2>Nouveautés</h2>
      <div class="carousel-container">
        <button class="arrow left" @click="scrollCarousel('newProducts', 'left')">
          ⬅️
        </button>
        <div class="carousel" ref="newProductsCarousel">
          <ProductCard
            v-for="product in newProducts"
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
          <PromotionCard
            v-for="promotion in promotions"
            :key="promotion.id"
            :promotion="promotion"
            @click="openProductDetail(promotion)"
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
import { fetchProducts } from "@/services/ProductService";
import { fetchPromotions } from "@/services/PromotionService";
import ProductCard from "@/components/Product/ProductCard.vue";
import PromotionCard from "@/components/Promotion/PromotionCard.vue";
import { useProductStore } from "@/stores/ProductStore";

export default {
  name: "HomePage",
  components: {
    ProductCard,
    PromotionCard,
  },
  data() {
    return {
      newProducts: [], // Nouveaux produits (moins de 30 jours)
      promotions: [], // Promotions actuelles
    };
  },
  async created() {
    try {
      // Récupération des produits et des promotions
      const allProducts = await fetchProducts();
      const allPromotions = await fetchPromotions();

      // Filtrer les produits ajoutés dans les 30 derniers jours
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);

      this.newProducts = allProducts.filter((product) => {
        const createdAt = new Date(product.created_at);
        return createdAt >= thirtyDaysAgo;
      });

      // Ajouter les promotions
      this.promotions = allPromotions.slice(0, 5); // Limiter les promotions à 10
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error.message);
    }
  },
  methods: {
    scrollCarousel(refName, direction) {
      const carousel = this.$refs[`${refName}Carousel`];
      const scrollAmount = 300; // Distance à faire défiler
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
/* Section héroïque */
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

/* Section avec carrousel */
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

/* Conteneur du carrousel avec les flèches */
.carousel-container {
  position: relative;
  display: flex;
  align-items: center;
}

/* Carrousel */
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

.carousel > * {
  flex: 0 0 auto;
}

/* Boutons de navigation */
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

.arrow:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
