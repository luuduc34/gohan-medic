<template>
  <div class="new-promotion-page">
    <!-- Titre principal de la page -->
    <h1 class="page-title">Ajouter une Promotion</h1>

    <!-- Formulaire pour ajouter une promotion -->
    <form @submit.prevent="handleSubmit" class="promotion-form">
      <!-- Champ pour le pourcentage de réduction -->
      <label for="percentage">Pourcentage de réduction</label>
      <input
        v-model="form.percentage"
        id="percentage"
        type="number"
        min="1"
        max="100"
        required
      />

      <!-- Champ pour la date de début -->
      <label for="start_date">Date de début</label>
      <input v-model="form.start_date" id="start_date" type="date" required />

      <!-- Champ pour la date de fin -->
      <label for="end_date">Date de fin</label>
      <input v-model="form.end_date" id="end_date" type="date" required />

      <!-- Sélecteur pour le produit associé -->
      <label for="product_id">Produit associé</label>
      <div class="autocomplete" @focusin="showDropdown = true" @focusout="hideDropdown">
        <!-- Champ de recherche pour le produit -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un produit"
          @input="filterProducts"
        />
        <!-- Liste déroulante pour afficher les produits filtrés -->
        <ul v-if="showDropdown && filteredProducts.length > 0" class="dropdown">
          <li
            v-for="product in filteredProducts"
            :key="product.id"
            @mousedown.prevent="selectProduct(product)"
          >
            {{ product.name }}
          </li>
        </ul>
      </div>

      <!-- Bouton pour soumettre le formulaire -->
      <button type="submit">Ajouter</button>
    </form>
  </div>
</template>

<script>
import { fetchProducts } from "@/services/ProductService"; // Service pour récupérer les produits
import { addPromotion } from "@/services/PromotionService"; // Service pour ajouter une promotion

export default {
  name: "NewPromotionPage", // Nom du composant
  data() {
    return {
      form: {
        percentage: null, // Pourcentage de réduction
        start_date: "", // Date de début de la promotion
        end_date: "", // Date de fin de la promotion
        product_id: "", // ID du produit associé
      },
      products: [], // Liste complète des produits disponibles
      filteredProducts: [], // Liste des produits filtrés selon la recherche
      searchQuery: "", // Texte saisi dans le champ de recherche
      showDropdown: false, // Indique si la liste déroulante est affichée
    };
  },
  async created() {
    try {
      // Récupérer les produits et exclure ceux ayant déjà une promotion
      const fetchedProducts = await fetchProducts();
      this.products = fetchedProducts.filter((product) => !product.is_promotion);
      this.filteredProducts = this.products; // Par défaut, afficher tous les produits
    } catch (error) {
      console.error("Erreur lors du chargement des produits :", error);
    }
  },
  methods: {
    // Filtrer les produits en fonction du texte saisi dans le champ de recherche
    filterProducts() {
      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
    },
    // Sélectionner un produit dans la liste déroulante
    selectProduct(product) {
      this.form.product_id = product.id; // Enregistrer l'ID du produit sélectionné
      this.searchQuery = product.name; // Afficher le nom du produit sélectionné dans le champ
      this.showDropdown = false; // Masquer la liste déroulante
    },
    // Masquer la liste déroulante après un délai pour permettre la sélection
    hideDropdown() {
      setTimeout(() => {
        this.showDropdown = false;
      }, 150);
    },
    // Soumettre le formulaire pour ajouter une promotion
    async handleSubmit() {
      try {
        // Vérifier que la date de début est antérieure à la date de fin
        if (new Date(this.form.start_date) > new Date(this.form.end_date)) {
          alert("La date de début ne peut pas être postérieure à la date de fin.");
          return;
        }

        // Préparer les données de la promotion
        const promotionData = {
          percentage: this.form.percentage,
          created_at: this.form.start_date,
          end_at: this.form.end_date,
        };

        // Appeler le service pour ajouter la promotion
        await addPromotion(promotionData, this.form.product_id);
        alert("Promotion ajoutée avec succès !");
        this.$router.push("/Gestion/Promotions"); // Rediriger vers la page de gestion des promotions
      } catch (error) {
        console.error("Erreur lors de l'ajout de la promotion :", error);
        alert("Erreur : " + error.message);
      }
    },
  },
};
</script>

<style scoped>
/* Conteneur principal de la page */
.new-promotion-page {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9fbff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Titre de la page */
.page-title {
  text-align: center;
  font-size: 2rem;
  color: #2d9cdb;
  margin-bottom: 20px;
}

/* Formulaire */
.promotion-form {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

input,
button {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

button {
  background-color: #2d9cdb;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #007bb5;
}

/* Autocomplétion */
.autocomplete {
  position: relative;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  z-index: 1000;
}

.dropdown li {
  padding: 10px;
  cursor: pointer;
}

.dropdown li:hover {
  background-color: #f0f0f0;
}
</style>
