<template>
  <header class="header-container">
    <!-- Nom de la société affiché comme un lien cliquable redirigeant vers la page d'accueil -->
    <div class="company-name" @click="goToHome">Gohan-Medic</div>
    <div class="tagline">Vos solutions pharmaceutiques en ligne</div>

    <!-- Section des boutons dans l'en-tête -->
    <div class="header-buttons">
      <!-- Bouton du panier redirigeant vers la page Panier -->
      <button class="cart-btn" @click="goToPanier">Panier</button>

      <!-- Menu déroulant pour les actions liées au compte -->
      <div
        class="dropdown"
        @mouseover="showDropdown = true"
        @mouseleave="showDropdown = false"
      >
        <!-- Affiche le menu déroulant au survol -->
        <!-- Cache le menu déroulant lorsque la souris quitte -->
      
        <!-- Affiche "Compte" si l'utilisateur est connecté, sinon "Se connecter" -->
        <button class="connect-btn">
          {{ isAuthenticated ? 'Compte' : 'Se connecter' }}
        </button>

        <!-- Menu affiché conditionnellement lorsque showDropdown est true -->
        <div v-if="showDropdown" class="dropdown-menu">
          <!-- Bouton de déconnexion visible uniquement si l'utilisateur est connecté -->
          <button v-if="isAuthenticated" @click="logoutUser">Déconnexion</button>

          <!-- Bouton de connexion visible si l'utilisateur n'est pas connecté -->
          <button v-else @click="goToAuth">Se connecter</button>

          <hr /> <!-- Ligne de séparation -->
          <button>Mes commandes</button> <!-- Accès aux commandes utilisateur -->
          <button>Mes favoris</button> <!-- Accès aux favoris utilisateur -->
        </div>
      </div>
    </div>
  </header>
  <body>
    <nav class="nav-container">
      <div class="menu-toggle" :class="{ open: isOpen }" @click="toggleMenu">
        <div class="bar"></div>
      </div>
      <div class="menu" :class="{ show: isOpen }">
        <button @click="goToCat">Catalogue</button>
        <button>Aide</button>
        <button>Contact</button>
        <button>Qui sommes-nous</button>
        <button>Gestion</button>
      </div>
    </nav>
  </body>
</template>

<script>
import { useUserStore } from '@/stores/UserStore';
import { logout } from '@/services/UserService';

export default {
  name: 'AppHeader',
  data() {
    return {
      showDropdown: false, // Contrôle le menu déroulant
      isOpen: false, // État du menu (fermé par défaut)
      screenWidth: window.innerWidth, // Largeur actuelle de l'écran
    };
  },
  computed: {
    // Vérifie si l'utilisateur est authentifié via Pinia
    isAuthenticated() {
      const userStore = useUserStore();
      return userStore.isAuthenticated;
    },
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen; // Inverse l'état du menu
    },
    // Fonction pour mettre à jour la largeur de l'écran
    updateScreenWidth() {
      this.screenWidth = window.innerWidth;
      // Si l'écran est assez large (par exemple, >= 1200px), fermez le menu
      if (this.screenWidth >= 1200) {
        this.isOpen = false;
      }
    },
    // Déconnecte l'utilisateur
    async logoutUser() {
      const success = await logout();
      if (success) {
        const userStore = useUserStore();
        userStore.user = null;
        userStore.isAuthenticated = false;
        this.$router.push('/');
      }
    },
    // Navigation
    goToHome() {
      this.$router.push('/');
    },
    goToAuth() {
      this.$router.push('/Auth');
    },
    goToCat() {
      this.$router.push('/Catalogue');
    },
    goToPanier() {
      this.$router.push('/Panier');
    },
  },

  watch: {
    // Surveille les changements d'authentification
    isAuthenticated(newVal) {
      if (!newVal) {
        this.showDropdown = false; // Cache le menu déroulant si déconnecté
      }
    },
  },
  created() {
    const userStore = useUserStore();
    // Charge les infos utilisateur au montage
    userStore.fetchUser();
    // Écoutez les changements de taille de la fenêtre
    window.addEventListener('resize', this.updateScreenWidth);
  },
  unmounted() {
    // Nettoyez l'écouteur d'événements lors de la destruction du composant
    window.removeEventListener('resize', this.updateScreenWidth);
  },
};
</script>
  
<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ccc;
}

.company-name {
  font-size: 24px;
  font-weight: bold;
  color: #1466b8;
  cursor: pointer;
}

.tagline {
  font-size: 14px;
  color: #555;
}

.header-buttons {
  display: flex;
  align-items: center;
}

.cart-btn, .connect-btn {
  padding: 10px 15px;
  margin-left: 10px;
  font-size: 14px;
  color: white;
  background-color: red;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cart-btn:hover, .connect-btn:hover {
  background-color: darkred;
}

.dropdown {
  position: relative;
  z-index: 9000;
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
  z-index: 9001;
}

.dropdown-menu button {
  display: block;
  width: 100%;
  padding: 8px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.dropdown-menu button:hover {
  background-color: #f1f1f1;
  color: #333;
  border-radius: 5px;
}

/* Affiche le menu déroulant au survol du bouton */
.dropdown:focus-within .dropdown-menu,
.dropdown:hover .dropdown-menu,
.dropdown-menu:hover {
  display: block;
}

/* Navigation principale */
.nav-container {
  display: flex;
  position: relative;
  flex-direction: column;
  background-color: #f8f8f8;
}

/* Bouton menu burger */
.menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  left: 20px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  position: relative;
}

.bar {
  width: 30px;
  height: 3px;
  background-color: #333;
  position: absolute;
  transition: all 0.3s ease-in-out;
}

.bar::before,
.bar::after {
  content: '';
  width: 30px;
  height: 3px;
  background-color: #333;
  position: absolute;
  left: 0;
  transition: all 0.3s ease-in-out;
}

.bar::before {
  top: -8px;
}

.bar::after {
  bottom: -8px;
}

/* État ouvert (croix) */
.menu-toggle.open .bar {
  background-color: transparent;
}

.menu-toggle.open .bar::before {
  transform: rotate(45deg);
  top: 0;
}

.menu-toggle.open .bar::after {
  transform: rotate(-45deg);
  bottom: 0;
}

/* Menu */
.menu {
  list-style: none;
  margin: 0;
  position: absolute;
  top: 40px;
  left: 10px;
  background: #f8f8f8;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: none; /* Menu masqué par défaut */
  flex-direction: column; /* Par défaut, le menu est en colonne */
  z-index: 1000;
}

.menu.show {
  display: flex;
}

.menu button {
  background: none;
  border: none;
  padding: 10px 20px;
  text-align: left;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
}

.menu button:hover {
  background-color: #f0f0f0;
}

.menu button:last-child {
  border-bottom: none;
}

/* Transition pour le menu */
.menu.show {
  animation: slideDown 0.3s ease-in-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Lorsque l'écran est supérieur à 1200px */
@media (min-width: 1200px) {
  .menu {
    display: flex;
    position: static;
    top: auto;
    left: auto;
    flex-direction: row;
    background: none;
    box-shadow: none;
    border: none;
  }

  .menu button {
    border-bottom: none;
    margin: 0 10px;
  }

  /* Cacher le bouton burger */
  .menu-toggle {
    display: none;
  }
}

/* Lorsque l'écran est inférieur à 1200px */
@media (max-width: 1199px) {
  .menu {
    display: none;
    flex-direction: column;
  }

  .menu.show {
    display: flex;
  }
}
</style>