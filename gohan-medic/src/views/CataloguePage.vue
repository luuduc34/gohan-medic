<template>
  <h1 class="catalogue-title">Catalogue</h1>
  <div class="wrapper">
    <div class="catalogue">
      <template v-for="product in products" :key="product.id">
        <!-- Affiche une ProductCard, qui gère la promotion en interne -->
        <ProductCard :product="product" @click="openProductDetail(product)" />
      </template>
    </div>
  </div>
</template>

<script>
import ProductCard from "@/components/Product/ProductCard.vue";
import { fetchProducts, fetchProductByIdCategory } from "@/services/ProductService";
import { fetchPromotionsForMultipleProducts } from "@/services/PromotionService";
import { useProductStore } from "@/stores/ProductStore";

export default {
  name: "CataloguePage",
  components: {
    ProductCard,
  },
  data() {
    return {
      products: [],
    };
  },
  async created() {
    const categoryId = this.$route.query.category;

    try {
      let fetchedProducts;

      if (categoryId) {
        // Récupérer les produits pour une catégorie spécifique
        fetchedProducts = await fetchProductByIdCategory(categoryId);
      } else {
        // Récupérer tous les produits si aucune catégorie n'est spécifiée
        fetchedProducts = await fetchProducts();
      }

      // Récupérer les promotions pour tous les produits
      const promotionsByProduct = await fetchPromotionsForMultipleProducts(
        fetchedProducts.map((product) => product.id)
      );

      // Enrichir les produits avec les promotions si applicable
      const enrichedProducts = fetchedProducts.map((product) => {
        const promotion = promotionsByProduct[product.id];
        if (promotion) {
          return { ...product, promotion };
        }
        return product;
      });

      this.products = enrichedProducts;
    } catch (error) {
      console.error("Erreur lors du chargement des produits :", error);
    }
  },
  watch: {
    // Recharger les produits si la catégorie change
    "$route.query.category": "loadProducts",
  },
  methods: {
    async loadProducts() {
      const categoryId = this.$route.query.category;

      try {
        let fetchedProducts;

        if (categoryId) {
          // Récupérer les produits pour une catégorie spécifique
          fetchedProducts = await fetchProductByIdCategory(categoryId);
        } else {
          // Récupérer tous les produits si aucune catégorie n'est spécifiée
          fetchedProducts = await fetchProducts();
        }

        // Récupérer les promotions pour tous les produits en une seule requête
        const promotionsByProduct = await fetchPromotionsForMultipleProducts(
          fetchedProducts.map((product) => product.id)
        );

        // Enrichir les produits avec leurs promotions
        this.products = fetchedProducts.map((product) => {
          const promotion = promotionsByProduct[product.id];
          if (promotion) {
            return { ...product, promotion };
          }
          return product;
        });
      } catch (error) {
        console.error("Erreur lors de la mise à jour des produits :", error);
      }
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

/* Styles pour le catalogue */
.catalogue {
  margin: auto;
  max-width: 1200px;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

/* Réduction de la taille des cartes */
.product-card {
  width: 270px; /* Carte plus étroite */
  height: 380px; /* Hauteur plus ajustée */
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s ease;
  border: 1px solid #ddd;
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

/* Style de l'image */
.product-card img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-bottom: 1px solid #ddd;
  transition: opacity 0.3s;
}

.product-card img:hover {
  opacity: 0.8;
}

/* Informations produit */
.product-info {
  padding: 15px;
  text-align: center;
}

.product-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.product-info span {
  font-size: 1.1rem;
  font-weight: 500;
  color: #2d9cdb; /* Bleu clair */
}

.product-description {
  padding: 10px;
  font-size: 14px;
  color: #555;
  text-align: justify;
  background-color: #fafafa;
  border-top: 1px solid #ddd;
  border-radius: 0 0 12px 12px;
}

/* Responsivité */
@media (max-width: 1024px) {
  .catalogue {
    grid-template-columns: repeat(3, 1fr);
  }

  .product-card {
    width: 250px;
  }
}

@media (max-width: 768px) {
  .catalogue {
    grid-template-columns: repeat(2, 1fr);
  }

  .product-card {
    width: 220px;
  }
}

@media (max-width: 480px) {
  .catalogue {
    grid-template-columns: 1fr;
  }

  .product-card {
    width: 100%;
  }
}
</style>
