<template>
  <div class="new-promotion-page">
    <h1 class="page-title">Ajouter une Promotion</h1>

    <form @submit.prevent="handleSubmit" class="promotion-form">
      <label for="percentage">Pourcentage de réduction</label>
      <input
        v-model="form.percentage"
        id="percentage"
        type="number"
        min="1"
        max="100"
        required
      />

      <label for="start_date">Date de début</label>
      <input v-model="form.start_date" id="start_date" type="date" required />

      <label for="end_date">Date de fin</label>
      <input v-model="form.end_date" id="end_date" type="date" required />

      <label for="product_id">Produit associé</label>
      <select v-model="form.product_id" id="product_id" required>
        <option v-for="product in products" :key="product.id" :value="product.id">
          {{ product.name }}
        </option>
      </select>

      <button type="submit">Ajouter</button>
    </form>
  </div>
</template>

<script>
import { fetchProducts } from "@/services/ProductService";
import { addPromotion } from "@/services/PromotionService";

export default {
  name: "NewPromotionPage",
  data() {
    return {
      form: {
        percentage: null,
        start_date: "",
        end_date: "",
        product_id: "",
      },
      products: [], // Liste des produits disponibles
    };
  },
  async created() {
    try {
      this.products = await fetchProducts();
    } catch (error) {
      console.error("Erreur lors du chargement des produits :", error);
    }
  },
  methods: {
    async handleSubmit() {
      try {
        const promotionData = {
          percentage: this.form.percentage,
          created_at: this.form.start_date,
          end_at: this.form.end_date,
        };
        if (new Date(this.form.start_date) > new Date(this.form.end_date)) {
          alert("La date de début ne peut pas être postérieure à la date de fin.");
          return;
        }

        // Appeler la fonction pour ajouter la promotion
        await addPromotion(promotionData, this.form.product_id);

        alert("Promotion ajoutée avec succès !");
        this.$router.push("/Gestion/Promotions");
      } catch (error) {
        console.error("Erreur lors de l'ajout de la promotion :", error);
        alert("Erreur : " + error.message);
      }
    },
  },
};
</script>

<style scoped>
.new-promotion-page {
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
