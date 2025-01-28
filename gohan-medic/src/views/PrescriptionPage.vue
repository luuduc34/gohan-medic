<template>
  <div class="prescription-page">
    <!-- Titre principal de la page -->
    <h1 class="page-title">Gestion des Ordonnances</h1>

    <!-- Conteneur pour les liens de navigation -->
    <div class="menu-container">
      <!-- Lien vers la page de téléversement d'une ordonnance -->
      <router-link to="/ordonnance/upload" class="menu-link">
        Téléverser une ordonnance
      </router-link>

      <!-- Lien vers la page des ordonnances de l'utilisateur -->
      <router-link to="/ordonnance" class="menu-link"> Mes ordonnances </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "PrescriptionPage", // Nom du composant
};
</script>

<style scoped>
/* Conteneur principal de la page */
.prescription-page {
  max-width: 600px; /* Largeur maximale de la page */
  margin: 20px auto; /* Centré avec marges automatiques */
  text-align: center; /* Centrage du texte */
}

/* Style du titre principal */
.page-title {
  font-size: 2rem; /* Taille de la police grande */
  color: #2d9cdb; /* Couleur bleue douce */
  margin-bottom: 20px; /* Espacement en bas du titre */
}

/* Conteneur des liens du menu */
.menu-container {
  display: flex; /* Affichage en flexbox */
  flex-direction: column; /* Orientation verticale */
  gap: 15px; /* Espacement entre les éléments */
}

/* Style des liens du menu */
.menu-link {
  padding: 10px 20px; /* Espacement interne */
  background-color: #2d9cdb; /* Couleur de fond bleue */
  color: white; /* Couleur du texte en blanc */
  text-decoration: none; /* Suppression de la décoration des liens */
  border-radius: 5px; /* Coins arrondis */
  font-size: 1rem; /* Taille de la police */
  transition: background-color 0.3s; /* Transition douce pour le changement de couleur */
}

/* Effet au survol des liens */
.menu-link:hover {
  background-color: #1b6ba8; /* Couleur plus foncée au survol */
}
</style>
