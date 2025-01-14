<template>
  <div>
    <h1 class="catalogue-title">Catalogue</h1>

    <!-- Barre de recherche -->
    <div class="search-container">
      <SearchBar v-model:searchQuery="searchQuery" />
    </div>

    <div class="wrapper">
      <div class="catalogue">
        <template v-for="product in filteredProducts" :key="product.id">
          <!-- Affiche une ProductCard, qui gère la promotion en interne -->
          <ProductCard :product="product" @click="openProductDetail(product)" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBar from "@/components/SearchBar/SearchBar.vue";
import ProductCard from "@/components/Product/ProductCard.vue";
import { fetchProducts, fetchProductByIdCategory } from "@/services/ProductService";
import { fetchPromotionsForMultipleProducts } from "@/services/PromotionService";
import { useProductStore } from "@/stores/ProductStore";

export default {
  name: "CataloguePage",
  components: {
    SearchBar,
    ProductCard,
  },
  data() {
    return {
      searchQuery: "", // Requête de recherche
      products: [], // Liste des produits
    };
  },
  async created() {
    const categoryId = this.$route.query.category;

    try {
      let fetchedProducts;

      if (categoryId) {
        fetchedProducts = await fetchProductByIdCategory(categoryId);
      } else {
        fetchedProducts = await fetchProducts();
      }

      const promotionsByProduct = await fetchPromotionsForMultipleProducts(
        fetchedProducts.map((product) => product.id)
      );

      this.products = fetchedProducts.map((product) => {
        const promotion = promotionsByProduct[product.id];
        return promotion ? { ...product, promotion } : product;
      });
    } catch (error) {
      console.error("Erreur lors du chargement des produits :", error);
    }
  },
  computed: {
    filteredProducts() {
      return this.products.filter((product) =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  watch: {
    "$route.query.category": "loadProducts",
  },
  methods: {
    async loadProducts() {
      const categoryId = this.$route.query.category;

      try {
        let fetchedProducts;

        if (categoryId) {
          fetchedProducts = await fetchProductByIdCategory(categoryId);
        } else {
          fetchedProducts = await fetchProducts();
        }

        const promotionsByProduct = await fetchPromotionsForMultipleProducts(
          fetchedProducts.map((product) => product.id)
        );

        this.products = fetchedProducts.map((product) => {
          const promotion = promotionsByProduct[product.id];
          return promotion ? { ...product, promotion } : product;
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
/* Styles pour la barre de recherche */
.search-container {
  margin: 20px auto;
  text-align: center;
}

/* Styles existants pour le catalogue */
.catalogue-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #2d9cdb;
  margin-bottom: 30px;
  padding: 15px;
  background-color: #e3f2fd;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.catalogue {
  margin: auto;
  max-width: 1200px;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.product-card {
  width: 270px;
  height: 380px;
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
  color: #2d9cdb;
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
