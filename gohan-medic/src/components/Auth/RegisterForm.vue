<template>
  <!-- Formulaire d'inscription -->
  <form @submit.prevent="handleRegister" class="register-form">
    <h2>Inscription</h2>

    <!-- Champ pour le nom -->
    <div class="form-group">
      <label for="nom">Nom :</label>
      <!-- Liaison bidirectionnelle avec la propriété `nom` -->
      <input v-model="nom" id="nom" type="text" placeholder="Nom" required />
    </div>

    <!-- Champ pour le prénom -->
    <div class="form-group">
      <label for="prenom">Prénom :</label>
      <!-- Liaison bidirectionnelle avec la propriété `prenom` -->
      <input v-model="prenom" id="prenom" type="text" placeholder="Prénom" required />
    </div>

    <!-- Champ pour l'email -->
    <div class="form-group">
      <label for="email">Email :</label>
      <!-- Liaison bidirectionnelle avec la propriété `email` -->
      <input v-model="email" id="email" type="email" placeholder="Email" required />
    </div>

    <!-- Champ pour le mot de passe -->
    <div class="form-group">
      <label for="password">Mot de passe :</label>
      <!-- Liaison bidirectionnelle avec la propriété `password` -->
      <input v-model="password" id="password" type="password" placeholder="Mot de passe" required />
    </div>

    <!-- Bouton pour soumettre le formulaire -->
    <button type="submit" class="submit-button">S'inscrire</button>
  </form>
</template>

<script>
  // Importation du service pour gérer l'inscription
  import { registerWithEmail } from '@/services/UserService';

  export default {
    
    // Définition des données utilisées dans le formulaire
    data() {
      return {
        nom: "", // Stocke le nom de l'utilisateur
        prenom: "", // Stocke le prénom de l'utilisateur
        email: "", // Stocke l'email de l'utilisateur
        password: "", // Stocke le mot de passe de l'utilisateur
      };
    },
    methods: {
      // Méthode pour gérer l'inscription
      async handleRegister() {
        try {
          // Appel au service d'inscription avec les informations utilisateur
          await registerWithEmail(this.email, this.password, this.nom, this.prenom);

          // Affichage d'une confirmation après inscription réussie
          alert("Inscription réussie !");
          
          // Redirection vers la page d'accueil
          this.$router.push('/');
        } catch (error) {
          // Gestion des erreurs d'inscription
          alert("Erreur : " + error.message);
        }
      },
    },
  };
</script>

<style scoped>
/* Styles pour le formulaire d'inscription */
.register-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px; /* Largeur maximale du formulaire */
  margin: 30px auto; /* Centrage horizontal et espacement vertical */
  padding: 20px; /* Espacement interne */
  border: 1px solid #ccc; /* Bordure grise */
  border-radius: 8px; /* Coins arrondis */
  background-color: #fff; /* Fond blanc */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Ombre légère */
}

h2 {
  text-align: center; /* Centrer le titre */
  margin-bottom: 20px;
  font-size: 24px; /* Taille du texte */
  font-weight: bold;
  color: #333; /* Couleur du texte */
}

.form-group {
  display: flex;
  flex-direction: column; /* Alignement vertical des éléments */
  margin-bottom: 20px; /* Espacement entre les groupes */
}

label {
  margin-bottom: 8px; /* Espacement entre le label et le champ */
  font-size: 16px;
  color: #555; /* Couleur grise du label */
}

input {
  padding: 12px; /* Espacement interne */
  font-size: 16px;
  border: 1px solid #ddd; /* Bordure légère */
  border-radius: 6px; /* Coins arrondis */
  background-color: #f9f9f9; /* Fond légèrement gris */
  margin-top: 5px; /* Espacement entre le label et l'input */
}

input:focus {
  border-color: #007bff; /* Couleur bleue lors du focus */
  background-color: #fff; /* Fond blanc */
  outline: none; /* Supprime le contour par défaut */
}

.submit-button {
  padding: 12px; /* Espacement interne */
  font-size: 16px;
  color: white; /* Texte blanc */
  background-color: #007bff; /* Fond bleu */
  border: none; /* Pas de bordure */
  border-radius: 6px; /* Coins arrondis */
  cursor: pointer; /* Curseur pointeur au survol */
  margin-top: 15px;
  transition: background-color 0.3s ease; /* Transition fluide pour le changement de couleur */
}

.submit-button:hover {
  background-color: #0056b3; /* Couleur plus foncée au survol */
}

.submit-button:active {
  background-color: #004085; /* Couleur encore plus foncée lors du clic */
}
</style>