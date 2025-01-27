<template>
  <div class="modify-promotion-page">
    <!-- Titre principal de la page -->
    <h1 class="page-title">Modifier la Promotion</h1>

    <!-- Formulaire de modification de la promotion -->
    <form @submit.prevent="handleSubmit" class="promotion-form" v-if="promotion">
      <!-- Champ pour le nom de la promotion -->
      <label for="name">Nom de la promotion</label>
      <input v-model="promotion.name" id="name" type="text" required />

      <!-- Champ pour le pourcentage de réduction -->
      <label for="discount">Pourcentage de réduction</label>
      <input
        v-model="promotion.discount"
        id="discount"
        type="number"
        min="1"
        max="100"
        required
      />

      <!-- Champ pour la date de début -->
      <label for="start_date">Date de début</label>
      <input v-model="promotion.start_date" id="start_date" type="date" required />

      <!-- Champ pour la date de fin -->
      <label for="end_date">Date de fin</label>
      <input v-model="promotion.end_date" id="end_date" type="date" required />

      <!-- Champ pour les produits associés -->
      <label for="products">Produits associés</label>
      <select v-model="promotion.product_ids" id="products" multiple>
        <option v-for="product in products" :key="product.id" :value="product.id">
          {{ product.name }}
        </option>
      </select>

      <!-- Bouton de soumission -->
      <button type="submit">Modifier</button>
    </form>

    <!-- Message de chargement -->
    <p v-else>Chargement de la promotion...</p>
  </div>
</template>

<script>
import {
  fetchProducts, // Service pour récupérer les produits
  fetchPromotionById, // Service pour récupérer une promotion spécifique
  updatePromotion, // Service pour mettre à jour une promotion
} from "@/services/PromotionService";

export default {
  name: "ModifyPromotionPage", // Nom du composant
  data() {
    return {
      promotion: null, // Contient les détails de la promotion en cours de modification
      products: [], // Liste des produits disponibles
    };
  },
  async created() {
    // Récupère l'ID de la promotion depuis les paramètres de la route
    const promotionId = this.$route.params.id;
    try {
      // Charge les détails de la promotion
      this.promotion = await fetchPromotionById(promotionId);
      // Charge la liste des produits disponibles
      this.products = await fetchProducts();
    } catch (error) {
      console.error("Erreur lors du chargement de la promotion ou des produits :", error);
    }
  },
  methods: {
    // Méthode appelée lors de la soumission du formulaire
    async handleSubmit() {
      try {
        // Appelle le service pour mettre à jour la promotion
        await updatePromotion(this.promotion.id, this.promotion);
        alert("Promotion modifiée avec succès !");
        // Redirige vers la page de gestion des promotions après modification
        this.$router.push("/Gestion/PromotionManagement");
      } catch (error) {
        console.error("Erreur lors de la modification de la promotion :", error);
      }
    },
  },
};
</script>

<style scoped>
/* Conteneur principal de la page */
.modify-promotion-page {
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

/* Style des étiquettes du formulaire */
.promotion-form label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

/* Style des champs d'entrée et du sélecteur */
input,
select {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
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
