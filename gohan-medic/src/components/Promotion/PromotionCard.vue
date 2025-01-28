<template>
  <div class="promotion-card">
    <!-- Macaron rouge affichant le pourcentage de réduction si disponible -->
    <div v-if="promotion.percentage" class="discount-badge" aria-label="Réduction">
      -{{ promotion.percentage }}%
    </div>

    <!-- Image de la promotion, avec un chargement différé pour la performance -->
    <!-- Image associée à la promotion -->
    <!-- Chargement différé pour améliorer les performances -->
    <img
      :src="promotion.picture || ''"
      :alt="`Image de la promotion ${promotion.name}`"
      loading="lazy"
    />

    <!-- Informations sur la promotion : nom, prix initial et prix remisé -->
    <div class="promotion-info">
      <h3>{{ promotion.name }}</h3>
      <!-- Nom du produit ou de la promotion -->
      <p class="original-price">{{ promotion.originalPrice }} €</p>
      <!-- Prix initial -->
      <p class="discounted-price">{{ promotion.discountedPrice }} €</p>
      <!-- Prix remisé -->
    </div>
  </div>
</template>

<script>
export default {
  name: "PromotionCard", // Nom du composant
  props: {
    promotion: {
      type: Object, // La promotion doit être un objet
      required: true, // Ce prop est obligatoire
    },
  },
};
</script>

<style scoped>
/* Conteneur principal de la carte promotionnelle */
.promotion-card {
  position: relative; /* Nécessaire pour positionner le macaron rouge */
  margin: 0 auto; /* Centrer la carte */
  border: 1px solid #ddd; /* Bordure légère */
  border-radius: 12px; /* Coins arrondis */
  background-color: #fff; /* Fond blanc */
  text-align: center; /* Texte centré */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Ombre légère */
  cursor: pointer; /* Curseur interactif */
}

/* Effet de survol pour donner une impression de flottement */
.promotion-card:hover {
  transform: translateY(-10px); /* Déplacement vers le haut */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15); /* Ombre renforcée */
}

/* Image du produit ou de la promotion */
.promotion-card img {
  max-width: 100%; /* S'adapte à la largeur du conteneur */
  height: 200px; /* Hauteur fixe pour l'uniformité */
  object-fit: contain; /* Préserve les proportions de l'image */
}

/* Macaron rouge pour indiquer le pourcentage de réduction */
.discount-badge {
  position: absolute; /* Positionné en haut à droite */
  top: 10px;
  right: 10px;
  background-color: #d32f2f; /* Rouge pour attirer l'attention */
  color: white; /* Texte en blanc pour le contraste */
  font-weight: bold; /* Texte en gras */
  font-size: 0.9rem; /* Taille de police modérée */
  padding: 5px 10px; /* Espacement intérieur */
  border-radius: 50px; /* Forme arrondie */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Ombre subtile */
}

/* Style du prix initial (barré) */
.original-price {
  text-decoration: line-through; /* Barre le texte */
  color: #888; /* Couleur grise pour le contraste */
}

/* Style du prix remisé (mis en évidence) */
.discounted-price {
  color: #d32f2f; /* Rouge vif pour attirer l'attention */
  font-weight: bold; /* Texte en gras */
}
</style>
