<template>
  <div class="product-basket-card">
    <!-- Image du produit -->
    <div class="image-container">
      <img :src="product.image" :alt="product.name" />
    </div>

    <!-- Détails du produit -->
    <div class="product-details">
      <!-- Nom du produit -->
      <h2 class="product-name">{{ product.name }}</h2>

      <!-- Prix unitaire -->
      <div class="price-unit">
        Prix unitaire :
        <span class="price">{{ product.price }} €</span>
      </div>
    </div>

    <!-- Sous-total et gestion de la quantité -->
    <div class="quantity-section">
      <!-- Sous-total -->
      <div class="subtotal">
        Sous-total :
        <span class="price">{{ subTotal.toFixed(2) }} €</span>
      </div>

      <!-- Gestion de la quantité -->
      <div class="quantity-controls">
        <button @click="decreaseQuantity">-</button>
        <span class="quantity">{{ product.quantity }}</span>
        <button @click="increaseQuantity" :disabled="product.quantity >= 9">+</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductBasketCard", // Nom du composant
  props: {
    product: {
      type: Object,
      required: true,
      default: () => ({
        id: null,
        name: "Nom du produit",
        image: "https://via.placeholder.com/100x100",
        price: 0,
        quantity: 1,
      }), // Valeurs par défaut si aucun produit n'est fourni
    },
  },
  computed: {
    subTotal() {
      // Calcule le sous-total en multipliant le prix par la quantité
      return this.product.price * this.product.quantity;
    },
  },
  methods: {
    decreaseQuantity() {
      // Diminue la quantité du produit si elle est supérieure à 1
      if (this.product.quantity > 1) {
        this.$emit("update-quantity", {
          id: this.product.id,
          quantity: this.product.quantity - 1,
        });
      } else {
        // Si la quantité est 1, déclenche un événement pour supprimer le produit du panier
        this.$emit("request-remove", this.product.id);
      }
    },
    increaseQuantity() {
      // Augmente la quantité du produit tant qu'elle est inférieure à 9
      if (this.product.quantity < 9) {
        this.$emit("update-quantity", {
          id: this.product.id,
          quantity: this.product.quantity + 1,
        });
      }
    },
  },
};
</script>

<style scoped>
.product-basket-card {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 100%;
  max-width: 1200px;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff;
}

.image-container {
  flex: 0 0 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.image-container img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.product-details {
  flex: 1;
  margin-left: 10px;
}
.product-name {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 5px;
}
.price-unit {
  font-size: 0.9rem;
  color: #555;
}
.price {
  font-weight: bold;
  color: #d92332;
}

/* Sous-total et quantité */
.quantity-section {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centrer horizontalement les éléments */
  justify-content: center;
}

.subtotal {
  font-size: 0.9rem;
  color: #555;
  font-weight: bold;
  margin-bottom: 10px; /* Espacement sous le sous-total */
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}
.quantity-controls button {
  background-color: #d92332;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
}
.quantity-controls button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.quantity-controls button:hover:not(:disabled) {
  background-color: #b71b27;
}
.quantity {
  font-size: 1rem;
  font-weight: bold;
}
</style>
