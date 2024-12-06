<template>
  <!-- Formulaire de connexion -->
  <form @submit.prevent="handleLogin" class="login-form">
    <h2>Connexion</h2>

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
      <input v-model="password" type="password" placeholder="Mot de passe" required />
    </div>

    <!-- Bouton pour soumettre le formulaire -->
    <button type="submit" class="submit-button">Se connecter</button>
  </form>
</template>

<script>
  // Importation des services et du store utilisateur
  import { loginWithEmail } from '@/services/UserService'; // Fonction pour gérer la connexion
  import { useUserStore } from '@/stores/UserStore'; // Store utilisateur pour gérer l'état global

  export default {
    // Définition des données utilisées dans le formulaire
    data() {
      return {
        email: "", // Stocke l'email de l'utilisateur
        password: "", // Stocke le mot de passe de l'utilisateur
      };
    },
    methods: {
      // Méthode pour gérer la connexion
      async handleLogin() {
        try {
          // Appel au service de connexion avec email et mot de passe
          const user = await loginWithEmail(this.email, this.password);

          if (user) {
            // Si la connexion est réussie, on met à jour le store utilisateur
            const userStore = useUserStore();
            userStore.fetchUser(user); // Mise à jour de l'état utilisateur dans Pinia

            // Redirection vers la page d'accueil
            this.$router.push('/');
          } else {
            // Affiche une alerte si les identifiants sont incorrects
            alert("Échec de l'authentification. Veuillez vérifier vos identifiants.");
          }
        } catch (error) {
          // Gestion des erreurs (par exemple, problème réseau ou serveur)
          alert("Erreur : " + error.message);
        }
      },
    },
  };
</script>

<style scoped>
/* Styles pour le formulaire de connexion */
.login-form {
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
