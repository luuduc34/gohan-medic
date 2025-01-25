<template>
  <div class="order-details-page">
    <div class="order-container">
      <h1 class="order-detail-title">Détails de la commande</h1>

      <div class="order-summary">
        <p><strong>ID Commande :</strong> {{ id_order }}</p>
        <p><strong>Date :</strong> {{ formattedDate }}</p>
        <p>
          <strong>Prix total :</strong> {{ formatCurrency(orderDetails.total_price) }}
        </p>
        <p>
          <strong>Frais de livraison :</strong>
          {{ formatCurrency(orderDetails.shipping_costs) }}
        </p>
      </div>

      <h2>Détails des produits</h2>
      <table class="order-products-table">
        <thead>
          <tr>
            <th>Nom du produit</th>
            <th>Quantité</th>
            <th>Prix unitaire</th>
            <th>Prix total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="line in orderLines" :key="line.id">
            <td>{{ line.product.name }}</td>
            <td>{{ line.quantity_ordered }}</td>
            <td>{{ formatCurrency(line.price) }}</td>
            <td>{{ formatCurrency(line.price * line.quantity_ordered) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useUserOrderStore } from "@/stores/UserOrderStore"; // Import du store
import { getOrderLines } from "@/services/OrderService"; // Service pour récupérer les produits

export default {
  name: "OrderDetailsPage",

  setup() {
    const route = useRoute();
    const userOrderStore = useUserOrderStore(); // Accéder au store

    const id_order = route.params.id; // Récupérer l'ID de la commande depuis l'URL

    // Récupérer les détails de la commande depuis le store
    const orderDetails = computed(() =>
      userOrderStore.orders.find((order) => order.id === id_order)
    );

    const orderLines = ref([]); // Stocker les lignes de commande

    // Fonction pour récupérer les lignes de commande
    const fetchOrderLines = async () => {
      const lines = await getOrderLines(id_order); // Appel à la fonction du service
      orderLines.value = lines;
    };

    onMounted(fetchOrderLines); // Récupérer les lignes de commande à la montée du composant

    // Formatter la date
    const formattedDate = computed(() =>
      new Date(orderDetails.value?.created_at).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );

    // Formatter les prix
    const formatCurrency = (value) =>
      new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(value);

    return { id_order, orderDetails, orderLines, formattedDate, formatCurrency };
  },
};
</script>

<style scoped>
/* Conteneur principal pour centrer et limiter la largeur */
.order-container {
  max-width: 1200px;
  margin: 0 auto; /* Centrer horizontalement */
  padding: 0 1rem; /* Ajouter un peu d'espace latéral pour les petits écrans */
}

/* Autres styles (inchangés ou ajustés si nécessaire) */
.order-details-page {
  padding: 1rem 0; /* Réduire l'espacement vertical global */
}

.order-detail-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: #2d9cdb;
  margin-bottom: 2rem;
}

.order-summary {
  background-color: #f7f7f7;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.order-products-table {
  width: 100%; /* S'adapte à la largeur du conteneur */
  border-collapse: collapse;
  margin-top: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-products-table th,
.order-products-table td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

.order-products-table th {
  background-color: #2d9cdb;
  color: white;
  font-weight: bold;
}

.order-products-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.order-products-table tr:hover {
  background-color: #f1f1f1;
}
</style>
