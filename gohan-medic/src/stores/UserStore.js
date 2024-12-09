import { defineStore } from "pinia";
import { checkAuthStatus, logout } from "@/services/UserService";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null, // Contiendra les informations complètes de l'utilisateur
    isAuthenticated: false, // Indicateur pour savoir si l'utilisateur est connecté ou non
    role: null,             // Rôle utilisateur (1: Client, 2: Admin)
  }),

  actions: {
    // Fonction pour récupérer l'utilisateur connecté et ses informations
    async fetchUser() {
      try {
        const user = await checkAuthStatus();
        if (user) {
          this.user            = user; // Stocker les informations utilisateur dans Pinia
          this.isAuthenticated = true; // Marquer l'utilisateur comme connecté
          this.role            = user.profile.id_role_user; // Stocke le rôle utilisateur
        } else {
          this.user            = null;
          this.isAuthenticated = false;
        }
      } catch (error) {
        this.user            = null;
        this.isAuthenticated = false;
        this.role            = null;
      }
    },

    // Fonction pour déconnecter l'utilisateur
    async logoutUser() {
      const success = await logout();
      if (success) {
        this.user            = null; // Réinitialiser les informations de l'utilisateur
        this.isAuthenticated = false; // Marquer l'utilisateur comme non connecté
        this.role            = null; // Réinitialise le rôle utilisateur
      }
    },
  },

  persist: true, // Sauvegarde automatique de l'état utilisateur (même après un refresh)
});