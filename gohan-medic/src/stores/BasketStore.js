import { defineStore } from "pinia";
import { BasketService } from "@/services/BasketService";

export const useBasketStore = defineStore('basket', {
  state: () => ({
    basketItems: [], // produits dans le panier
    userId: null, // ID de l'utilisateur connecté
    guestBasket: [], // Panier pour les visiteurs (non connectés)
  }),

  getters: {
    totalAmount() {
        if (this.userId) {
            // Calcul du total du panier
            return this.basketItems.reduce((total, item) => {
                return total + item.price * item.quantity; // Multiplie le prix par la quantité pour chaque article
            }, 0);
        } else {
            // Calcul du total du panier
            return this.guestBasket.reduce((total, item) => {
                return total + item.price * item.quantity; // Multiplie le prix par la quantité pour chaque article
            }, 0);
        }
    },
  },

  actions: {
    setUserId(id) {
      if (id) {
        // Transférer les produits du panier invité vers l'utilisateur connecté
        if (this.guestBasket.length > 0) {
            BasketService.transferGuestBasketToUser(id, this.guestBasket);
            // Vider le panier invité après transfert
            this.guestBasket = []; // Vider le panier dans le store local (guestBasket)
        }

        this.userId = id;
        this.loadBasket(); // Recharger le panier de l'utilisateur
        localStorage.removeItem("guest_basket"); // Supprimer l'entrée du panier invité après fusion
      } else {
        this.userId = null;
        this.loadGuestBasket(); // Charger le panier visiteur si l'utilisateur n'est pas connecté
      }
    },

    loadBasket() {
      if (this.userId) {
        this.basketItems = BasketService.getBasket(this.userId);
      }
    },

    loadGuestBasket() {
      // Charger le panier du visiteur à partir du localStorage
      const savedBasket = localStorage.getItem('guestBasket');
      this.guestBasket = savedBasket ? JSON.parse(savedBasket) : [];
    },

    addItem(product) {
      if (this.userId) {
        // Panier utilisateur
        const existingItem = this.basketItems.find(item => item.id === product.id);
        if (existingItem) {
          existingItem.quantity += product.quantity || 1;
        } else {
          this.basketItems.push({
            ...product,
            quantity: product.quantity || 1,
          });
        }
        BasketService.saveBasket(this.userId, this.basketItems);
      } else {
        // Panier visiteur
        const existingItem = this.guestBasket.find(item => item.id === product.id);
        if (existingItem) {
          existingItem.quantity += product.quantity || 1;
        } else {
          this.guestBasket.push({
            ...product,
            quantity: product.quantity || 1,
          });
        }
        // Sauvegarder le panier du visiteur dans localStorage
        localStorage.setItem('guestBasket', JSON.stringify(this.guestBasket));
      }
    },

    removeItem(productId) {
      if (this.userId) {
        this.basketItems = this.basketItems.filter(item => item.id !== productId);
        BasketService.saveBasket(this.userId, this.basketItems);
      } else {
        this.guestBasket = this.guestBasket.filter(item => item.id !== productId);
        localStorage.setItem('guestBasket', JSON.stringify(this.guestBasket));
      }
    },

    clearBasket() {
      if (this.userId) {
        this.basketItems = [];
        BasketService.clearBasket(this.userId);
      } else {
        this.guestBasket = [];
        BasketService.clearBasket(null);
      }
    }
  },

  persist: true, // Sauvegarde l'état du panier dans Pinia
});
