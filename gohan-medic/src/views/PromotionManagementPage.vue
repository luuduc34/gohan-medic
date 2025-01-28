<template>
  <div class="promotion-management-page">
    <!-- Titre de la page -->
    <h1 class="page-title">Gestion des Promotions</h1>

    <!-- Barre de recherche pour filtrer les promotions par nom de produit -->
    <div class="search-container">
      <SearchBar v-model:searchQuery="searchQuery" />
    </div>

    <!-- Bouton pour ajouter une nouvelle promotion -->
    <div class="top-actions">
      <router-link to="/Gestion/Promotions/Nouveau" class="add-btn">
        Ajouter une Promotion
      </router-link>
    </div>

    <!-- Liste des promotions disponibles -->
    <!-- v-for : Identifiant unique pour chaque promotion -->
    <ul v-if="filteredPromotions.length > 0" class="promotion-list">
      <li
        v-for="promotion in filteredPromotions"
        :key="promotion.promotionId"
        class="promotion-item"
      >
        <!-- Informations sur chaque promotion -->
        <div class="promotion-info">
          <h2>{{ promotion.productName }}</h2>
          <!-- Nom du produit -->
          <p>Réduction : {{ promotion.percentage }}%</p>
          <!-- Pourcentage de réduction -->
          <p>
            Période : {{ formatDate(promotion.createdAt) }} -
            <!-- Date de début -->
            {{ formatDate(promotion.endAt) }}
            <!-- Date de fin -->
          </p>
          <p :class="{ valid: promotion.isValid, expired: !promotion.isValid }">
            {{ promotion.isValid ? "Valide" : "Expirée" }}
            <!-- État de la promotion -->
          </p>
        </div>

        <!-- Actions disponibles sur la promotion -->
        <div class="promotion-actions">
          <!-- Lien pour modifier la promotion si elle est encore valide -->
          <router-link
            v-if="promotion.isValid"
            :to="{ name: 'ModifyPromotionForm', params: { id: promotion.promotionId } }"
            class="modify-link"
          >
            Modifier
          </router-link>
          <!-- Bouton pour désactiver une promotion valide -->
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
    <!-- Message si aucune promotion n'est disponible -->
    <p v-else>Aucune promotion disponible.</p>
  </div>
</template>

<script>
import SearchBar from "@/components/SearchBar/SearchBar.vue"; // Composant pour la barre de recherche
import {
  fetchPromotionsForManagement, // Récupère les promotions disponibles pour la gestion
  softDeletePromotion, // Fonction pour désactiver une promotion
  updatePromotionValidity, // Met à jour l'état des promotions (valide/expirée)
} from "@/services/PromotionService";

export default {
  name: "PromotionManagementPage",
  components: {
    SearchBar, // Barre de recherche
  },
  data() {
    return {
      searchQuery: "", // Texte de recherche entré par l'utilisateur
      promotions: [], // Liste des promotions récupérées depuis le backend
    };
  },
  async created() {
    try {
      // Met à jour la validité des promotions dans la base de données
      await updatePromotionValidity();
      // Récupère la liste des promotions pour la gestion
      this.promotions = await fetchPromotionsForManagement();
      // Trie les promotions en fonction de leur date de fin
      this.sortPromotionsByEndDate();
    } catch (error) {
      console.error("Erreur lors du chargement des promotions :", error);
    }
  },
  computed: {
    // Filtre les promotions en fonction de la recherche
    filteredPromotions() {
      return this.promotions.filter((promotion) =>
        promotion.productName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    // Trie les promotions par date de fin (les plus récentes en premier)
    sortPromotionsByEndDate() {
      this.promotions.sort((a, b) => new Date(b.endAt) - new Date(a.endAt));
    },
    // Désactive une promotion après confirmation de l'utilisateur
    async softDeletePromotion(promotionId) {
      if (confirm("Êtes-vous sûr de vouloir désactiver cette promotion ?")) {
        try {
          await softDeletePromotion(promotionId); // Appelle l'API pour désactiver
          alert("Promotion désactivée avec succès !");
          // Recharge les promotions pour refléter les changements
          this.promotions = await fetchPromotionsForManagement();
          this.sortPromotionsByEndDate(); // Trie à nouveau après mise à jour
        } catch (error) {
          console.error("Erreur lors de la désactivation :", error);
        }
      }
    },
    // Formate une date pour l'afficher sous un format lisible
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
  },
};
</script>

<style scoped>
/* Conteneur de la barre de recherche */
.search-container {
  margin: 20px auto;
  text-align: center;
}

/* Styles principaux pour la page de gestion des promotions */
.promotion-management-page {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9fbff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Titre principal de la page */
.page-title {
  text-align: center;
  font-size: 2rem;
  color: #2d9cdb;
  margin-bottom: 20px;
}

/* Bouton pour ajouter une nouvelle promotion */
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
  color: #28a745; /* Couleur verte pour les promotions valides */
  font-weight: bold;
}

.promotion-info .expired {
  color: #e74c3c; /* Couleur rouge pour les promotions expirées */
  font-weight: bold;
}

/* Actions pour chaque promotion */
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
