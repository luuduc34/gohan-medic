import { defineStore } from "pinia";
import { checkAuthStatus, logout } from "@/services/UserService";
import { BasketService } from "@/services/BasketService";
import { useBasketStore } from "./BasketStore";
import { useUserOrderStore } from "./UserOrderStore";
import { fetchPendingPrescriptionsCount } from "@/services/PrescriptionService";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,             // Contiendra les informations complètes de l'utilisateur
    isAuthenticated: false, // Indicateur pour savoir si l'utilisateur est connecté ou non
    role: null,             // Rôle utilisateur (1: Client, 2: Admin)
    error: null,            // Contiendra les erreurs rencontrées
    pendingCount: 0,
  }),

  getters: {
    // Retourne vrai si l'utilisateur est un administrateur
    isAdmin: (state) => {
      // Vérifie si l'utilisateur est défini et si son rôle est 2 (administrateur)
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

        console.log(user);
        console.log(user.profile.adresse);

        if (user) {
          this.user = user;                       // Stocker les informations utilisateur
          this.isAuthenticated = true;           // Marquer l'utilisateur comme connecté
          this.role = user.profile.id_role_user; // Stocker le rôle utilisateur
          this.error = null;                     // Réinitialiser les erreurs

          // Si l'utilisateur est un administrateur, récupérez les notifications
          if (this.isAdmin) {
            const pendingCount = await fetchPendingPrescriptionsCount();
            this.pendingCount = pendingCount || 0;
            console.log("Notifications mises à jour (Admin) :", this.pendingCount);

            // Émettez un événement global si nécessaire
            window.dispatchEvent(new CustomEvent("updatePendingCount", { detail: this.pendingCount }));
          }

          // Charger le panier de l'utilisateur
          const basketStore = useBasketStore();  // Accéder au store du panier
          basketStore.setUserId(user.profile.id);       // Définir l'ID utilisateur et transférer le panier du guest

          // Charger les commande de l'utilisateur
          const orderStore = useUserOrderStore();  // Accéder au store du des commandes
          orderStore.fetchOrders(user.profile.id);

        } else {
          this.resetState(); // Réinitialise l'état si aucun utilisateur n'est connecté
        }
      } catch (error) {
        this.resetState();
        this.error = "Impossible de récupérer les informations utilisateur.";
      }
    },

    // Fonction pour déconnecter l'utilisateur
    async logoutUser() {
      try {
        const response = await logout(); // Appeler la fonction logout
    
        if (response.success) {
          const basketStore = useBasketStore();
    
          // Sauvegarder le panier avant la déconnexion
          BasketService.saveBasket(basketStore.userId, basketStore.basketItems);
    
          this.resetState(); // Réinitialiser l'état utilisateur
          basketStore.setUserId(null); // Réinitialiser l'ID utilisateur pour le panier
          BasketService.clearBasket(null); // Vider le panier invité
    
        } else {
          this.error = response.error || "Erreur lors de la déconnexion.";
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
      this.pendingCount = 0;
    },
  },

  persist: true, // Sauvegarde automatique de l'état utilisateur (même après un refresh)
});