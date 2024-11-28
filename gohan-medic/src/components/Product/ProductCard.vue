<template>
    <div
      class="product-card"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <img :src="product.image" alt="Image du produit" />
      <div class="product-info">
        <h3>{{ product.nom }}</h3>
        <span>{{ product.prix }} €</span>
      </div>
      <div v-if="hover" class="product-description">
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
      },
    },
    data() {
      return {
        hover: false, // Gère l'état de survol
      };
    },
  };
  </script>
  
  <style scoped>
  .product-card {
    position: relative;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, height 0.3s;
    cursor: pointer;
  }
  
  .product-card:hover {
    transform: scale(1.05);
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
    font-size: 16px;
    font-weight: bold;
  }
  
  .product-description {
    padding: 10px;
    font-size: 14px;
    color: #555;
    text-align: justify;
    border-top: 1px solid #ddd;
  }
  </style>