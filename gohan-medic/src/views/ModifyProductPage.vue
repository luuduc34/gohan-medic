<template>
  <div class="modify-product-page">
    <!-- Titre principal de la page -->
    <h1 class="page-title">Modifier ou Supprimer un Produit</h1>

    <!-- Liste des produits -->
    <ul v-if="products.length > 0" class="product-list">
      <!-- Boucle sur les produits disponibles -->
      <li v-for="product in products" :key="product.id" class="product-item">
        <!-- Affichage du nom du produit -->
        <span>{{ product.name }}</span>
        <div>
          <!-- Lien vers la page de modification du produit -->
          <router-link
            class="router-link"
            :to="{ name: 'ModifyProductForm', params: { id: product.id } }"
          >
            Modifier
          </router-link>
          <!-- Bouton pour supprimer le produit -->
          <button @click="softDelete(product.id)" class="delete-btn">Supprimer</button>
        </div>
      </li>
    </ul>
    <!-- Message affiché si aucun produit n'est disponible -->
    <p v-else>Aucun produit disponible pour modification.</p>
  </div>
</template>

<script>
import { fetchProducts, softDeleteProduct } from "@/services/ProductService"; // Import des services pour les produits

export default {
  name: "ModifyProductPage",
  data() {
    return {
      products: [], // Liste des produits chargés
    };
  },
  async created() {
    // Chargement des produits lors de la création du composant
    try {
      this.products = await fetchProducts(); // Récupère les produits via le service
    } catch (error) {
      console.error("Erreur lors du chargement des produits :", error);
    }
  },
  methods: {
    // Méthode pour supprimer un produit (soft delete)
    async softDelete(productId) {
      // Confirmation avant suppression
      if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
        try {
          await softDeleteProduct(productId); // Met à jour le produit en base (is_active = false)
          alert("Produit supprimé avec succès !");
          this.products = await fetchProducts(); // Recharge les produits pour mettre à jour la liste affichée
        } catch (error) {
          console.error("Erreur lors de la suppression du produit :", error);
        }
      }
    },
  },
};
</script>

<style scoped>
/* Conteneur principal de la page */
.modify-product-page {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9fbff; /* Couleur de fond douce */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Effet d'ombre */
}

/* Style du titre principal */
.page-title {
  text-align: center;
  font-size: 2rem;
  color: #2d9cdb; /* Bleu clair pour le titre */
  margin-bottom: 20px;
}

/* Liste des produits */
.product-list {
  list-style: none;
  padding: 0;
}

/* Style de chaque produit dans la liste */
.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #ffffff;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Ombre légère */
}

/* Style pour le lien de modification */
.router-link {
  color: #007bff; /* Bleu pour le lien Modifier */
  text-decoration: none;
  font-weight: bold;
}

.router-link:hover {
  text-decoration: underline; /* Souligne le lien au survol */
  color: #0056b3; /* Bleu plus foncé */
}

/* Style général des boutons */
button {
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
}

/* Style pour le bouton Supprimer */
button.delete-btn {
  background-color: #e74c3c; /* Rouge pour indiquer une action destructive */
}

button.delete-btn:hover {
  background-color: #c0392b; /* Rouge plus foncé au survol */
}
</style>
