<template>
  <div class="product-card" @click="handleClick">
    <!-- Affiche le macaron de réduction si le produit est en promo -->
    <div
      v-if="product.is_promotion && product.promotion?.percentage"
      class="discount-badge"
    >
      -{{ product.promotion.percentage }}%
    </div>

    <!-- Image du produit -->
    <img :src="product.picture" alt="Image du produit" />

    <!-- Informations principales du produit -->
    <div class="product-info">
      <div class="product-details">
        <h3>{{ product.name }}</h3>
      </div>

      <!-- Prix aligné pour tous les produits -->
      <div class="price">
        <div class="price-wrapper">
          <!-- Prix barré pour les promos, affiché normalement sinon -->
          <p class="original-price" :class="{ visible: product.is_promotion }">
            {{ product.price }} €
          </p>
          <!-- Prix promotionnel affiché seulement si promo -->
          <p
            v-if="product.is_promotion && product.promotion?.discountedPrice"
            class="discounted-price"
          >
            {{ product.promotion.discountedPrice }} €
          </p>
        </div>
      </div>
    </div>

    <!-- Description du produit -->
    <div class="product-description">
      <p>{{ product.description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductCard",
  props: {
    product: {
      type: Object,
      required: true,
      default: () => ({
        is_promotion: false,
        promotion: {
          percentage: 0,
          discountedPrice: 0,
        },
        picture: "",
        name: "",
        price: 0,
        description: "",
      }),
    },
  },
  methods: {
    handleClick() {
      this.$emit("click");
    },
  },
};
</script>

<style scoped>
.product-card {
  position: relative;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-details {
  flex-grow: 1;
}

.product-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* Bloc prix uniformisé */
.price {
  min-height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Conteneur des prix : même structure pour tous les produits */
.price-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  min-height: 30px; /* Garde une hauteur uniforme */
}

/* Toujours afficher le prix normal, sauf si le produit est en promo */
.original-price {
  font-size: 1.2rem;
  min-width: 50px; /* Fixe une largeur minimale pour aligner les prix */
  color: #222; /* Couleur normale */
}

/* Si c'est une promo, alors barrer */
.price-wrapper .original-price.visible {
  text-decoration: line-through;
  color: #888;
}

/* Prix promo bien visible */
.discounted-price {
  color: #d32f2f;
  font-weight: bold;
  font-size: 1.2rem;
}

/* Description uniformisée */
.product-description {
  padding: 10px;
  font-size: 14px;
  color: #555;
  text-align: justify;
  border-top: 1px solid #ddd;
  min-height: 50px;
}

/* Macaron de réduction */
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
</style>
