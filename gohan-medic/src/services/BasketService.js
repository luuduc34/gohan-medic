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

    transferGuestBasketToUser(userId) {
        const guestBasket = this.getBasket(null); // Récupère le panier invité
        const userBasket = this.getBasket(userId); // Récupère le panier utilisateur connecté

        // Fusionne les paniers en évitant les doublons
        guestBasket.forEach(guestItem => {
            if (!userBasket.some(item => item.id === guestItem.id)) {
                userBasket.push(guestItem);
            }
        });

        // Sauvegarde le panier fusionné pour l'utilisateur
        this.saveBasket(userId, userBasket);

        // Supprime le panier invité
        this.clearBasket(null);
    }
};