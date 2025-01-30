<template>
  <div class="modify-product-form">
    <!-- Titre principal de la page -->
    <h1 class="page-title">Modifier le Produit</h1>

    <!-- Formulaire pour modifier un produit (affiché uniquement si le produit est chargé) -->
    <form @submit.prevent="handleSubmit" class="product-form" v-if="product">
      <!-- Champ pour modifier le nom du produit -->
      <label for="name">Nom</label>
      <input v-model="product.name" id="name" type="text" required />

      <!-- Champ pour modifier le prix du produit -->
      <label for="price">Prix</label>
      <input v-model="product.price" id="price" type="number" step="0.01" required />

      <!-- Champ pour modifier la description du produit -->
      <label for="description">Description</label>
      <textarea
        v-model="product.description"
        id="description"
        rows="3"
        required
      ></textarea>

      <!-- Sélection de la catégorie associée au produit -->
      <label for="category">Catégorie</label>
      <select v-model="product.category_id" id="category" required>
        <!-- Boucle sur les catégories disponibles -->
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>

      <!-- Champ pour modifier l'URL de l'image du produit -->
      <label for="picture">URL de l'image</label>
      <input v-model="product.picture" id="picture" type="url" required />

      <!-- Bouton pour soumettre les modifications -->
      <button type="submit">Modifier</button>
    </form>

    <!-- Message affiché pendant le chargement des données -->
    <p v-else>Chargement du produit...</p>
  </div>
</template>

<script>
import {
  fetchProductById, // Fonction pour récupérer les détails d'un produit par son ID
  fetchCategories, // Fonction pour récupérer la liste des catégories
  updateProduct, // Fonction pour mettre à jour un produit existant
} from "@/services/ProductService";

export default {
  name: "ModifyProductForm",
  data() {
    return {
      product: null, // Stocke les informations du produit à modifier
      categories: [], // Stocke la liste des catégories disponibles
    };
  },
  async created() {
    const productId = this.$route.params.id; // Récupère l'ID du produit à partir de l'URL

    try {
      // Charge les détails du produit via son ID
      this.product = await fetchProductById(productId);
      // Charge toutes les catégories disponibles
      this.categories = await fetchCategories();
    } catch (error) {
      console.error("Erreur lors du chargement :", error); // Affiche une erreur si les données ne peuvent pas être chargées
    }

    console.log(this.product);
  },

  methods: {
    // Méthode appelée lors de la soumission du formulaire
    async handleSubmit() {
      try {
        // Met à jour le produit avec les données modifiées
        await updateProduct(this.product.id, this.product);
        alert("Produit modifié avec succès !"); // Confirmation pour l'utilisateur
        // Redirige vers la page de gestion des produits
        this.$router.push("/Gestion/Produits");
      } catch (error) {
        console.error("Erreur lors de la modification du produit :", error); // Affiche une erreur si la mise à jour échoue
      }
    },
  },
};
</script>

<style scoped>
/* Conteneur principal de la page */
.modify-product-form {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9fbff; /* Couleur de fond douce */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Effet d'ombre */
}

/* Titre principal */
.page-title {
  text-align: center;
  font-size: 2rem;
  color: #2d9cdb; /* Bleu clair */
  margin-bottom: 20px;
}

/* Formulaire de modification */
.product-form {
  display: flex;
  flex-direction: column; /* Organisation verticale des champs */
}

/* Style général pour les labels */
label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333; /* Texte en gris foncé */
}

/* Style des champs de formulaire */
input,
textarea,
select {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc; /* Bordure grise */
  border-radius: 5px;
  font-size: 1rem;
}

/* Bouton de soumission */
button {
  padding: 10px;
  background-color: #2d9cdb; /* Bleu principal */
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s; /* Transition pour l'effet au survol */
}

button:hover {
  background-color: #007bb5; /* Bleu plus foncé au survol */
}
</style>
