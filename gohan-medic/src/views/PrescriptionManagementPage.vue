<template>
  <div class="prescription-management-page">
    <h1 class="page-title">Gestion des Ordonnances</h1>

    <ul v-if="prescriptions.length > 0" class="prescription-list">
      <li
        v-for="prescription in prescriptions"
        :key="prescription.prescription_id"
        class="prescription-item"
      >
        <span>{{ prescription.comment || "Pas de commentaire" }}</span>
        <span>Statut : {{ prescription.status }}</span>

        <div class="actions">
          <button
            v-if="prescription.status === 'pending'"
            class="approve-btn"
            @click="approvePrescription(prescription.prescription_id)"
          >
            Approuver
          </button>
          <button
            v-if="prescription.status === 'pending'"
            class="reject-btn"
            @click="rejectPrescription(prescription.prescription_id)"
          >
            Rejeter
          </button>
          <button
            v-if="prescription.status === 'approved'"
            class="status-btn"
            @click="updateStatus(prescription.prescription_id, 'préparation')"
          >
            Passer en préparation
          </button>
          <button
            v-if="prescription.status === 'préparation'"
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
        </div>
      </li>
    </ul>
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
    };
  },
  async created() {
    this.loadPrescriptions();
  },
  methods: {
    async loadPrescriptions() {
      try {
        this.prescriptions = await fetchPrescriptions();
      } catch (error) {
        console.error("Erreur lors du chargement des ordonnances :", error);
      }
    },
    async approvePrescription(prescription_id) {
      try {
        await updatePrescriptionStatus(prescription_id, "approved");
        this.loadPrescriptions();
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
        this.loadPrescriptions();
        alert("Prescription rejetée !");
      } catch (error) {
        console.error("Erreur lors du rejet :", error);
        alert("Impossible de rejeter la prescription.");
      }
    },
    async updateStatus(prescription_id, newStatus) {
      try {
        await updatePrescriptionStatus(prescription_id, newStatus);
        this.loadPrescriptions();
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

.prescription-list {
  list-style: none;
  padding: 0;
}

.prescription-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #ffffff;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.actions button {
  margin-right: 10px;
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

.actions .approve-btn:hover {
  background-color: #218838;
}

.actions .reject-btn {
  background-color: #e74c3c;
  color: white;
}

.actions .reject-btn:hover {
  background-color: #c0392b;
}

.actions .status-btn {
  background-color: #ffc107;
  color: white;
}

.actions .status-btn:hover {
  background-color: #e0a800;
}
</style>
