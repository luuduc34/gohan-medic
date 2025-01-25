<template>
  <div class="order-line-card">
    <p><strong>Produit :</strong> {{ line.product.name }}</p>
    <p><strong>Quantité :</strong> {{ line.quantity_ordered }}</p>
    <p><strong>Prix :</strong> {{ line.price }} €</p>
  </div>
</template>

<script>
export default {
  name: "OrderDetailLineCard",
  props: {
    line: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.order-line-card {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  background-color: #f9f9f9;
}
</style>
