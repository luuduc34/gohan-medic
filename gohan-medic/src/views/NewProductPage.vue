<template>
  <div class="add-product-page">
    <!-- Titre principal de la page -->
    <h1 class="page-title">Ajouter un Produit</h1>

    <!-- Formulaire pour ajouter un produit -->
    <form @submit.prevent="handleSubmit" class="add-product-form">
      <!-- Champ pour le nom du produit -->
      <label for="name">Nom du produit</label>
      <input v-model="form.name" id="name" type="text" required />

      <!-- Champ pour le prix du produit -->
      <label for="price">Prix</label>
      <input v-model="form.price" id="price" type="number" step="0.01" required />

      <!-- Champ pour la description du produit -->
      <label for="description">Description</label>
      <textarea v-model="form.description" id="description" rows="3" required></textarea>

      <!-- Sélecteur pour la catégorie du produit -->
      <label for="category">Catégorie</label>
      <select v-model="form.category_id" id="category" required>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>

      <!-- Champ pour l'URL de l'image du produit -->
      <label for="picture">URL de l'image</label>
      <input v-model="form.picture" id="picture" type="url" required />

      <!-- Bouton pour soumettre le formulaire -->
      <button type="submit">Ajouter</button>
    </form>
  </div>
</template>

<script>
import { fetchCategories, addProduct } from "@/services/ProductService"; // Importation des services nécessaires

export default {
  name: "NewProductPage", // Nom du composant
  data() {
    return {
      // Objet contenant les données du formulaire
      form: {
        name: "", // Nom du produit
        price: "", // Prix du produit
        description: "", // Description du produit
        category_id: "", // ID de la catégorie sélectionnée
        picture: "", // URL de l'image du produit
      },
      categories: [], // Liste des catégories disponibles
    };
  },
  async created() {
    // Charger les catégories disponibles au moment de la création du composant
    try {
      this.categories = await fetchCategories();
      console.log("Catégories chargées :", this.categories); // Log des catégories pour vérifier le chargement
    } catch (error) {
      console.error("Erreur lors du chargement des catégories :", error);
    }
  },
  methods: {
    // Méthode pour gérer la soumission du formulaire
    async handleSubmit() {
      console.log("Formulaire soumis avec :", this.form); // Log des données du formulaire
      try {
        // Appeler le service pour ajouter un produit
        await addProduct(this.form);
        alert("Produit ajouté avec succès !");
        // Rediriger vers la page de gestion des stocks après ajout
        this.$router.push("/Gestion/Stock");
      } catch (error) {
        console.error("Erreur lors de l'ajout du produit :", error);
      }
    },
  },
};
</script>

<style scoped>
/* Conteneur principal */
.add-product-page {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9fbff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Style du titre principal */
.page-title {
  text-align: center;
  font-size: 2rem;
  color: #2d9cdb;
  margin-bottom: 20px;
}

/* Style du formulaire */
.add-product-form {
  display: flex;
  flex-direction: column;
}

/* Style des étiquettes */
label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

/* Style des champs d'entrée, de texte, et du sélecteur */
input,
textarea,
select {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

/* Style du bouton */
button {
  padding: 10px;
  background-color: #2d9cdb;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #007bb5;
}
</style>
