<template>
  <div class="promotion-card">
    <img :src="promotion.picture || ''" alt="Image du produit" loading="lazy" />
    <div class="promotion-info">
      <h3>{{ promotion.name }}</h3>
      <p class="original-price">{{ promotion.price || 0 }} €</p>
      <p class="discounted-price">{{ promotion.discountedPrice || 0 }} €</p>
      <p v-if="promotion.percentage" class="percentage">-{{ promotion.percentage }}%</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "PromotionCard",
  props: {
    promotion: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.promotion-card {
  
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin: 10px;
  background-color: #fff;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 220px; /* Largeur fixe */
  height: 300px; /* Hauteur fixe */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.promotion-card img {
  max-width: 100%; /* Ajuste la largeur de l'image */
  height: 150px; /* Ajuste la hauteur de l'image */
  object-fit: contain; /* Pour garder les proportions */
  margin-bottom: 10px;
}

.original-price {
  text-decoration: line-through;
  color: #888;
}

.discounted-price {
  color: #d32f2f;
  font-weight: bold;
}

.percentage {
  color: #388e3c;
  font-weight: bold;
}
</style>
