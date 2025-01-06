import { defineStore } from "pinia";

export const useBasketStore = defineStore('basket', {
    state: () => ({
        basketItems: [], // produits dans le panier
        userId : null,   // ID de l'utilisateur connecté
    }),
    actions: {
        setUserId(id) {
            this.userId = id;
            this.loadBasketToLocalStorage();
        },
        addItem(product) {
            this.basketItems.push(product);
            this.saveBasketToLocalStorage();
        },
        removeItem(productId) {
            this.basketItems = this.basketItems.filter(item => item.id !== productId);
            this.saveBasketToLocalStorage();
        },
        clearBasket() {
            this.basketItems = [];
            this.saveBasketToLocalStorage();
        },
        saveBasketToLocalStorage() {
            if (this.userId) 
            {
                localStorage.setItem(`basket_${this.userId}`, JSON.stringify(this.basketItems));
            }
        },
        loadBasketFromLocalStorage() {
            if (this.userId) 
            {
              const savedBasket = localStorage.getItem(`basket_${this.userId}`);
              this.basketItems = savedBasket ? JSON.parse(savedBasket) : [];
            }
        },
    },
    persist: true, // // Sauvegarde automatique de l'état panier (même après un refresh ou une déconnexion)
});