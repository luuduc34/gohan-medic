<template>
  <div class="product-management-page">
    <h1 class="page-title">Gestion des Produits</h1>

    <!-- Searchbar -->
    <div class="search-container">
      <SearchBar v-model:searchQuery="searchQuery" />
    </div>

    <!-- Bouton pour Ajouter un Produit -->
    <div class="top-actions">
      <router-link to="/Gestion/Produits/Nouveau" class="add-btn">
        Ajouter un Produit
      </router-link>
    </div>

    <!-- Tableau des Produits -->
    <ul v-if="filteredProducts.length > 0" class="product-list">
      <li v-for="product in filteredProducts" :key="product.id" class="product-item">
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
import SearchBar from "@/components/SearchBar/SearchBar.vue";

export default {
  name: "ProductManagementPage",
  components: {
    SearchBar,
  },
  data() {
    return {
      searchQuery: "", // Texte de recherche
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
  computed: {
    filteredProducts() {
      // Filtrer les produits selon la recherche
      return this.products.filter((product) =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
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
/* Page principale */
.product-management-page {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9fbff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Titre de la page */
.page-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: #2d9cdb;
  margin-bottom: 20px;
}

/* Actions en haut */
.top-actions {
  text-align: right;
  margin-bottom: 20px;
}

/* Bouton pour ajouter un produit */
.add-btn {
  background-color: #28a745;
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
}

.add-btn:hover {
  background-color: #218838;
}

/* Liste des produits */
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

/* Lien de modification */
.modify-link {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.modify-link:hover {
  text-decoration: underline;
}

/* Bouton de suppression */
.delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  font-weight: bold;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #c0392b;
}
</style>
