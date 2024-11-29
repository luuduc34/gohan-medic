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
        <button v-if="isAuthenticated" @click="logoutUser">Déconnexion</button>
        <button v-else @click="goToAuth">Se connecter</button>
        <hr />
        <button>Mes commandes</button>
        <button>Mes favoris</button>
      </div>
    </div>
  </header>
</template>

<script>
// Importation du store Pinia
import { useUserStore } from '@/stores/UserStore';
import { logout } from '@/services/UserService';

export default {
  name: 'AppHeader',
  data() {
    return {
      showDropdown: false,
    };
  },
  computed: {
    // Utilisation du store Pinia via useUserStore
    isAuthenticated() {
      const userStore = useUserStore(); // Crée une instance du store Pinia
      return userStore.isAuthenticated; // Utiliser directement la valeur de `isAuthenticated` du store
    },
  },
  methods: {
    async logoutUser() {
      const success = await logout(); // Appelle la fonction de déconnexion
      if (success) {
        const userStore = useUserStore();
        userStore.user = null; // Mise à jour du store Pinia après déconnexion
        userStore.isAuthenticated = false; // Marquer l'utilisateur comme non authentifié
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
  watch: {
    // Regarder l'état de l'authentification et réagir aux changements
    'userStore.isAuthenticated'(newVal) {
      if (newVal) {
        this.showDropdown = true; // Ou toute autre logique que tu souhaites
      }
    },
  },
  created() {
    const userStore = useUserStore();
    userStore.fetchUser(); // Si tu veux récupérer l'utilisateur au démarrage
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
  height: auto; /* S'assurer que la hauteur est adaptée au contenu */
  z-index: 1000; /* S'assurer que le menu est au-dessus des autres éléments */
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
