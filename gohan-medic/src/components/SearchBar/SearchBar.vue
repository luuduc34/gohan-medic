<template>
  <div class="search-bar">
    <!-- Barre de recherche avec liaison bidirectionnelle -->
    <!-- Bouton pour effacer la recherche, affiché uniquement si une requête existe -->
    <!-- Déclencher l'événement de recherche lors de la saisie -->
    <input
      v-model="searchQuery"
      @input="onSearch"
      type="text"
      class="search-input"
      placeholder="Rechercher..."
    />
    <button @click="clearSearch" class="clear-button" v-if="searchQuery">✕</button>
  </div>
  <!-- Lier la variable locale "searchQuery" -->
</template>

<script>
export default {
  name: "SearchBar", // Nom du composant
  props: {
    initialQuery: {
      type: String, // Le type attendu est une chaîne de caractères
      default: "", // Valeur par défaut si aucune requête initiale n'est passée
    },
  },
  data() {
    return {
      searchQuery: this.initialQuery, // Initialiser la recherche avec la valeur du parent
    };
  },
  methods: {
    /**
     * Méthode appelée à chaque saisie dans le champ de recherche.
     * Émet un événement "update:searchQuery" pour informer le parent de la nouvelle valeur.
     */
    onSearch() {
      this.$emit("update:searchQuery", this.searchQuery); // Transmet la recherche au parent
    },
    /**
     * Réinitialise le champ de recherche et informe le parent que la recherche est vide.
     */
    clearSearch() {
      this.searchQuery = ""; // Réinitialise la valeur locale
      this.onSearch(); // Émet un événement pour mettre à jour le parent
    },
  },
};
</script>

<style scoped>
/* Conteneur principal de la barre de recherche */
.search-bar {
  display: flex;
  align-items: center;
  width: 100%; /* Occupe toute la largeur disponible */
  max-width: 400px; /* Limite la largeur maximale à 400px */
  margin: 0 auto; /* Centre horizontalement */
  position: relative; /* Nécessaire pour positionner le bouton d'effacement */
}

/* Champ de saisie de la recherche */
.search-input {
  width: 100%; /* S'étend sur toute la largeur du conteneur */
  padding: 10px 15px; /* Espace intérieur pour le confort de saisie */
  border: 1px solid #ddd; /* Bordure légère */
  border-radius: 25px; /* Bordure arrondie */
  font-size: 16px; /* Taille de police lisible */
  outline: none; /* Retire le contour bleu par défaut */
}

/* Effet au focus pour mettre en évidence le champ */
.search-input:focus {
  border-color: #007bff; /* Bordure bleue pour le focus */
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Ombre bleue subtile */
}

/* Bouton d'effacement de la recherche */
.clear-button {
  position: absolute; /* Positionnement dans le conteneur */
  right: 10px; /* Décalé à droite */
  background: none; /* Pas de fond pour un design minimaliste */
  border: none; /* Pas de bordure */
  font-size: 18px; /* Icône lisible */
  cursor: pointer; /* Indicateur cliquable */
  color: #888; /* Couleur grise neutre */
}

/* Changement de couleur au survol du bouton d'effacement */
.clear-button:hover {
  color: #555; /* Couleur plus sombre pour indiquer l'interaction */
}
</style>
