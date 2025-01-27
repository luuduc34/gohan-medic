<template>
  <div class="modify-promotion-page">
    <h1 class="page-title">Modifier la Promotion</h1>
    <form @submit.prevent="handleSubmit" class="promotion-form" v-if="promotion">
      <!-- Nom de la promotion -->
      <label for="name">Nom de la promotion</label>
      <input v-model="promotion.name" id="name" type="text" required />

      <!-- Pourcentage de réduction -->
      <label for="discount">Pourcentage de réduction</label>
      <input
        v-model="promotion.percentage"
        id="discount"
        type="number"
        min="1"
        max="100"
        required
      />

      <!-- Date de début -->
      <label for="start_date">Date de début</label>
      <input v-model="promotion.start_date" id="start_date" type="date" required />

      <!-- Date de fin -->
      <label for="end_date">Date de fin</label>
      <input v-model="promotion.end_date" id="end_date" type="date" required />

      <!-- Produits associés -->
      <label for="products">Produits associés</label>
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
  name: "ModifyPromotionPage",
  data() {
    return {
      promotion: {
        name: "",
        percentage: null,
        start_date: "",
        end_date: "",
        product_ids: [], // Initialisation pour éviter les erreurs
      },
      products: [], // Produits disponibles
    };
  },
  async created() {
    try {
      const promotionId = this.$route.params.id;

      // Récupérez les données de la promotion
      const fetchedPromotion = await fetchPromotionById(promotionId);
      console.log("Données de la promotion récupérées :", fetchedPromotion);

      // Assurez-vous que `product_ids` est bien un tableau
      this.promotion = {
        name: fetchedPromotion.promotion.name || "",
        percentage: fetchedPromotion.promotion.percentage || 0,
        start_date: fetchedPromotion.promotion.start_date || "",
        end_date: fetchedPromotion.promotion.end_date || "",
        product_ids: fetchedPromotion.product_ids || [], // S'assurer que c'est un tableau
      };

      // Chargez les produits disponibles
      this.products = await fetchProducts();
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
    }
  },
  methods: {
    async handleSubmit() {
      try {
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
/* Styles généraux */
.modify-promotion-page {
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
label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}
input,
select {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
button {
  padding: 10px;
  background-color: #2d9cdb;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #007bb5;
}
</style>
