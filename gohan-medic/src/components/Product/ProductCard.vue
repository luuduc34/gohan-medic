<template>
  <!-- Carte de produit qui affiche l'image, le nom et le prix -->
  <div class="product-card" @mouseover="hover = true" @mouseleave="hover = false">
    <!-- Change l'état du survol à true lorsque la souris passe au-dessus -->
    <!-- Change l'état du survol à false lorsque la souris quitte -->

    <img :src="product.picture" alt="Image du produit" />
    <!-- Affiche l'image du produit -->
    <div class="product-info">
      <h3>{{ product.name }}</h3>
      <!-- Affiche le nom du produit -->
      <span>{{ product.price }} €</span>
      <!-- Affiche le prix du produit -->
    </div>
    <!-- Affiche la description du produit seulement si l'élément hover est activé -->
    <div v-if="hover" class="product-description">
      <p>{{ product.description }}</p>
      <!-- Affiche la description du produit -->
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductCard",
  props: {
    product: {
      // Reçoit un objet "product" en tant que propriété
      type: Object,
      required: true, // La propriété "product" est obligatoire
    },
  },
  data() {
    return {
      hover: false, // Gère l'état du survol du produit
    };
  },
};
</script>

<style scoped>
/* Style de la carte de produit */
.product-card {
  position: relative; /* Permet de positionner la description au-dessus du produit */
  background: #fff; /* Fond blanc pour la carte */
  border: 1px solid #ddd; /* Bordure grise */
  border-radius: 8px; /* Coins arrondis */
  overflow: hidden; /* Cache tout ce qui dépasse de la carte */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Ombre légère autour de la carte */
  transition: transform 0.3s, height 0.3s; /* Animation pour l'agrandissement de la carte */
  cursor: pointer; /* Change le curseur lorsqu'on passe sur la carte */
}

/* Effet de survol pour agrandir la carte */
.product-card:hover {
  transform: scale(1.05); /* Agrandit la carte légèrement au survol */
}

/* Style de l'image du produit */
.product-card img {
  width: 100%; /* L'image prend toute la largeur de la carte */
  height: 200px; /* Hauteur fixe pour l'image */
  object-fit: cover; /* L'image couvre complètement l'espace sans distorsion */
}

/* Style pour la section d'information du produit (nom et prix) */
.product-info {
  padding: 10px; /* Ajoute un peu de padding autour du texte */
  display: flex; /* Utilise le flexbox pour aligner le texte */
  justify-content: space-between; /* Espacement égal entre le nom et le prix */
  align-items: center; /* Centrage vertical du texte */
  font-size: 16px; /* Taille de police du texte */
  font-weight: bold; /* Gras pour les informations */
}

/* Style pour la description du produit, qui s'affiche au survol */
.product-description {
  padding: 10px; /* Ajoute du padding autour du texte */
  font-size: 14px; /* Taille de la police de la description */
  color: #555; /* Couleur grise pour le texte */
  text-align: justify; /* Justifie le texte */
  border-top: 1px solid #ddd; /* Bordure grise au-dessus de la description */
}
</style>
