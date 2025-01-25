<template>
  <div class="order-list">
    <h1>Mes commandes</h1>
    <div v-if="orders.length === 0">Aucune commande trouvée.</div>
    <div v-else class="order">
      <OrderCard
        v-for="order in orders"
        :key="order.id"
        :order="order"
        @view-details="handleViewDetails"
      />
    </div>
  </div>
</template>

<script>
import OrderCard from "@/components/Order/OrderCard.vue";
import { useUserOrderStore } from "@/stores/UserOrderStore";

export default {
  name: "OrderPage",
  components: {
    OrderCard,
  },
  setup() {
    const userOrderStore = useUserOrderStore();

    return {
      orders: userOrderStore.orders,
      handleViewDetails(id) {
        console.log(`Afficher les détails pour la commande ID ${id}`);
        // Ajoutez ici la logique pour afficher les détails de la commande
      },
    };
  },
};
</script>

<style scoped>
.order-list {
  padding: 16px;
}

.order-list h1 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #2d9cdb;
  margin-bottom: 30px;
  padding: 15px;
  background-color: #e3f2fd;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.order {
  margin: auto;
  max-width: 1200px;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>
