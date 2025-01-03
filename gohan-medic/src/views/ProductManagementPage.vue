<template>
  <div class="product-management-page">
    <h1 class="page-title">Gestion des Produits</h1>

    <!-- Bouton pour Ajouter un Produit -->
    <div class="top-actions">
      <router-link to="/Gestion/Produits/Nouveau" class="add-btn"
        >Ajouter un Produit</router-link
      >
    </div>

    <!-- Tableau des Produits -->
    <ul v-if="products.length > 0" class="product-list">
      <li v-for="product in products" :key="product.id" class="product-item">
        <span>{{ product.name }}</span>
        <div>
          <!-- Boutons pour Modifier et Supprimer -->
          <router-link
            :to="{ name: 'ModifyProductForm', params: { id: product.id } }"
            class="modify-link"
          >
            Modifier
          </router-link>
          <button @click="softDelete(product.id)" class="delete-btn">Supprimer</button>
        </div>
      </li>
    </ul>
    <p v-else>Aucun produit disponible.</p>
  </div>
</template>

<script>
import { fetchProducts, softDeleteProduct } from "@/services/ProductService";

export default {
  name: "ProductManagementPage",
  data() {
    return {
      products: [],
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
    async softDelete(productId) {
      if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
        try {
          await softDeleteProduct(productId);
          alert("Produit supprimé avec succès !");
          this.products = await fetchProducts(); // Actualise la liste
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
        }
      }
    },
  },
};
</script>

<style scoped>
.page-title {
  text-align: center;
  font-size: 2rem;
  color: #2d9cdb;
  margin-bottom: 20px;
}

.top-actions {
  text-align: right;
  margin-bottom: 10px;
}

.add-btn {
  background-color: #28a745;
  color: #fff;
  padding: 8px 12px;
  border-radius: 5px;
  text-decoration: none;
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

.modify-link {
  color: #007bff;
  text-decoration: none;
  margin-right: 10px;
}

.modify-link:hover {
  text-decoration: underline;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
}

.delete-btn:hover {
  background-color: #c0392b;
}
</style>
