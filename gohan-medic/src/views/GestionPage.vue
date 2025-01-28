<template>
  <div>
    <!-- Titre principal : "Gestion" -->
    <h1 class="gestion-title">Gestion</h1>

    <!-- Menu de navigation pour accéder aux différentes sections de gestion -->
    <div class="menu-container">
      <ul class="menu-gestion">
        <!-- Lien vers la gestion des stocks -->
        <li>
          <router-link to="/Gestion/Stock">Gestion des stocks</router-link>
        </li>
        <!-- Lien vers la gestion des produits -->
        <li>
          <router-link to="/Gestion/Produits">Gestion des produits</router-link>
        </li>
        <!-- Lien vers la gestion des promotions -->
        <li>
          <router-link to="/Gestion/Promotions">Gestion des promotions</router-link>
        </li>
        <!-- Lien vers la gestion des prescriptions -->
        <li>
          <router-link to="/Gestion/Ordonnances">Gestion des prescription</router-link>
        </li>
      </ul>
    </div>

    <!-- Contenu dynamique affiché selon la sous-page active -->
    <div class="gestion-content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "GestionPage", // Nom du composant pour l'organisation et le débogage
};
</script>

<style scoped>
/* Titre principal : mise en forme élégante avec un fond bleu clair */
.gestion-title {
  text-align: center; /* Centré horizontalement */
  font-size: 2.5rem; /* Taille de la police importante */
  font-weight: bold; /* Texte en gras */
  color: #2d9cdb; /* Bleu utilisé pour rappeler le style pharmaceutique */
  margin-bottom: 30px; /* Espacement sous le titre */
  padding: 15px; /* Espacement interne pour un meilleur rendu */
  background-color: #e3f2fd; /* Fond bleu clair pour un effet agréable */
  border-radius: 10px; /* Coins arrondis */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Ombre légère pour un effet de profondeur */
  text-transform: uppercase; /* Conversion du texte en majuscules */
  letter-spacing: 1px; /* Espacement entre les lettres pour un rendu propre */
}

/* Conteneur du menu : ajout d'un fond blanc et de bordures */
.menu-container {
  background-color: #ffffff; /* Fond blanc pour contraster avec le reste */
  border: 1px solid #ddd; /* Bordure grise pour délimiter la section */
  border-radius: 10px; /* Coins arrondis */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Ombre légère pour donner du relief */
  max-width: 800px; /* Limitation de la largeur pour une mise en page compacte */
  margin: 0 auto 20px auto; /* Centrage horizontal et espacement vertical */
  padding: 20px; /* Espacement interne */
  text-align: center; /* Contenu centré */
}

/* Liste du menu : suppression des puces et mise en forme horizontale */
.menu-gestion {
  list-style: none; /* Suppression des puces */
  padding: 0; /* Aucun espacement interne */
  margin: 0; /* Aucun espacement externe */
  display: flex; /* Affichage en ligne */
  justify-content: space-around; /* Distribution équitable des éléments */
}

/* Style des liens du menu */
.menu-gestion li a {
  text-decoration: none; /* Suppression du soulignement des liens */
  font-size: 1.2rem; /* Taille du texte légèrement agrandie */
  color: #007bff; /* Bleu pour les liens */
  font-weight: bold; /* Texte en gras pour souligner l'importance */
  transition: color 0.3s ease; /* Transition douce pour les effets au survol */
}

/* Style des liens au survol */
.menu-gestion li a:hover {
  color: #0056b3; /* Bleu plus foncé pour l'interaction au survol */
}

/* Contenu des sous-pages : section pour afficher les sous-composants dynamiquement */
.gestion-content {
  background-color: #ffffff; /* Fond blanc pour uniformité avec le menu */
  padding: 20px; /* Espacement interne */
  max-width: 1200px; /* Largeur maximale pour un contenu organisé */
  margin: 0 auto; /* Centrage horizontal */
}
</style>
