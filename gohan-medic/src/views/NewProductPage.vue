<template>
  <div class="add-product-page">
    <!-- Titre principal -->
    <h1 class="page-title">Ajouter un Produit</h1>

    <!-- Formulaire d'ajout -->
    <form @submit.prevent="handleSubmit" class="add-product-form">
      <!-- Champ Nom -->
      <label for="name">Nom du produit</label>
      <input v-model="form.name" id="name" type="text" required />

      <!-- Champ Prix -->
      <label for="price">Prix</label>
      <input v-model="form.price" id="price" type="number" step="0.01" required />

      <!-- Champ Description -->
      <label for="description">Description</label>
      <textarea v-model="form.description" id="description" rows="3" required></textarea>

      <!-- Champ Catégorie -->
      <label for="category">Catégorie</label>
      <select v-model="form.category_id" id="category" required>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>

      <!-- Champ Image -->
      <label for="picture">URL de l'image</label>
      <input v-model="form.picture" id="picture" type="url" required />

      <!-- Bouton Ajouter -->
      <button type="submit">Ajouter</button>
    </form>
  </div>
</template>

<script>
import { fetchCategories, addProduct } from "@/services/ProductService";

export default {
  name: "NewProductPage",
  data() {
    return {
      form: {
        name: "",
        price: "",
        description: "",
        category_id: "",
        picture: "",
      },
      categories: [], // Liste des catégories
    };
  },
  async created() {
    // Charger les catégories disponibles
    this.categories = await fetchCategories();
    console.log("Catégories chargées :", this.categories);
  },
  methods: {
    async handleSubmit() {
      console.log("Formulaire soumis avec :", this.form);
      try {
        await addProduct(this.form);
        alert("Produit ajouté avec succès !");
        this.$router.push("/Gestion/Stock");
      } catch (error) {
        console.error("Erreur lors de l'ajout du produit :", error);
      }
    },
  },
};
</script>

<style scoped>
.add-product-page {
  max-width: 600px;
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

.add-product-form {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

input,
textarea,
select {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

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
