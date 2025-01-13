<template>
  <div class="promotion-management-page">
    <h1 class="page-title">Gestion des Promotions</h1>

    <!-- Barre de recherche -->
    <div class="search-container">
      <SearchBar v-model:searchQuery="searchQuery" />
    </div>

    <!-- Bouton pour ajouter une promotion -->
    <div class="top-actions">
      <router-link to="/Gestion/Promotions/Nouveau" class="add-btn">
        Ajouter une Promotion
      </router-link>
    </div>

    <!-- Liste des promotions -->
    <ul v-if="filteredPromotions.length > 0" class="promotion-list">
      <li
        v-for="promotion in filteredPromotions"
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
            class="modify-link"
          >
            Modifier
          </router-link>
          <button
            v-if="promotion.isValid"
            @click="softDeletePromotion(promotion.promotionId)"
            class="delete-btn"
          >
            Supprimer
          </button>
        </div>
      </li>
    </ul>
    <p v-else>Aucune promotion disponible.</p>
  </div>
</template>

<script>
import SearchBar from "@/components/SearchBar/SearchBar.vue";
import {
  fetchPromotionsForManagement,
  softDeletePromotion,
  updatePromotionValidity,
} from "@/services/PromotionService";

export default {
  name: "PromotionManagementPage",
  components: {
    SearchBar,
  },
  data() {
    return {
      searchQuery: "", // Texte de recherche
      promotions: [], // Liste des promotions
    };
  },
  async created() {
    try {
      await updatePromotionValidity(); // Vérifier et mettre à jour les promotions
      this.promotions = await fetchPromotionsForManagement();
      this.sortPromotionsByEndDate(); // Trier les promotions
    } catch (error) {
      console.error("Erreur lors du chargement des promotions :", error);
    }
  },
  computed: {
    filteredPromotions() {
      return this.promotions.filter((promotion) =>
        promotion.productName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    sortPromotionsByEndDate() {
      this.promotions.sort((a, b) => new Date(b.endAt) - new Date(a.endAt));
    },
    async softDeletePromotion(promotionId) {
      if (confirm("Êtes-vous sûr de vouloir désactiver cette promotion ?")) {
        try {
          await softDeletePromotion(promotionId);
          alert("Promotion désactivée avec succès !");
          this.promotions = await fetchPromotionsForManagement();
          this.sortPromotionsByEndDate();
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
/* Conteneur de recherche */
.search-container {
  margin: 20px auto;
  text-align: center;
}

/* Page principale */
.promotion-management-page {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9fbff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Titre de la page */
.page-title {
  text-align: center;
  font-size: 2rem;
  color: #2d9cdb;
  margin-bottom: 20px;
}

/* Actions en haut */
.top-actions {
  text-align: right;
  margin-bottom: 20px;
}

/* Bouton pour ajouter une promotion */
.add-btn {
  background-color: #28a745;
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
}

.add-btn:hover {
  background-color: #218838;
}

/* Liste des promotions */
.promotion-list {
  list-style: none;
  padding: 0;
}

.promotion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #ffffff;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Informations sur la promotion */
.promotion-info h2 {
  margin: 0;
  color: #007bff;
  font-size: 1.2rem;
  font-weight: bold;
}

.promotion-info p {
  margin: 5px 0;
  font-size: 0.9rem;
}

.promotion-info .valid {
  color: #28a745;
  font-weight: bold;
}

.promotion-info .expired {
  color: #e74c3c;
  font-weight: bold;
}

/* Actions sur la promotion */
.promotion-actions {
  display: flex;
  gap: 10px;
}

/* Lien de modification */
.modify-link {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.modify-link:hover {
  text-decoration: underline;
}

/* Bouton de suppression */
.delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  font-weight: bold;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #c0392b;
}
</style>
