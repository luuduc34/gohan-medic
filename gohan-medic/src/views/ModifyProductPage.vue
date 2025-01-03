<template>
  <div class="modify-product-page">
    <h1 class="page-title">Modifier ou Supprimer un Produit</h1>

    <!-- Liste des produits -->
    <ul v-if="products.length > 0" class="product-list">
      <li v-for="product in products" :key="product.id" class="product-item">
        <span>{{ product.name }}</span>
        <div>
          <!-- Lien pour Modifier -->
          <router-link
            class="router-link"
            :to="{ name: 'ModifyProductForm', params: { id: product.id } }"
          >
            Modifier
          </router-link>
          <!-- Bouton pour Supprimer -->
          <button @click="softDelete(product.id)" class="delete-btn">Supprimer</button>
        </div>
      </li>
    </ul>
    <p v-else>Aucun produit disponible pour modification.</p>
  </div>
</template>

<script>
import { fetchProducts, softDeleteProduct } from "@/services/ProductService";

export default {
  name: "ModifyProductPage",
  data() {
    return {
      products: [], // Liste des produits
    };
  },
  async created() {
    try {
      this.products = await fetchProducts(); // Charge les produits au montage
    } catch (error) {
      console.error("Erreur lors du chargement des produits :", error);
    }
  },
  methods: {
    async softDelete(productId) {
      if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
        try {
          await softDeleteProduct(productId); // Met à jour is_active = false
          alert("Produit supprimé avec succès !");
          this.products = await fetchProducts(); // Recharge les produits pour actualiser la liste
        } catch (error) {
          console.error("Erreur lors de la suppression du produit :", error);
        }
      }
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
  align-items: center;
  padding: 10px;
  background-color: #ffffff;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.router-link {
  color: #007bff; /* Bleu pour le lien Modifier */
  text-decoration: none;
  font-weight: bold;
}

.router-link:hover {
  text-decoration: underline;
  color: #0056b3;
}

button {
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
}

button.delete-btn {
  background-color: #e74c3c; /* Rouge pour supprimer */
}

button.delete-btn:hover {
  background-color: #c0392b;
}
</style>
