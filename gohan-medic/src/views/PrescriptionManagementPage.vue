<template>
  <div class="prescription-management-page">
    <!-- Titre principal de la page -->
    <h1 class="page-title">Gestion des Ordonnances</h1>

    <!-- Section des filtres pour sélectionner les statuts des ordonnances -->
    <div class="filter-container">
      <!-- Génération dynamique des options de filtre -->
      <label v-for="status in statusOptions" :key="status.value" class="filter-label">
        <input type="checkbox" :value="status.value" v-model="selectedStatuses" />
        {{ status.label }}
      </label>
    </div>

    <!-- Tableau affichant les prescriptions filtrées -->
    <table v-if="filteredPrescriptions.length > 0" class="prescription-table">
      <thead>
        <tr>
          <th>Ordonnance</th>
          <!-- Colonne pour le lien vers l'ordonnance -->
          <th>Statut</th>
          <!-- Colonne pour afficher le statut de l'ordonnance -->
          <th>Actions</th>
          <!-- Colonne pour les actions disponibles -->
        </tr>
      </thead>
      <tbody>
        <!-- Boucle pour afficher les ordonnances filtrées -->
        <!-- V-for : Ajout d'une classe pour le style selon le statut -->
        <tr
          v-for="prescription in filteredPrescriptions"
          :key="prescription.prescription_id"
          :class="prescription.status"
        >
          <!-- Colonne pour le lien vers l'ordonnance -->
          <td>
            <a :href="prescription.file_url" target="_blank">
              {{ prescription.comment || "Pas de commentaire" }}
            </a>
          </td>
          <!-- Colonne pour afficher le statut -->
          <td>{{ prescription.status }}</td>
          <!-- Colonne pour les boutons d'actions -->
          <td class="actions">
            <!-- Bouton pour approuver une ordonnance -->
            <button
              v-if="prescription.status === 'en attente'"
              class="approve-btn"
              @click="approvePrescription(prescription.prescription_id)"
            >
              Approuver
            </button>
            <!-- Bouton pour rejeter une ordonnance -->
            <button
              v-if="prescription.status === 'en attente'"
              class="reject-btn"
              @click="rejectPrescription(prescription.prescription_id)"
            >
              Rejeter
            </button>
            <!-- Bouton pour passer une ordonnance en préparation -->
            <button
              v-if="prescription.status === 'approuvée'"
              class="status-btn"
              @click="updateStatus(prescription.prescription_id, 'en préparation')"
            >
              Passer en préparation
            </button>
            <!-- Bouton pour finaliser une ordonnance -->
            <button
              v-if="prescription.status === 'en préparation'"
              class="status-btn"
              @click="updateStatus(prescription.prescription_id, 'finalisée')"
            >
              Finaliser
            </button>
            <!-- Bouton pour marquer une ordonnance comme délivrée -->
            <button
              v-if="prescription.status === 'finalisée'"
              class="status-btn"
              @click="updateStatus(prescription.prescription_id, 'délivrée')"
            >
              Marquer comme délivrée
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Message affiché lorsqu'il n'y a aucune ordonnance -->
    <p v-else>Aucune ordonnance à afficher.</p>
  </div>
</template>

<script>
import {
  fetchPrescriptions, // Fonction pour récupérer les ordonnances
  updatePrescriptionStatus, // Fonction pour mettre à jour le statut des ordonnances
} from "@/services/PrescriptionService";

