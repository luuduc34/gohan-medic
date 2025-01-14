import { defineStore } from "pinia";
import { BasketService } from "@/services/BasketService";

export const useBasketStore = defineStore('basket', {
    state: () => ({
        basketItems: [], // produits dans le panier
        userId: null, // ID de l'utilisateur connecté
    }),
    
    getters: {
        totalAmount() {
          // Calcul du total du panier
          return this.basketItems.reduce((total, item) => {
            return total + item.price * item.quantity; // Multiplie le prix par la quantité pour chaque article
          }, 0);
        },
      },

    actions: {
        setUserId(id) {
            if (id) {
                // Transférer les produits du panier invité vers l'utilisateur connecté
                BasketService.transferGuestBasketToUser(id);
            }

            this.userId = id;
            this.loadBasket(); // Recharger le panier avec le bon contexte (invité ou utilisateur)
        },

        loadBasket() {
            this.basketItems = BasketService.getBasket(this.userId);
        },

        addItem(product) {
            // Rechercher si le produit est déjà dans le panier
            const existingItem = this.basketItems.find(item => item.id === product.id);
    
            if (existingItem) {
                // Si le produit est déjà présent, augmenter la quantité
                existingItem.quantity += product.quantity || 1; // Si `quantity` n'existe pas, on ajoute 1
            } else {
                // Sinon, ajouter le produit comme nouvel item, avec une quantité initiale
                this.basketItems.push({
                ...product,
                quantity: product.quantity || 1, // Ajout d'une quantité par défaut si non spécifiée
                });
            }
    
            // Sauvegarder le panier dans le localStorage
            BasketService.saveBasket(this.userId, this.basketItems);
        },

        removeItem(productId) {
            this.basketItems = this.basketItems.filter(item => item.id !== productId);
            BasketService.saveBasket(this.userId, this.basketItems);
        },

        logBasketItems() {
            console.log("Contenu du panier :", this.basketItems);
        },

        clearBasket() {
            this.basketItems = [];
            BasketService.clearBasket(this.userId);
        }
    },
    persist: true, // Sauvegarde l'état du panier dans Pinia (pour éviter les rechargements inutiles)
});