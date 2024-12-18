<template>
  <div class="modify-product-form">
    <h1 class="page-title">Modifier le Produit</h1>

    <form @submit.prevent="handleSubmit" class="product-form" v-if="product">
      <label for="name">Nom</label>
      <input v-model="product.name" id="name" type="text" required />

      <label for="price">Prix</label>
      <input v-model="product.price" id="price" type="number" step="0.01" required />

      <label for="description">Description</label>
      <textarea
        v-model="product.description"
        id="description"
        rows="3"
        required
      ></textarea>

      <label for="category">Catégorie</label>
      <select v-model="product.category_id" id="category" required>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>

      <label for="picture">URL de l'image</label>
      <input v-model="product.picture" id="picture" type="url" required />

      <button type="submit">Modifier</button>
    </form>

    <p v-else>Chargement du produit...</p>
  </div>
</template>

<script>
import {
  fetchProductById,
  fetchCategories,
  updateProduct,
} from "@/services/ProductService";

export default {
  name: "ModifyProductForm",
  data() {
    return {
      product: null, // Produit à modifier
      categories: [], // Liste des catégories
    };
  },
  async created() {
    const productId = this.$route.params.id;

    try {
      // Chargez les détails du produit
      this.product = await fetchProductById(productId);
      this.categories = await fetchCategories(); // Chargez les catégories
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    }
  },

  methods: {
    async handleSubmit() {
      try {
        await updateProduct(this.product.id, this.product);
        alert("Produit modifié avec succès !");
        this.$router.push("/Gestion/Stock");
      } catch (error) {
        console.error("Erreur lors de la modification du produit :", error);
      }
    },
  },
};
</script>

<style scoped>
.modify-product-form {
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

.product-form {
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
