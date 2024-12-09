<template>
  <div class="promotion-card">
    <!-- Macaron rouge pour le pourcentage de réduction -->
    <div v-if="promotion.percentage" class="discount-badge">
      -{{ promotion.percentage }}%
    </div>

    <img :src="promotion.picture || ''" alt="Image du produit" loading="lazy" />

    <div class="promotion-info">
      <h3>{{ promotion.name }}</h3>
      <p class="original-price">{{ promotion.price || 0 }} €</p>
      <p class="discounted-price">{{ promotion.discountedPrice || 0 }} €</p>
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
  position: relative; /* Pour positionner le macaron rouge */
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin: 10px;
  background-color: #fff;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 220px; 
  height: 300px; 
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.promotion-card img {
  max-width: 100%;
  height: 150px; 
  object-fit: contain;
  margin-bottom: 10px;
}

/* Macaron rouge pour le pourcentage de réduction */
.discount-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #d32f2f;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
  padding: 5px 10px;
  border-radius: 50px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.original-price {
  text-decoration: line-through;
  color: #888;
}

.discounted-price {
  color: #d32f2f;
  font-weight: bold;
}
</style>
