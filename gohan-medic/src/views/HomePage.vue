<template>
    <div class="home">
      <header class="hero-section">
        <h1>Bienvenue sur Gohan-Medic</h1>
        <p>Vos solutions pharmaceutiques en ligne.</p>
      </header>
  
      <section class="promotions">
        <h2>Promotions du mois</h2>
        <div class="product-list">
          <div v-for="promo in promotions" :key="promo.id" class="product-card">
            <img :src="promo.image" alt="Produit" />
            <h3>{{ promo.name }}</h3>
            <p>{{ promo.price }} €</p>
          </div>
        </div>
      </section>
  
      <section class="new-products">
        <h2>Nouveaux produits</h2>
        <div class="product-list">
          <div v-for="product in newProducts" :key="product.id" class="product-card">
            <img :src="product.image" alt="Produit" />
            <h3>{{ product.name }}</h3>
            <p>{{ product.price }} €</p>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import { fetchPromotions } from '../services/PromotionService';
  import { fetchProducts } from '../services/ProductService';
  
  export default {
    name: "HomePage",
  data() {
    return {
      promotions: [],
      newProducts: [],
    };
  },
  async created() {
    try {
      this.promotions = await fetchPromotions();
      this.newProducts = await fetchProducts();
    } catch (error) {
      console.error('Erreur lors du chargement des données :', error.message);
    }
  },
  };
  </script>
  
  <style>
  /* Styles de base pour une page Home */
  .hero-section {
    text-align: center;
    padding: 20px;
    background-color: #f0f8ff;
  }
  
  .product-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .product-card {
    border: 1px solid #ccc;
    padding: 10px;
    width: 200px;
    text-align: center;
  }
  </style>
  
  