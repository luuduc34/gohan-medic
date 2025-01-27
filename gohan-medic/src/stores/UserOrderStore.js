import { defineStore } from "pinia";
import { getUserOrders } from "@/services/OrderService";

export const useUserOrderStore = defineStore("userOrder", {
  state: () => ({
    orders: [], // Liste des commandes
    isLoading: false, // État de chargement
    error: null, // Message d'erreur
  }),

  actions: {
    async fetchOrders(id_user) {
      this.error = null;

      try {
        const orders = await getUserOrders(id_user);
        this.orders = orders;
      } catch (err) {
        this.error = err.message || "Erreur lors du chargement des commandes.";
      }
    },
  },
  persist: true, // Sauvegarde automatique de l'état (même après un refresh)
});