export default {
  name: "PrescriptionManagementPage", // Nom du composant
  data() {
    return {
      prescriptions: [], // Liste des ordonnances
      // Options de statut disponibles pour le filtre
      statusOptions: [
        { value: "en attente", label: "En attente" },
        { value: "approuvée", label: "Approuvée" },
        { value: "en préparation", label: "En préparation" },
        { value: "finalisée", label: "Finalisée" },
        { value: "délivrée", label: "Délivrée" },
        { value: "rejetée", label: "Rejetée" },
      ],
      selectedStatuses: ["en attente"], // Statuts sélectionnés par défaut
    };
  },
  computed: {
    // Liste des prescriptions filtrées en fonction des statuts sélectionnés
    filteredPrescriptions() {
      if (this.selectedStatuses.length === 0) {
        return this.prescriptions; // Si aucun statut n'est sélectionné, afficher tout
      }
      return this.prescriptions.filter((prescription) =>
        this.selectedStatuses.includes(prescription.status)
      );
    },
  },
  async created() {
    this.loadPrescriptions(); // Charger les ordonnances au moment de la création du composant
  },
  methods: {
    async loadPrescriptions() {
      try {
        const prescriptions = await fetchPrescriptions(); // Récupérer les données des ordonnances

        // Trier les prescriptions par statut et date de création
        this.prescriptions = prescriptions.sort((a, b) => {
          const statusPriority = {
            "en attente": 1,
            approuvée: 2,
            "en préparation": 3,
            finalisée: 4,
            délivrée: 5,
          };
          const statusDiff =
            (statusPriority[a.status] || 100) - (statusPriority[b.status] || 100);
          if (statusDiff !== 0) {
            return statusDiff;
          }
          return new Date(b.created_at) - new Date(a.created_at);
        });
      } catch (error) {
        console.error("Erreur lors du chargement des ordonnances :", error);
      }
    },
    async approvePrescription(prescription_id) {
      try {
        await updatePrescriptionStatus(prescription_id, "approuvée"); // Mise à jour du statut
        await this.loadPrescriptions(); // Recharger les données après mise à jour
        alert("Prescription approuvée !");
      } catch (error) {
        console.error("Erreur lors de l'approbation :", error);
        alert("Impossible d'approuver la prescription.");
      }
    },

    async rejectPrescription(prescription_id) {
      const reason = prompt("Indiquez la raison du rejet :"); // Demander une raison de rejet
      if (!reason) return;
      try {
        await updatePrescriptionStatus(prescription_id, "rejetée", reason);
        await this.loadPrescriptions();
        alert("Prescription rejetée !");
      } catch (error) {
        console.error("Erreur lors du rejet :", error);
        alert("Impossible de rejeter la prescription.");
      }
    },
    async updateStatus(prescription_id, newStatus) {
      try {
        await updatePrescriptionStatus(prescription_id, newStatus);
        await this.loadPrescriptions();
        alert(`Statut mis à jour : ${newStatus}`);
      } catch (error) {
        console.error("Erreur lors de la mise à jour du statut :", error);
        alert("Impossible de mettre à jour le statut.");
      }
    },
  },
};
</script>

<style scoped>
.prescription-management-page {
  max-width: 800px; /* Largeur maximale de la page */
  margin: 20px auto;
  padding: 20px;
  background-color: #f9fbff; /* Couleur de fond */
  border-radius: 10px; /* Coins arrondis */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Ombre douce */
}

/* Titre principal */
.page-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: #2d9cdb;
  margin-bottom: 20px;
}

/* Conteneur des filtres */
.filter-container {
  display: flex;
  gap: 10px; /* Espacement entre les options */
  margin-bottom: 20px;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

/* Tableau des prescriptions */
.prescription-table {
  width: 100%;
  border-collapse: collapse; /* Suppression des espaces entre les bordures */
  margin-top: 20px;
}

.prescription-table th,
.prescription-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.prescription-table th {
  background-color: #f4f4f4; /* Fond clair pour l'entête */
  font-weight: bold;
}

/* Style des lignes selon le statut */
.prescription-table tr.rejetée {
  background-color: #f8d7da;
}

/* Boutons d'action */
.actions button {
  margin-right: 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.actions .approve-btn {
  background-color: #28a745; /* Vert */
  color: white;
}

.actions .reject-btn {
  background-color: #e74c3c; /* Rouge */
  color: white;
}

.actions .status-btn {
  background-color: #ffc107; /* Jaune */
  color: white;
}
</style>
