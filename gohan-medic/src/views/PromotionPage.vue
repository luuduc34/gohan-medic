<template>
  <div>
    <!-- Titre principal de la page des promotions -->
    <h1 class="catalogue-title">Promotions</h1>

    <!-- Conteneur pour la barre de recherche -->
    <div class="search-container">
      <!-- Composant SearchBar utilisé pour la recherche, avec liaison bidirectionnelle sur la requête de recherche -->
      <SearchBar v-model:searchQuery="searchQuery" />
    </div>

    <!-- Conteneur principal pour les cartes des produits -->
    <div class="wrapper">
      <div class="catalogue">
        <!-- Boucle pour afficher chaque produit promotionné sous forme de carte -->
        <ProductCard
          v-for="product in filteredPromotions"
          :key="product.id"
          :product="product"
          @click="openProductDetail(product)"
        />
        <!--
          v-for : Filtrage dynamique des promotions.
          :key : Utilisé pour fournir une clé unique pour chaque produit.
          :product : Transmission des données du produit à la carte.
          @click : Gestion de l'événement pour afficher les détails du produit.
        -->
      </div>
    </div>
  </div>
</template>

<script>
import SearchBar from "@/components/SearchBar/SearchBar.vue"; // Composant pour la barre de recherche
import ProductCard from "@/components/Product/ProductCard.vue"; // Composant pour afficher les produits sous forme de cartes
import { fetchProducts } from "@/services/ProductService"; // Service pour récupérer les données des produits
import { fetchPromotionsForMultipleProducts } from "@/services/PromotionService"; // Service pour récupérer les promotions des produits
import { useProductStore } from "@/stores/ProductStore"; // Store pour gérer les produits sélectionnés

export default {
  name: "PromotionPage", // Nom du composant
  components: {
    SearchBar, // Déclaration du composant SearchBar
    ProductCard, // Déclaration du composant ProductCard
  },
  data() {
    return {
      searchQuery: "", // Texte entré par l'utilisateur pour rechercher un produit
      promotions: [], // Liste des produits avec promotions appliquées
    };
  },
  async created() {
    // Cette méthode est appelée lorsque le composant est créé
    try {
      // Récupération de tous les produits disponibles
      const fetchedProducts = await fetchProducts();

      // Récupération des promotions pour les produits récupérés
      const promotionsByProduct = await fetchPromotionsForMultipleProducts(
        fetchedProducts.map((product) => product.id) // Extraire les IDs des produits pour les utiliser dans la requête
      );

      // Filtrage des produits pour ne garder que ceux ayant une promotion
      this.promotions = fetchedProducts
        .filter((product) => promotionsByProduct[product.id]) // Garder uniquement les produits avec des promotions associées
        .map((product) => ({
          ...product, // Conserver toutes les informations du produit
          promotion: promotionsByProduct[product.id], // Ajouter la promotion correspondante
        }));
    } catch (error) {
      // Gestion des erreurs en cas d'échec des appels API
      console.error("Erreur lors du chargement des promotions :", error);
    }
  },
  computed: {
    // Filtrage dynamique des produits en fonction de la recherche
    filteredPromotions() {
      return this.promotions.filter(
        (product) => product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) // Vérifie si le nom du produit contient la requête de recherche
      );
    },
  },
  methods: {
    // Méthode pour ouvrir la page de détail d'un produit lorsqu'il est cliqué
    openProductDetail(product) {
      const productStore = useProductStore(); // Accéder au store des produits
      productStore.setProduct(product); // Enregistrer le produit sélectionné dans le store
      this.$router.push({ name: "ProductDetail" }); // Rediriger l'utilisateur vers la page de détail du produit
    },
  },
};
</script>

<style scoped>
/* Conteneur pour la barre de recherche */
.search-container {
  margin: 20px auto;
  text-align: center;
}

/* Style pour le titre de la page */
.catalogue-title {
  text-align: center;
  font-size: 2.5rem; /* Taille du texte */
  font-weight: bold; /* Texte en gras */
  color: #2d9cdb; /* Couleur bleue */
  margin-bottom: 30px; /* Espace en bas */
  padding: 15px; /* Espace interne */
  background-color: #e3f2fd; /* Fond bleu clair */
  border-radius: 10px; /* Coins arrondis */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Ombre */
  text-transform: uppercase; /* Texte en majuscules */
  letter-spacing: 1px; /* Espacement entre les lettres */
}

/* Conteneur principal */
.wrapper {
  margin: auto;
  max-width: 1200px; /* Largeur maximale */
}

/* Grille pour afficher les produits */
.catalogue {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 colonnes dans la grille */
  gap: 1rem; /* Espacement entre les éléments */
  padding: 10px;
}

/* Carte promotionnelle */
.promotion-card {
  width: 220px;
  height: 320px;
  margin: 0 auto;
  border-radius: 12px; /* Coins arrondis */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Ombre légère */
  background-color: #ffffff;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Transitions */
  border: 1px solid #ddd; /* Bordure */
}

.promotion-card:hover {
  transform: translateY(-10px); /* Effet de levée au survol */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2); /* Ombre accentuée */
}

/* Image dans la carte */
.promotion-card img {
  width: 100%; /* S'adapte à la largeur */
  height: 180px;
  object-fit: cover; /* Ajuste l'image sans déformation */
  border-bottom: 1px solid #ddd;
  transition: opacity 0.3s; /* Transition pour l'opacité */
}

.promotion-card img:hover {
  opacity: 0.8; /* Réduit l'opacité au survol */
}

/* Informations sur le produit */
.promotion-info {
  padding: 15px;
  text-align: center;
}

.promotion-info h3 {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

/* Style des prix */
.promotion-info .original-price {
  text-decoration: line-through; /* Barre le texte */
  color: #888;
}

.promotion-info .discounted-price {
  color: #d32f2f; /* Rouge pour le prix réduit */
  font-weight: bold;
}

/* Style pour les écrans plus petits */
@media (max-width: 1024px) {
  .catalogue {
    grid-template-columns: repeat(3, 1fr); /* Passe à 3 colonnes */
  }
}

@media (max-width: 768px) {
  .catalogue {
    grid-template-columns: repeat(2, 1fr); /* Passe à 2 colonnes */
  }
}

@media (max-width: 480px) {
  .catalogue {
    grid-template-columns: 1fr; /* Passe à 1 colonne */
  }
}
</style>
