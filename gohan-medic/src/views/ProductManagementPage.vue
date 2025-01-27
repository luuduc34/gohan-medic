<template>
  <div class="product-management-page">
    <!-- Titre principal de la page -->
    <h1 class="page-title">Gestion des Produits</h1>

    <!-- Barre de recherche pour filtrer les produits -->
    <div class="search-container">
      <SearchBar v-model:searchQuery="searchQuery" />
    </div>

    <!-- Bouton pour ajouter un nouveau produit -->
    <div class="top-actions">
      <router-link to="/Gestion/Produits/Nouveau" class="add-btn">
        Ajouter un Produit
      </router-link>
    </div>

    <!-- Liste des produits -->
    <ul v-if="filteredProducts.length > 0" class="product-list">
      <!-- Affichage de chaque produit -->
      <li v-for="product in filteredProducts" :key="product.id" class="product-item">
        <!-- Nom du produit -->
        <span>{{ product.name }}</span>
        <div>
          <!-- Bouton pour modifier un produit -->
          <router-link
            :to="{ name: 'ModifyProductForm', params: { id: product.id } }"
            class="modify-link"
          >
            Modifier
          </router-link>
          <!-- Bouton pour supprimer un produit -->
          <button @click="softDelete(product.id)" class="delete-btn">Supprimer</button>
        </div>
      </li>
    </ul>
    <!-- Message affiché lorsqu'il n'y a aucun produit -->
    <p v-else>Aucun produit disponible.</p>
  </div>
</template>

<script>
import { fetchProducts, softDeleteProduct } from "@/services/ProductService"; // Services pour gérer les produits
import SearchBar from "@/components/SearchBar/SearchBar.vue"; // Composant pour la barre de recherche

export default {
  name: "ProductManagementPage", // Nom du composant
  components: {
    SearchBar, // Composant de la barre de recherche
  },
  data() {
    return {
      searchQuery: "", // Texte entré dans la barre de recherche
      products: [], // Liste des produits récupérés depuis le backend
    };
  },
  async created() {
    try {
      // Récupération des produits dès que la page est créée
      this.products = await fetchProducts();
    } catch (error) {
      console.error("Erreur lors du chargement des produits :", error); // Gestion des erreurs
    }
  },
  computed: {
    filteredProducts() {
      // Filtrer les produits en fonction de la recherche (ignorer la casse)
      return this.products.filter((product) =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    async softDelete(productId) {
      // Confirmation avant de supprimer un produit
      if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
        try {
          // Appel de l'API pour supprimer le produit
          await softDeleteProduct(productId);
          alert("Produit supprimé avec succès !");
          // Recharge les produits après suppression
          this.products = await fetchProducts();
        } catch (error) {
          console.error("Erreur lors de la suppression :", error); // Gestion des erreurs
        }
      }
    },
  },
};
</script>

<style scoped>
/* Conteneur principal de la page */
.product-management-page {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9fbff; /* Couleur de fond douce */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Titre principal */
.page-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: #2d9cdb;
  margin-bottom: 20px;
}

/* Conteneur des actions (bouton Ajouter) */
.top-actions {
  text-align: right;
  margin-bottom: 20px;
}

/* Bouton pour ajouter un produit */
.add-btn {
  background-color: #28a745; /* Couleur verte */
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
}

.add-btn:hover {
  background-color: #218838; /* Couleur verte foncée au survol */
}

/* Liste des produits */
.product-list {
  list-style: none;
  padding: 0;
}

/* Style pour chaque élément produit */
.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #ffffff; /* Fond blanc */
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Lien pour modifier un produit */
.modify-link {
  color: #007bff; /* Couleur bleue */
  text-decoration: none;
  font-weight: bold;
}

.modify-link:hover {
  text-decoration: underline; /* Soulignement au survol */
}

/* Bouton pour supprimer un produit */
.delete-btn {
  background-color: #e74c3c; /* Couleur rouge */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  font-weight: bold;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #c0392b; /* Rouge plus foncé au survol */
}
</style>
