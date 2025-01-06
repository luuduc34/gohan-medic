<template>
  <div class="product-card">
    <!-- Titre -->
    <h1 class="product-title">{{ product.name }}</h1>
    <hr />

    <div class="product">
      <!-- Section Image -->
      <div class="product-image">
        <img :src="product.picture" :alt="product.name" />
      </div>
      <!-- Section Détails du produit -->
      <div class="product-details">
        <div class="header">
          <span class="label">PVC</span>
          <span class="label bold">Votre prix</span>
          <span class="label">Remise</span>
        </div>

        <!-- Détails de la contenance et prix -->
        <div class="price-section">
          <div class="size">
            <span>30 ml</span>
            <span class="price-per-unit">21,67 € / 100 ml</span>
          </div>
          <!-- Vérifie si le produit est en promotion -->
          <div
            v-if="product.is_promotion && product.promotion?.discountedPrice"
            class="price"
          >
            <span class="old-price">{{ product.price.toFixed(2) }} €</span>
            <span class="new-price">{{ product.promotion.discountedPrice }} €</span>
            <span class="discount">-{{ product.promotion.percentage }}%</span>
          </div>
          <!-- Si pas en promotion -->
          <div v-else class="price no-promo">
            <span class="new-price">{{ product.price.toFixed(2) }} €</span>
          </div>
        </div>

        <!-- Disponibilité et Livraison -->
        <div class="availability">
          <span v-if="product.stock > 0" class="in-stock">En stock</span>
          <span v-else class="out-stock">Rupture de stock</span>
          <span class="delivery-info">Livraison gratuite à partir de 39 €</span>
        </div>

        <!-- Sélection de la quantité et ajout au panier -->
        <div class="actions">
          <!-- Quantité visible seulement si le stock est > 0 -->
          <div v-if="product.stock > 0" class="quantity-container">
            <label for="quantity" class="quantity-label">Quantité</label>
            <select id="quantity" v-model="selectedQuantity" class="quantity-select">
              <!-- Limite les options à la quantité en stock -->
              <option v-for="n in Math.min(9, product.stock)" :key="n" :value="n">
                {{ n }}
              </option>
            </select>
          </div>
          <button
            class="add-to-cart"
            :class="{ disabled: product.stock === 0 }"
            :disabled="product.stock === 0"
            @click="addToCart"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductDetailCard",
  props: {
    product: {
      type: Object,
      required: true,
      default: () => ({
        name: "Nom du produit",
        image: "https://via.placeholder.com/300x200",
        price: 0,
        oldPrice: null,
        discount: null,
        inStock: true,
      }),
    },
  },
  data() {
    return {
      selectedQuantity: 1,
    };
  },
  methods: {
    addToCart() {
      alert(`Ajouté au panier : ${this.selectedQuantity} x ${this.product.name}`);
    },
  },
};
</script>

<style scoped>
/* Styles généraux */
.product-card {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  max-width: 800px;
  margin: 20px auto;
  overflow: hidden;
}

.product {
  display: flex;
  flex-direction: row;
}

.product-image {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}
.product-image img {
  max-width: 100%;
  height: auto;
}

.product-details {
  align-self: center;
  padding: 20px;
  width: 350px;
  height: 250px;
  border-radius: 4%;
  background-color: #f9fbff;
}

/* Titre */
.product-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

/* Ligne de séparation */
hr {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 10px 0;
  width: 100%;
}

/* Header */
.header {
  display: flex;
  justify-content: end;
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 10px;
}

.label {
  margin: 0px 10px;
  text-align: center;
}

.label.bold {
  color: #d92332;
  font-weight: bold;
}

/* Section prix */
.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
}

.size span {
  display: block;
  font-size: 1rem;
}

.price span {
  margin: 0px 16px;
  text-align: center;
}

.price-per-unit {
  font-size: 0.8rem;
  color: #888;
}

.price .old-price {
  text-decoration: line-through;
  color: #999;
}

.price .new-price {
  color: #d92332;
  font-weight: bold;
}

.price.no-promo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.price.no-promo .new-price {
  font-weight: bold;
  color: #d92332;
}

/* Disponibilité et Livraison */
.availability {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.in-stock {
  color: green;
  font-weight: bold;
}

.out-stock {
  color: #fd172a;
  font-weight: bold;
}

.delivery-info {
  color: #555;
}

/* Actions */
.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
}

/* Conteneur arrondi pour la quantité */
.quantity-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 40px;
  border: 2px solid #fefeff;
  border-radius: 40%;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-right: 15px;
}

.quantity-label {
  font-size: 0.9rem;
  font-weight: bold;
  color: #555;
  margin-right: 5px;
}

.quantity-select {
  width: 40px;
  height: 30px;
  border: none;
  border-radius: 4px;
  text-align: center;
  background-color: #f9fbff;
  color: #333;
  font-weight: bold;
  cursor: pointer;
}
.quantity-select:focus {
  outline: none;
  box-shadow: 0 0 5px;
}

.add-to-cart {
  background-color: #d92332;
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
  margin-left: 15px; /* Garantir que le bouton reste à droite */
}

.add-to-cart:hover {
  background-color: #b71b27;
}

.add-to-cart.disabled {
  background-color: #ccc;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
