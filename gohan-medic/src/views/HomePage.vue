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

    <!-- Section pour afficher les nouveaux produits dans un carrousel -->
    <section class="carousel-section">
      <h2>Nouveautés</h2>
      <div class="carousel-container">
        <!-- Bouton pour faire défiler les produits vers la gauche -->
        <button class="arrow left" @click="scrollCarousel('newProducts', 'left')">
          ⬅️
        </button>
        <!-- Conteneur du carrousel -->
        <div class="carousel" ref="newProductsCarousel">
          <!-- Affichage des cartes produit pour les nouveautés -->
          <ProductCard
            v-for="product in filteredNewProducts"
            :key="product.id"
            :product="product"
            @click="openProductDetail(product)"
          />
        </div>
        <!-- Bouton pour faire défiler les produits vers la droite -->
        <button class="arrow right" @click="scrollCarousel('newProducts', 'right')">
          ➡️
        </button>
      </div>
    </section>

    <!-- Section pour afficher les promotions dans un carrousel -->
    <section class="carousel-section">
      <h2>Promotions</h2>
      <div class="carousel-container">
        <!-- Bouton pour faire défiler les produits en promotion vers la gauche -->
        <button class="arrow left" @click="scrollCarousel('promotions', 'left')">
          ⬅️
        </button>
        <!-- Conteneur du carrousel -->
        <div class="carousel" ref="promotionsCarousel">
          <!-- Affichage des cartes produit pour les promotions -->
          <ProductCard
            v-for="product in filteredPromotions"
            :key="product.id"
            :product="product"
            @click="openProductDetail(product)"
          />
        </div>
        <!-- Bouton pour faire défiler les produits en promotion vers la droite -->
        <button class="arrow right" @click="scrollCarousel('promotions', 'right')">
          ➡️
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import SearchBar from "@/components/SearchBar/SearchBar.vue"; // Composant pour la barre de recherche
import { fetchProducts } from "@/services/ProductService"; // Service pour récupérer les produits
import { fetchPromotionsForMultipleProducts } from "@/services/PromotionService"; // Service pour récupérer les promotions
import ProductCard from "@/components/Product/ProductCard.vue"; // Composant pour afficher un produit
import { useProductStore } from "@/stores/ProductStore"; // Store pour gérer les produits

export default {
  name: "HomePage",
  components: {
    SearchBar,
    ProductCard,
  },
  data() {
    return {
      searchQuery: "", // Texte de recherche saisi par l'utilisateur
      newProducts: [], // Liste des nouveaux produits
      promotions: [], // Liste des produits en promotion
    };
  },
  async created() {
    try {
      // Récupérer tous les produits depuis l'API
      const allProducts = await fetchProducts();

      // Récupérer les promotions pour chaque produit
      const promotionsByProduct = await fetchPromotionsForMultipleProducts(
        allProducts.map((product) => product.id) // Envoi de la liste des IDs des produits
      );

      // Enrichir les produits avec les données de promotion
      const enrichedProducts = allProducts.map((product) => {
        const promotion = promotionsByProduct[product.id];
        return promotion ? { ...product, promotion } : product; // Ajout de la promotion si elle existe
      });

      // Filtrer les produits ajoutés dans les 30 derniers jours
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);

      this.newProducts = enrichedProducts.filter((product) => {
        const createdAt = new Date(product.created_at);
        return createdAt >= thirtyDaysAgo; // Seuls les produits récents
      });

      // Filtrer les produits qui ont une promotion
      this.promotions = enrichedProducts.filter((product) => product.promotion);
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error.message);
    }
  },
  computed: {
    // Liste des nouveaux produits filtrés par le texte de recherche
    filteredNewProducts() {
      return this.newProducts.filter((product) =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    // Liste des produits en promotion filtrés par le texte de recherche
    filteredPromotions() {
      return this.promotions.filter((product) =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    // Fonction pour faire défiler un carrousel
    scrollCarousel(refName, direction) {
      const carousel = this.$refs[`${refName}Carousel`];
      const scrollAmount = 300; // Nombre de pixels pour défiler
      carousel.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth", // Défilement fluide
      });
    },
    // Ouvrir la page des détails du produit
    openProductDetail(product) {
      const productStore = useProductStore();
      productStore.setProduct(product); // Stocker le produit dans le store
      this.$router.push({ name: "ProductDetail" }); // Rediriger vers la page de détails
    },
  },
};
</script>

<style scoped>
/* Conteneur de recherche */
.search-container {
  margin: 20px auto;
  text-align: center;
}

/* Section héroïque */
.hero-section {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(120deg, #d9e6f2, #f0f8ff); /* Dégradé de bleu */
  color: #333; /* Texte en gris foncé */
}

.hero-section h1 {
  font-size: 3rem;
  font-weight: bold;
}

.hero-section p {
  font-size: 1.25rem;
  margin-top: 10px;
}

/* Section de carrousel */
.carousel-section {
  margin: 40px auto;
  max-width: 1200px;
}

.carousel-section h2 {
  font-size: 2rem;
  color: #007bff; /* Texte bleu */
  margin-bottom: 20px;
  text-align: center;
}

/* Conteneur du carrousel */
.carousel-container {
  position: relative;
  display: flex;
  align-items: center;
}

.carousel {
  display: flex;
  gap: 1rem;
  overflow-x: auto; /* Défilement horizontal */
  padding: 10px;
  scroll-behavior: smooth; /* Défilement fluide */
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

/* Flèches pour défiler */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #007bff; /* Bleu */
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Ombre */
  z-index: 1;
}

.arrow.left {
  left: -20px;
}

.arrow.right {
  right: -20px;
}

.arrow:hover {
  background: #0056b3; /* Bleu plus foncé au survol */
}
</style>
