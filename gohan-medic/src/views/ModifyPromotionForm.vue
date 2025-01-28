<template>
  <div class="modify-promotion-form">
    <!-- Titre principal de la page -->
    <h1 class="page-title">Modifier une Promotion</h1>

    <!-- Formulaire de modification -->
    <!-- Affiché uniquement si la promotion est chargée -->
    <form @submit.prevent="handleSubmit" class="promotion-form" v-if="promotion">
      <label for="discount">Pourcentage de réduction</label>
      <input
        v-model="promotion.percentage"
        id="discount"
        type="number"
        min="1"
        max="100"
        required
      />

      <label for="start_date">Date de début</label>
      <input v-model="promotion.start_date" id="start_date" type="date" required />

      <label for="end_date">Date de fin</label>
      <input v-model="promotion.end_date" id="end_date" type="date" required />

      <label for="products">Produits associés</label>
      <select v-model="promotion.product_ids" id="products" multiple>
        <option v-for="product in products" :key="product.id" :value="product.id">
          {{ product.name }}
        </option>
      </select>

      <button type="submit">Modifier</button>
    </form>

    <!-- Message de chargement affiché si les données de la promotion ne sont pas encore prêtes -->
    <p v-else>Chargement de la promotion...</p>
  </div>
</template>

<script>
import { fetchPromotionById, updatePromotion } from "@/services/PromotionService"; // Services pour récupérer et mettre à jour une promotion
import { fetchProducts } from "@/services/ProductService"; // Service pour récupérer les produits disponibles

export default {
  name: "ModifyPromotionForm",
  data() {
    return {
      promotion: null, // Contient les détails de la promotion à modifier
      products: [], // Liste des produits disponibles pour la promotion
    };
  },
  async created() {
    const promotionId = this.$route.params.id;

    try {
      // Fetch the promotion and related data
      const fetchedData = await fetchPromotionById(promotionId);

      if (fetchedData) {
        // Convert the date fields to the required format
        const formatDate = (isoDate) => new Date(isoDate).toISOString().split("T")[0]; // Extract yyyy-MM-dd

        this.promotion = {
          id: fetchedData.promotion.id,
          percentage: fetchedData.promotion.percentage,
          start_date: formatDate(fetchedData.promotion.created_at), // Format date
          end_date: formatDate(fetchedData.promotion.end_at), // Format date
          product_ids: [fetchedData.product.id], // Ensure it's an array
        };
      }

      // Fetch all available products
      this.products = await fetchProducts();
    } catch (error) {
      console.error("Erreur lors du chargement de la promotion ou des produits :", error);
    }
  },

  methods: {
    // Méthode appelée lors de la soumission du formulaire
    async handleSubmit() {
      try {
        // Mettre à jour la promotion avec les nouvelles données
        await updatePromotion(this.promotion.id, this.promotion);
        alert("Promotion modifiée avec succès !");
        // Rediriger vers la page de gestion des promotions après la modification
        this.$router.push("/Gestion/Promotions");
      } catch (error) {
        console.error("Erreur lors de la modification de la promotion :", error);
      }
    },
  },
};
</script>

<style scoped>
/* Conteneur principal de la page */
.modify-promotion-form {
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

/* Style général du formulaire */
.promotion-form {
  display: flex;
  flex-direction: column;
}

/* Style des étiquettes du formulaire */
label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

/* Style des champs d'entrée, zones de texte et menus déroulants */
input,
textarea,
select {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

/* Style du bouton de soumission */
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
