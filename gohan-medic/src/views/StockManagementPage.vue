<template>
  <div class="stock-management-page">
    <!-- Titre principal de la page -->
    <h1 class="page-title">Gestion des Stocks</h1>

    <!-- Barre de recherche pour filtrer les produits -->
    <div class="search-container">
      <!-- Le composant SearchBar est relié à la propriété searchQuery -->
      <SearchBar v-model:searchQuery="searchQuery" />
    </div>

    <!-- Barre d'action avec le bouton d'exportation -->
    <div class="action-bar">
      <!-- Permet d'exporter les stocks au format CSV -->
      <button @click="exportToCSV" class="export-button">Exporter CSV</button>
    </div>

    <!-- Tableau principal pour afficher les produits et leur stock -->
    <table class="stock-table">
      <!-- En-tête du tableau -->
      <thead>
        <tr>
          <th>Produit</th>
          <th>Stock Actuel</th>
          <th>Ajouter Stock</th>
          <th>Mettre à jour</th>
        </tr>
      </thead>
      <!-- Corps du tableau -->
      <tbody>
        <!-- Parcours de la liste des produits filtrés -->
        <tr v-for="product in filteredProducts" :key="product.id">
          <!-- Nom du produit -->
          <td>{{ product.name }}</td>
          <!-- Stock actuel du produit -->
          <td>{{ product.stock }}</td>
          <!-- Champ pour ajouter une quantité au stock actuel -->
          <td>
            <input
              type="number"
              v-model.number="product.newStock"
              min="0"
              placeholder="Quantité"
            />
          </td>
          <!-- Bouton pour mettre à jour le stock -->
          <td>
            <button @click="updateStock(product)">Mettre à jour</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// Importation des services et composants nécessaires
import { fetchProducts, updateProductStock } from "@/services/ProductService";
import { exportToCSV } from "@/utils/ExportUtils";
import SearchBar from "@/components/SearchBar/SearchBar.vue";

export default {
  name: "StockManagementPage", // Nom du composant
  components: {
    SearchBar, // Composant pour la recherche
  },
  data() {
    return {
      searchQuery: "", // Texte de recherche lié à la barre de recherche
      products: [], // Liste des produits avec leurs informations de stock
    };
  },
  async created() {
    try {
      // Récupération de la liste des produits à partir du service
      this.products = await fetchProducts();
      // Ajout d'un champ temporaire "newStock" pour la gestion locale des quantités à ajouter
      this.products = this.products.map((product) => ({
        ...product,
        newStock: 0, // Initialisé à 0 par défaut
      }));
    } catch (error) {
      // Gestion des erreurs lors du chargement des produits
      console.error("Erreur lors du chargement des produits :", error);
    }
  },
  computed: {
    // Propriété calculée pour filtrer les produits selon le texte de recherche
    filteredProducts() {
      return this.products.filter((product) =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    // Méthode pour mettre à jour le stock d'un produit
    async updateStock(product) {
      try {
        // Validation : La quantité ajoutée doit être supérieure à 0
        if (product.newStock > 0) {
          // Appel au service pour mettre à jour le stock dans la base de données
          await updateProductStock(product.id, product.stock + product.newStock);
          // Confirmation à l'utilisateur
          alert(`Stock de ${product.name} mis à jour avec succès !`);
          // Mise à jour locale du stock
          product.stock += product.newStock;
          // Réinitialisation du champ "newStock"
          product.newStock = 0;
        } else {
          // Avertissement si la quantité saisie n'est pas valide
          alert("Veuillez entrer une quantité valide pour mettre à jour le stock.");
        }
      } catch (error) {
        // Gestion des erreurs lors de la mise à jour
        console.error("Erreur lors de la mise à jour du stock :", error);
      }
    },
    // Méthode pour exporter les stocks au format CSV
    exportToCSV() {
      exportToCSV(this.products, "stocks.csv"); // Utilisation de l'utilitaire pour générer le fichier CSV
    },
  },
};
</script>

<style scoped>
/* Styles de la page principale */
.stock-management-page {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9fbff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Style du titre */
.page-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: #2d9cdb;
  margin-bottom: 20px;
}

/* Style pour la barre d'action */
.action-bar {
  text-align: right;
  margin-bottom: 20px;
}

/* Bouton d'exportation */
.export-button {
  background-color: #007bff;
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.export-button:hover {
  background-color: #0056b3;
}

/* Tableau principal */
.stock-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Style des cellules */
.stock-table th,
.stock-table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

/* En-tête du tableau */
.stock-table th {
  background-color: #f2f2f2;
  color: #333;
  font-weight: bold;
}

/* Champ d'entrée pour ajouter du stock */
.stock-table td input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* Bouton de mise à jour */
.stock-table td button {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  font-weight: bold;
  cursor: pointer;
}

.stock-table td button:hover {
  background-color: #218838;
}
</style>
