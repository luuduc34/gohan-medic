<template>
  <div class="ordonnance-management-page">
    <h1 class="page-title">Gestion des Ordonnances</h1>

    <!-- Searchbar -->
    <div class="search-container">
      <SearchBar v-model:searchQuery="searchQuery" />
    </div>

    <!-- Tableau des Ordonnances -->
    <ul v-if="filteredOrdonnances.length > 0" class="ordonnance-list">
      <li
        v-for="ordonnance in filteredOrdonnances"
        :key="ordonnance.id"
        class="ordonnance-item"
      >
        <div class="ordonnance-info">
          <p>
            <strong>Commentaire :</strong> {{ ordonnance.comment || "Sans commentaire" }}
          </p>
          <p><strong>Statut :</strong> {{ ordonnance.status }}</p>
        </div>
        <div class="ordonnance-actions">
          <button @click="approveOrdonnance(ordonnance.id)" class="approve-btn">
            Approuver
          </button>
          <button @click="rejectOrdonnance(ordonnance.id)" class="reject-btn">
            Rejeter
          </button>
          <button @click="changeStatus(ordonnance.id)" class="status-btn">
            Changer Statut
          </button>
        </div>
      </li>
    </ul>
    <p v-else>Aucune ordonnance en attente.</p>
  </div>
</template>

<script>
import SearchBar from "@/components/SearchBar/SearchBar.vue";
import { supabase } from "@/lib/supabaseClient";

export default {
  name: "OrdonnanceManagementPage",
  components: {
    SearchBar,
  },
  data() {
    return {
      searchQuery: "", // Texte de recherche
      ordonnances: [], // Liste des ordonnances
    };
  },
  async created() {
    try {
      const { data, error } = await supabase
        .from("prescription")
        .select("*")
        .neq("status", "delivered"); // Récupère toutes les ordonnances sauf celles déjà "délivrées"

      if (error) {
        throw error;
      }

      this.ordonnances = data;
    } catch (error) {
      console.error("Erreur lors de la récupération des ordonnances :", error.message);
    }
  },
  computed: {
    filteredOrdonnances() {
      // Filtrer les ordonnances selon la recherche
      return this.ordonnances.filter((ordonnance) =>
        ordonnance.comment?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    async approveOrdonnance(id) {
      await this.updateOrdonnanceStatus(id, "approved");
    },
    async rejectOrdonnance(id) {
      const reason = prompt("Raison du rejet :");
      if (reason) {
        await this.updateOrdonnanceStatus(id, "rejected", reason);
      }
    },
    async changeStatus(id) {
      const newStatus = prompt("Nouveau statut (préparation, fabrication, etc.) :");
      if (newStatus) {
        await this.updateOrdonnanceStatus(id, newStatus);
      }
    },
    async updateOrdonnanceStatus(id, status, reason = null) {
      try {
        const { error } = await supabase
          .from("prescription")
          .update({ status, reason })
          .eq("id", id);

        if (error) {
          throw error;
        }

        alert("Statut mis à jour !");
        this.ordonnances = this.ordonnances.filter((ord) => ord.id !== id);
      } catch (error) {
        console.error("Erreur lors de la mise à jour du statut :", error.message);
      }
    },
  },
};
</script>

<style scoped>
/* Page principale */
.ordonnance-management-page {
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
  font-weight: bold;
  color: #2d9cdb;
  margin-bottom: 20px;
}

/* Liste des ordonnances */
.ordonnance-list {
  list-style: none;
  padding: 0;
}

.ordonnance-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #ffffff;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ordonnance-info {
  max-width: 70%;
}

.ordonnance-actions button {
  margin-right: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

/* Bouton d'approbation */
.approve-btn {
  background-color: #28a745;
  color: white;
}

.approve-btn:hover {
  background-color: #218838;
}

/* Bouton de rejet */
.reject-btn {
  background-color: #e74c3c;
  color: white;
}

.reject-btn:hover {
  background-color: #c0392b;
}

/* Bouton de changement de statut */
.status-btn {
  background-color: #ffc107;
  color: white;
}

.status-btn:hover {
  background-color: #e0a800;
}
</style>
