<template>
  <div class="order-card">
    <h3 class="order-id">Commande #{{ order.id }}</h3>
    <p class="order-date">Date : {{ formattedDate }}</p>
    <p class="order-total">
      Montant total : <strong>{{ formatCurrency(order.total_price) }}</strong>
    </p>
    <p class="order-shipping">
      Frais de livraison : {{ formatCurrency(order.shipping_costs) }}
    </p>
    <div class="order-actions">
      <button @click="viewDetails" class="details-btn">Voir les détails</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderCard",
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  computed: {
    formattedDate() {
      // Convertir la date au format lisible
      return new Date(this.order.created_at).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  methods: {
    formatCurrency(value) {
      // Formate un nombre en devise
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(value);
    },
    viewDetails() {
      // Naviguer vers la page des détails de la commande
      this.$router.push({ name: "OrderDetails", params: { id: this.order.id } });
    },
  },
};
</script>

<style scoped>
.order-card {
  width: 1200px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: block;
  align-items: center;
  justify-content: center;
}

.order-id {
  font-size: 1.2rem;
  margin: 0;
}

.order-date,
.order-total,
.order-shipping {
  font-size: 1rem;
  margin: 8px 0;
  color: #555;
}

.order-actions {
  margin-top: 16px;
  text-align: right;
}

.details-btn {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.details-btn:hover {
  background-color: #0056b3;
}
</style>
