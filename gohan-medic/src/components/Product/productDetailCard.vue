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
        <!-- Tableau invisble pour aligner proprement -->
        <div class="price-table">
          <!-- Contenance (décalée et plus espacée) -->
          <div class="table-row size-row">
            <span class="table-cell size">30 ml</span>
          </div>

          <!-- En-tête -->
          <div class="table-row header">
            <span class="table-cell">PVC</span>
            <span class="table-cell bold">Votre prix</span>
            <span class="table-cell">Remise</span>
          </div>

          <!-- Ligne Prix -->
          <div class="table-row">
            <span class="table-cell old-price">
              <span v-if="product.is_promotion" class="strike-price"
                >{{ product.price.toFixed(2) }} €</span
              >
              <strong v-else class="normal-price"
                >{{ product.price.toFixed(2) }} €</strong
              >
            </span>
            <span class="table-cell new-price">
              <strong v-if="product.is_promotion"
                >{{ product.promotion.discountedPrice }} €</strong
              >
              <strong v-else>{{ product.price.toFixed(2) }} €</strong>
            </span>
            <span class="table-cell discount">
              <span v-if="product.is_promotion"
                >-{{ product.promotion.percentage }}%</span
              >
              <span v-else>—</span>
            </span>
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
          <div v-if="product.stock > 0" class="quantity-container">
            <label for="quantity" class="quantity-label">Quantité</label>
            <select id="quantity" v-model="selectedQuantity" class="quantity-select">
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
import { useBasketStore } from "@/stores/BasketStore";

export default {
  name: "ProductDetailCard",
  props: {
    product: {
      type: Object,
      required: true,
      default: () => ({
        id: null,
        name: "Nom du produit",
        image: "https://via.placeholder.com/300x200",
        price: 0,
        promotion: null,
        stock: 10,
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
      const basketStore = useBasketStore();
      const priceToUse =
        this.product.is_promotion && this.product.promotion?.discountedPrice
          ? this.product.promotion.discountedPrice
          : this.product.price;

      const productToAdd = {
        id: this.product.id,
        name: this.product.name,
        image: this.product.picture,
        price: priceToUse,
        quantity: this.selectedQuantity,
      };

      basketStore.addItem(productToAdd);
      alert(`${this.selectedQuantity} x ${this.product.name} ajouté(s) au panier !`);
    },
  },
};
</script>

<style scoped>
/* STRUCTURE GÉNÉRALE */
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
  height: auto;
  border-radius: 4%;
  background-color: #f9fbff;
}

/* TITRE */
.product-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

/* TABLEAU INVISIBLE POUR LES PRIX */
.price-table {
  display: table;
  width: 90%; /* Ajusté pour épouser le contenu */
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
  margin-left: auto;
  margin-right: auto;
}

/* Contenance séparée et plus espacée */
.size-row {
  display: table-row;
}

.size {
  display: table-cell;
  font-weight: bold;
  font-size: 1rem;
  padding-bottom: 15px; /* Espacement augmenté */
  text-align: left;
}

/* Ligne des en-têtes */
.header {
  font-weight: bold;
  color: #333;
}

/* Ajustement des cellules */
.table-row {
  display: table-row;
}

.table-cell {
  display: table-cell;
  text-align: center;
  padding: 8px;
}

/* Espacement des prix */
.old-price {
  color: #999;
}

.strike-price {
  text-decoration: line-through;
}

.new-price {
  color: #d92332;
  font-weight: bold;
}

.discount {
  font-weight: bold;
  color: #d92332;
}

/* DISPONIBILITÉ & LIVRAISON */
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

/* BOUTONS */
.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
}

.quantity-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  height: 40px;
  border-radius: 40%;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-right: 15px;
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
}

.add-to-cart:hover {
  background-color: #b71b27;
}

.add-to-cart.disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
