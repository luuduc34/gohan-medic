import { useBasketStore } from "@/stores/BasketStore";

export const BasketService = {
    getBasket(userId) {
        const key = userId ? `basket_${userId}` : 'guest_basket';
        const savedBasket = localStorage.getItem(key);
        return savedBasket ? JSON.parse(savedBasket) : [];
    },

    saveBasket(userId, basketItems) {
        const key = userId ? `basket_${userId}` : 'guest_basket';
        localStorage.setItem(key, JSON.stringify(basketItems));
    },

    clearBasket(userId) {
        const key = userId ? `basket_${userId}` : 'guest_basket';
        localStorage.removeItem(key);
    },

    transferGuestBasketToUser(userId, guestBasket) {
        const userBasket = this.getBasket(userId); // Récupère le panier utilisateur connecté

        // Fusionne les paniers en évitant les doublons et gère la quantité
        guestBasket.forEach(guestItem => {
            const existingItem = userBasket.find(item => item.id === guestItem.id);
            if (existingItem) {
                // Si l'article existe déjà, on ajoute la quantité
                existingItem.quantity += guestItem.quantity || 1;
            } else {
                // Sinon, on ajoute l'article avec la quantité
                userBasket.push({
                    ...guestItem,
                    quantity: guestItem.quantity || 1,
                });
            }
            localStorage.setItem('guestBasket', JSON.stringify(this.guestBasket));
        });
    
        // Sauvegarde le panier fusionné pour l'utilisateur
        this.saveBasket(userId, userBasket);

        // Si tu veux également vider le panier dans le store du visiteur, tu peux le faire ici
        // Pour que le panier invité soit également vidé dans le store local
        
        const basketStore = useBasketStore();
        basketStore.guestBasket = [];
    }
};