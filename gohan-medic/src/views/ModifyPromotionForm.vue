<template>
  <div class="modify-promotion-form">
    <h1 class="page-title">Modifier une Promotion</h1>

    <form @submit.prevent="handleSubmit" class="promotion-form" v-if="promotion">
      <label for="name">Nom</label>
      <input v-model="promotion.name" id="name" type="text" required />

      <label for="description">Description</label>
      <textarea
        v-model="promotion.description"
        id="description"
        rows="3"
        required
      ></textarea>

      <label for="start_date">Date de début</label>
      <input v-model="promotion.start_date" id="start_date" type="date" required />

      <label for="end_date">Date de fin</label>
      <input v-model="promotion.end_date" id="end_date" type="date" required />

      <label for="discount">Réduction (%)</label>
      <input
        v-model="promotion.discount"
        id="discount"
        type="number"
        min="0"
        max="100"
        required
      />

      <label for="products">Produits inclus</label>
      <select v-model="promotion.product_ids" id="products" multiple>
        <option v-for="product in products" :key="product.id" :value="product.id">
          {{ product.name }}
        </option>
      </select>

      <button type="submit">Modifier</button>
    </form>

    <p v-else>Chargement de la promotion...</p>
  </div>
</template>

<script>
import { fetchPromotionById, updatePromotion } from "@/services/PromotionService";
import { fetchProducts } from "@/services/ProductService";

export default {
  name: "ModifyPromotionForm",
  data() {
    return {
      promotion: null, // Promotion à modifier
      products: [], // Liste des produits disponibles pour la promotion
    };
  },
  async created() {
    const promotionId = this.$route.params.id;

    try {
      // Chargez les détails de la promotion
      this.promotion = await fetchPromotionById(promotionId);
      // Chargez tous les produits disponibles
      this.products = await fetchProducts();
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    }
  },
  methods: {
    async handleSubmit() {
      try {
        // Mettez à jour la promotion
        await updatePromotion(this.promotion.id, this.promotion);
        alert("Promotion modifiée avec succès !");
        this.$router.push("/Gestion/Promotions");
      } catch (error) {
        console.error("Erreur lors de la modification de la promotion :", error);
      }
    },
  },
};
</script>

<style scoped>
.modify-promotion-form {
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

.promotion-form {
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
