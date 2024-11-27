<template>
    <header class="header-container">
      <!-- Nom de la société -->
      <div class="company-name" @click="goToHome">Gohan-Medic</div>
  
      <!-- Menu déroulant -->
      <div
        class="dropdown"
        @mouseover="showDropdown = true"
        @mouseleave="showDropdown = false"
      >
        <button class="connect-btn">
          {{ isAuthenticated ? 'Compte' : 'Se connecter' }}
        </button>
        <div v-if="showDropdown" class="dropdown-menu">
          <button v-if="isAuthenticated" @click="logout">Déconnexion</button>
          <button v-else @click="goToAuth">Se connecter</button>
          <hr />
          <button>Mes commandes</button>
          <button>Mes favoris</button>
        </div>
      </div>
    </header>
  </template>
  
  <script>
  import UserService from '@/services/UserService';

  export default {
    name: 'AppHeader',
    data() {
      return { showDropdown: false };
    },
    methods: {
    async checkAuth() {
      // Vérification de l'authentification
      const user = await UserService.checkAuthStatus();
      this.isAuthenticated = !!user; // Si un utilisateur est trouvé, il est connecté
    },
    async logoutUser() {
      const success = await UserService.logout(); // Appelle la fonction de déconnexion
      if (success) {
        this.isAuthenticated = false; // Mise à jour de l'état de connexion
        this.$router.push("/"); // Redirection vers la page d'accueil après déconnexion
      }
    },
        goToHome() {
        this.$router.push('/'); // Redirige vers la page d'accueil
    },
        goToAuth() {
        this.$router.push('/auth');
      },
    },
  };
  </script>
  
  <style scoped>
  /* Container de l'en-tête */
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #f9f9f9;
    border-bottom: 1px solid #ccc;
  }
  
  /* Nom de la société */
  .company-name {
    font-size: 24px;
    font-weight: bold;
    color: #1466b8; /* Bleu */
  }
  
  /* Bouton "Se connecter" */
  .connect-btn {
    padding: 10px 15px;
    font-size: 14px;
    color: white;
    background-color: red;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .connect-btn:hover {
    background-color: darkred;
  }
  
  /* Dropdown menu */
  .dropdown {
    position: relative;
  }
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 10px;
    width: 200px; /* Limite la largeur */
  }
  
  .dropdown-menu button {
    display: block;
    width: 100%; /* Boutons alignés verticalement */
    text-align: left;
    padding: 8px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    transition: background-color 0.3s;
  }
  
  .dropdown-menu button:hover {
    background-color: #f0f0f0;
  }
  
  /* Ligne de séparation */
  .dropdown-menu hr {
    margin: 10px 0;
    border: none;
    border-top: 1px solid #ccc;
  }
  </style>
  