import { defineStore } from "pinia";
import { checkAuthStatus, logout } from "@/services/UserService";
import { BasketService } from "@/services/BasketService";
import { useBasketStore } from "./BasketStore";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,             // Contiendra les informations complètes de l'utilisateur
    isAuthenticated: false, // Indicateur pour savoir si l'utilisateur est connecté ou non
    role: null,             // Rôle utilisateur (1: Client, 2: Admin)
    error: null,            // Contiendra les erreurs rencontrées
  }),

  getters: {
    // Retourne vrai si l'utilisateur est un administrateur
    isAdmin: (state) => {
      // Vérifie si l'utilisateur est défini et si son rôle est 2 (administrateur)
      console.log(state.role);
      return state.role === 2;
    },
  
    // Retourne vrai si l'utilisateur est un client
    isClient: (state) => {
      // Vérifie si l'utilisateur est défini et si son rôle est 1 (client)
      return state.user && state.role === 1;
    },
  
    // Retourne le nom complet de l'utilisateur (si disponible)
    fullName: (state) => {
      if (state.user && state.user.profile) {
        return `${state.user.profile.first_name} ${state.user.profile.name}`;
      }
      return null;
    },
  },

  actions: {
    // Fonction pour récupérer l'utilisateur connecté et ses informations
    async fetchUser() {
      try {
        const user = await checkAuthStatus();

        if (user) {
          this.user = user;                       // Stocker les informations utilisateur
          this.isAuthenticated = true;           // Marquer l'utilisateur comme connecté
          this.role = user.profile.id_role_user; // Stocker le rôle utilisateur
          this.error = null;                     // Réinitialiser les erreurs

          // Charger le panier de l'utilisateur
          const basketStore = useBasketStore();  // Accéder au store du panier
          basketStore.setUserId(user.profile.id);       // Définir l'ID utilisateur et transférer le panier du guest

        } else {
          this.resetState(); // Réinitialise l'état si aucun utilisateur n'est connecté
        }
      } catch (error) {
        this.resetState();
        this.error = "Impossible de récupérer les informations utilisateur.";
        console.error("Erreur dans fetchUser:", error);
      }
    },

    // Fonction pour déconnecter l'utilisateur
    async logoutUser() {
      try {
        const success = await logout();
        if (success) {
          const basketStore = useBasketStore();
    
          // Sauvegarder le panier avant déconnexion
          BasketService.saveBasket(basketStore.userId, basketStore.basketItems);
    
          this.resetState(); // Réinitialise l'état après déconnexion
    
          // Passer en mode invité pour le panier
          basketStore.setUserId(null);
        } else {
          this.error = "Erreur lors de la déconnexion.";
        }
      } catch (error) {
        this.error = "Erreur inattendue lors de la déconnexion.";
        console.error("Erreur dans logoutUser:", error);
      }
    },

    // Réinitialise l'état utilisateur
    resetState() {
      this.user = null;
      this.isAuthenticated = false;
      this.role = null;
      this.error = null;
    },
  },

  persist: true, // Sauvegarde automatique de l'état utilisateur (même après un refresh)
});
