<template>
  <div class="home">
    <!-- Section héroïque -->
    <header class="hero-section">
      <h1>Bienvenue sur Gohan-Medic</h1>
      <p>Vos solutions pharmaceutiques en ligne.</p>
    </header>

    <!-- Liste des produits -->
    <section class="product-list-section">
      <h2>Nos produits</h2>
      <div class="product-list">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
    </section>
  </div>
</template>

<script>
import { fetchProducts } from "@/services/ProductService";
import ProductCard from "@/components/Product/ProductCard.vue";

export default {
  name: "HomePage",
  components: {
    ProductCard,
  },
  data() {
    return {
      products: [], // Liste des produits récupérés
    };
  },
  async created() {
    try {
      // Récupération des produits (limité à 5)
      const allProducts = await fetchProducts();
      this.products = allProducts.slice(0, 10); // On limite à 5 produits
    } catch (error) {
      console.error("Erreur lors du chargement des produits :", error.message);
    }
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

/* Liste des produits */
.product-list-section {
  margin: 40px auto;
  max-width: 1200px;
}

.product-list-section h2 {
  font-size: 2rem;
  color: #007bff;
  margin-bottom: 20px;
  text-align: center;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 0 20px;
}
</style>
