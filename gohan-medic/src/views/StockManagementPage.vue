<template>
  <div class="stock-management-page">
    <h1 class="page-title">Gestion des Stocks</h1>

    <!-- Searchbar -->
    <div class="search-container">
      <SearchBar v-model:searchQuery="searchQuery" />
    </div>

    <div class="action-bar">
      <button @click="exportToCSV" class="export-button">Exporter CSV</button>
    </div>

    <table class="stock-table">
      <thead>
        <tr>
          <th>Produit</th>
          <th>Stock Actuel</th>
          <th>Ajouter Stock</th>
          <th>Mettre à jour</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts" :key="product.id">
          <td>{{ product.name }}</td>
          <td>{{ product.stock }}</td>
          <td>
            <input
              type="number"
              v-model.number="product.newStock"
              min="0"
              placeholder="Quantité"
            />
          </td>
          <td>
            <button @click="updateStock(product)">Mettre à jour</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { fetchProducts, updateProductStock } from "@/services/ProductService";
import { exportToCSV } from "@/utils/ExportUtils";
import SearchBar from "@/components/SearchBar/SearchBar.vue";

export default {
  name: "StockManagementPage",
  components: {
    SearchBar,
  },
  data() {
    return {
      searchQuery: "", // Texte de recherche
      products: [], // Liste des produits avec leurs stocks
    };
  },
  async created() {
    try {
      this.products = await fetchProducts();
      // Ajouter un champ temporaire pour les nouvelles quantités de stock
      this.products = this.products.map((product) => ({
        ...product,
        newStock: 0, // Par défaut, aucune nouvelle quantité
      }));
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
    async updateStock(product) {
      try {
        if (product.newStock > 0) {
          await updateProductStock(product.id, product.stock + product.newStock);
          alert(`Stock de ${product.name} mis à jour avec succès !`);
          product.stock += product.newStock; // Mettre à jour le stock localement
          product.newStock = 0; // Réinitialiser l'entrée
        } else {
          alert("Veuillez entrer une quantité valide pour mettre à jour le stock.");
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du stock :", error);
      }
    },
    exportToCSV() {
      exportToCSV(this.products, "stocks.csv");
    },
  },
};
</script>

<style scoped>
/* Page principale */
.stock-management-page {
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

/* Bouton pour exporter */
.export-btn {
  background-color: #007bff;
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
}

.export-btn:hover {
  background-color: #0056b3;
}

/* Tableau de gestion des stocks */
.stock-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stock-table th,
.stock-table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

.stock-table th {
  background-color: #f2f2f2;
  color: #333;
  font-weight: bold;
}

.stock-table td input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

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
