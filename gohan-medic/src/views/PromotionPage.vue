<template>
  <h1 class="catalogue-title">Promotions</h1>
  <div class="wrapper">
    <div class="catalogue">
      <!-- Utilisation de la carte produit pour afficher les promotions -->
      <ProductCard
        v-for="product in promotions"
        :key="product.id"
        :product="product"
        @click="openProductDetail(product)"
      />
    </div>
  </div>
</template>

<script>
import ProductCard from "@/components/Product/ProductCard.vue"; // Carte Produit
import { fetchProducts } from "@/services/ProductService"; // Service des Produits
import { fetchPromotionsForMultipleProducts } from "@/services/PromotionService"; // Service des Promotions
import { useProductStore } from "@/stores/ProductStore";

export default {
  name: "PromotionPage",
  components: {
    ProductCard, // Carte produit importée
  },
  data() {
    return {
      promotions: [],
    };
  },
  async created() {
    try {
      // Récupérer tous les produits
      const fetchedProducts = await fetchProducts();

      // Récupérer les promotions pour tous les produits
      const promotionsByProduct = await fetchPromotionsForMultipleProducts(
        fetchedProducts.map((product) => product.id)
      );

      // Filtrer les produits qui ont une promotion
      this.promotions = fetchedProducts
        .filter((product) => promotionsByProduct[product.id]) // Seulement ceux avec une promotion
        .map((product) => ({
          ...product,
          promotion: promotionsByProduct[product.id], // Ajout des détails de promotion au produit
        }));
    } catch (error) {
      console.error("Erreur lors du chargement des promotions :", error);
    }
  },
  methods: {
    openProductDetail(product) {
      const productStore = useProductStore();
      productStore.setProduct(product);
      this.$router.push({ name: "ProductDetail" });
    },
  },
};
</script>

<style scoped>
/* Titre du catalogue */
.catalogue-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #2d9cdb; /* Bleu pharmaceutique */
  margin-bottom: 30px;
  padding: 15px;
  background-color: #e3f2fd; /* Bleu clair doux */
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Wrapper */
.wrapper {
  margin: auto;
  max-width: 1200px;
}

/* Catalogue */
.catalogue {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 colonnes */
  gap: 1rem;
  padding: 10px;
}

/* Carte de promotion */
.promotion-card {
  width: 220px;
  height: 320px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #ddd;
}

.promotion-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* Image */
.promotion-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-bottom: 1px solid #ddd;
  transition: opacity 0.3s;
}

.promotion-card img:hover {
  opacity: 0.8;
}

/* Infos produit */
.promotion-info {
  padding: 15px;
  text-align: center;
}

.promotion-info h3 {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.promotion-info .original-price {
  text-decoration: line-through;
  color: #888;
}

.promotion-info .discounted-price {
  color: #d32f2f;
  font-weight: bold;
}

.promotion-info .percentage {
  color: #388e3c;
  font-weight: bold;
  margin-top: 5px;
}

/* Description produit */
.product-description {
  padding: 10px;
  font-size: 0.9rem;
  color: #555;
  text-align: justify;
  background-color: #fafafa;
  border-top: 1px solid #ddd;
  border-radius: 0 0 12px 12px;
}

/* Responsivité */
@media (max-width: 1024px) {
  .catalogue {
    grid-template-columns: repeat(3, 1fr); /* 3 colonnes */
  }

  .promotion-card {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .catalogue {
    grid-template-columns: repeat(2, 1fr); /* 2 colonnes */
  }

  .promotion-card {
    width: 180px;
  }
}

@media (max-width: 480px) {
  .catalogue {
    grid-template-columns: 1fr; /* 1 colonne */
  }

  .promotion-card {
    width: 100%;
  }
}
</style>
