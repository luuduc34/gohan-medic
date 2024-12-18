<template>
  <div class="modify-product-page">
    <h1 class="page-title">Modifier un Produit</h1>

    <!-- Liste des produits -->
    <ul v-if="products.length > 0" class="product-list">
      <li v-for="product in products" :key="product.id" class="product-item">
        <span>{{ product.name }}</span>
        <router-link :to="{ name: 'ModifyProductForm', params: { id: product.id } }">
          Modifier
        </router-link>
      </li>
    </ul>
    <p v-else>Aucun produit disponible pour modification.</p>
  </div>
</template>

<script>
import { fetchProducts } from "@/services/ProductService";

export default {
  name: "ModifyProductPage",
  data() {
    return {
      products: [], // Liste des produits
    };
  },
  async created() {
    try {
      this.products = await fetchProducts();
    } catch (error) {
      console.error("Erreur lors du chargement des produits :", error);
    }
  },
  methods: {
    goToModifyProduct(productId) {
      // Redirige vers la page de modification avec l'ID du produit
      this.$router.push({ name: "ModifyProductForm", params: { id: productId } });
    },
  },
};
</script>

<style scoped>
.modify-product-page {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9fbff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.page-title {
  text-align: center;
  font-size: 2rem;
  color: #2d9cdb;
  margin-bottom: 20px;
}

.product-list {
  list-style: none;
  padding: 0;
}

.product-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #ffffff;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
