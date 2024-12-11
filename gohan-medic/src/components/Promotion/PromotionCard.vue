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
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: #fff;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  justify-content: space-between;
}

.promotion-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.promotion-card img {
  max-width: 100%;
  height: 200px;
  object-fit: contain;
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
