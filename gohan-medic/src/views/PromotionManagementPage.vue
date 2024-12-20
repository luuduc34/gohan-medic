<template>
  <div class="promotion-management-page">
    <h1 class="page-title">Gestion des Promotions</h1>

    <div class="action-bar">
      <router-link to="/Gestion/Promotions/Nouveau" class="add-button">
        Ajouter une Promotion
      </router-link>
    </div>

    <div v-if="promotions.length > 0" class="promotion-list">
      <div
        v-for="promotion in promotions"
        :key="promotion.promotionId"
        class="promotion-item"
      >
        <div class="promotion-info">
          <h2>{{ promotion.productName }}</h2>
          <p>Réduction : {{ promotion.percentage }}%</p>
          <p>
            Période : {{ formatDate(promotion.createdAt) }} -
            {{ formatDate(promotion.endAt) }}
          </p>
          <p :class="{ valid: promotion.isValid, expired: !promotion.isValid }">
            {{ promotion.isValid ? "Valide" : "Expirée" }}
          </p>
        </div>
        <div class="promotion-actions">
          <router-link
            v-if="promotion.isValid"
            :to="{ name: 'ModifyPromotionForm', params: { id: promotion.promotionId } }"
            class="edit-button"
          >
            Modifier
          </router-link>

          <button
            v-if="promotion.isValid"
            @click="softDeletePromotion(promotion.promotionId)"
            class="delete-button"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
    <p v-else>Aucune promotion disponible.</p>
  </div>
</template>

<script>
import {
  fetchPromotionsForManagement,
  softDeletePromotion,
  updatePromotionValidity,
} from "@/services/PromotionService";

export default {
  name: "PromotionManagementPage",
  data() {
    return {
      promotions: [],
    };
  },
  async created() {
    try {
      await updatePromotionValidity(); // Vérifier et mettre à jour les promotions
      this.promotions = await fetchPromotionsForManagement();
    } catch (error) {
      console.error("Erreur lors du chargement des promotions :", error);
    }
  },
  methods: {
    async softDeletePromotion(promotionId) {
      if (confirm("Êtes-vous sûr de vouloir désactiver cette promotion ?")) {
        try {
          await softDeletePromotion(promotionId);
          alert("Promotion désactivée avec succès !");
          this.promotions = await fetchPromotionsForManagement(); // Rafraîchir la liste
        } catch (error) {
          console.error("Erreur lors de la désactivation :", error);
        }
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
  },
};
</script>

<style scoped>
.promotion-management-page {
  max-width: 800px;
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

.action-bar {
  text-align: right;
  margin-bottom: 20px;
}

.add-button {
  padding: 10px;
  background-color: #28a745;
  color: white;
  font-weight: bold;
  text-decoration: none;
  border-radius: 5px;
}

.add-button:hover {
  background-color: #218838;
}

.promotion-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.promotion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.promotion-info h2 {
  margin: 0;
  color: #007bff;
}

.promotion-info p {
  margin: 5px 0;
}

.promotion-actions {
  display: flex;
  gap: 10px;
}

.edit-button,
.delete-button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.edit-button {
  background-color: #007bff;
}

.edit-button:hover {
  background-color: #0056b3;
}

.delete-button {
  background-color: #e74c3c;
}

.delete-button:hover {
  background-color: #c0392b;
}
</style>
