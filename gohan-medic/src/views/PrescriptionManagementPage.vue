<template>
  <div class="prescription-management-page">
    <h1 class="page-title">Gestion des Ordonnances</h1>

    <!-- Filtres -->
    <div class="filter-container">
      <label v-for="status in statusOptions" :key="status.value" class="filter-label">
        <input type="checkbox" :value="status.value" v-model="selectedStatuses" />
        {{ status.label }}
      </label>
    </div>

    <!-- Tableau des prescriptions -->
    <table v-if="filteredPrescriptions.length > 0" class="prescription-table">
      <thead>
        <tr>
          <th>Ordonnance</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="prescription in filteredPrescriptions"
          :key="prescription.prescription_id"
          :class="prescription.status"
        >
          <!-- Lien vers l'ordonnance -->
          <td>
            <a :href="prescription.file_url" target="_blank">
              {{ prescription.comment || "Pas de commentaire" }}
            </a>
          </td>
          <!-- Statut -->
          <td>{{ prescription.status }}</td>
          <!-- Actions -->
          <td class="actions">
            <button
              v-if="prescription.status === 'en attente'"
              class="approve-btn"
              @click="approvePrescription(prescription.prescription_id)"
            >
              Approuver
            </button>
            <button
              v-if="prescription.status === 'en attente'"
              class="reject-btn"
              @click="rejectPrescription(prescription.prescription_id)"
            >
              Rejeter
            </button>
            <button
              v-if="prescription.status === 'approuvée'"
              class="status-btn"
              @click="updateStatus(prescription.prescription_id, 'en préparation')"
            >
              Passer en préparation
            </button>
            <button
              v-if="prescription.status === 'en préparation'"
              class="status-btn"
              @click="updateStatus(prescription.prescription_id, 'finalisée')"
            >
              Finaliser
            </button>
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
    <p v-else>Aucune ordonnance à afficher.</p>
  </div>
</template>

<script>
import {
  fetchPrescriptions,
  updatePrescriptionStatus,
} from "@/services/PrescriptionService";

export default {
  name: "PrescriptionManagementPage",
  data() {
    return {
      prescriptions: [],
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
        return this.prescriptions; // Si aucun statut n'est sélectionné, tout afficher
      }
      return this.prescriptions.filter((prescription) =>
        this.selectedStatuses.includes(prescription.status)
      );
    },
  },
  async created() {
    this.loadPrescriptions();
  },
  methods: {
    async loadPrescriptions() {
      try {
        const prescriptions = await fetchPrescriptions();

        // Priorité explicite des statuts
        const statusPriority = {
          "en attente": 1,
          approuvée: 2,
          "en préparation": 3,
          finalisée: 4,
          délivrée: 5,
        };

        // Appliquer le tri en deux étapes : statut et date de création
        this.prescriptions = prescriptions.sort((a, b) => {
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
        await updatePrescriptionStatus(prescription_id, "approuvée");
        await this.loadPrescriptions();
        alert("Prescription approuvée !");
      } catch (error) {
        console.error("Erreur lors de l'approbation :", error);
        alert("Impossible d'approuver la prescription.");
      }
    },

    async rejectPrescription(prescription_id) {
      const reason = prompt("Indiquez la raison du rejet :");
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
  font-weight: bold;
  color: #2d9cdb;
  margin-bottom: 20px;
}

.filter-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

.prescription-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.prescription-table th,
.prescription-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.prescription-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.prescription-table tr.rejetée {
  background-color: #f8d7da;
}

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
  background-color: #28a745;
  color: white;
}

.actions .reject-btn {
  background-color: #e74c3c;
  color: white;
}

.actions .status-btn {
  background-color: #ffc107;
  color: white;
}
</style>
