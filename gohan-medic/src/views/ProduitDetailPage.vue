<template>
  <div class="product-detail-page">
    <!-- Titre de la page -->
    <h1 class="page-title">Détails du Produit</h1>

    <!-- Carte principale avec les informations du produit -->
    <productDetailCard v-if="product" :product="product" />
    <p v-else>Produit introuvable</p>
  </div>
</template>

<script>
import { useProductStore } from "@/stores/ProductStore";
import productDetailCard from "@/components/Product/productDetailCard.vue";

export default {
  name: "ProductDetailPage",
  components: {
    productDetailCard,
  },
  setup() {
    const productStore = useProductStore();
    const product = productStore.currentProduct;

    return { product };
  },
};
</script>

<style scoped>
.page-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #2d9cdb; /* Bleu pharmaceutique */
  margin-bottom: 30px;
  padding: 15px;
  background-color: #e3f2fd; /* Bleu clair doux */
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
