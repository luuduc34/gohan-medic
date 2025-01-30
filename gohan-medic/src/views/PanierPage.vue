<template>
  <div class="panier">
    <header class="titre">
      <h1>Bienvenue sur votre panier</h1>
    </header>

    <div class="basket-container">
      <!-- Afficher un message si le panier est vide -->
      <p v-if="basket.length === 0">Votre panier est vide.</p>

      <!-- Afficher les produits dans le panier -->
      <ProductBasketCard
        v-for="product in basket"
        :key="product.id"
        :product="product"
        @update-quantity="updateQuantity"
        @request-remove="confirmRemoveItem"
      />
    </div>

    <!-- Afficher le total en dessous -->
    <div v-if="basket.length > 0" class="total-container">
      <div class="summary">
        <div class="summary-row">
          <span>Sous-total</span>
          <span>{{ subtotalFormatted }}</span>
        </div>
        <div class="summary-row">
          <span>Frais de livraison</span>
          <span>{{ shippingCostFormatted }}</span>
        </div>
        <hr />
        <div class="summary-total">
          <span>Montant total</span>
          <span>{{ totalAmountFormatted }}</span>
        </div>
      </div>

      <!-- Bouton Commander -->
      <button class="order-button" @click="handleContinueOrder">
        Continuer la commande
      </button>
    </div>

    <!-- Popup de confirmation -->
    <div v-if="showConfirmPopup" class="popup-overlay">
      <div class="popup">
        <h2>Supprimer l'article ?</h2>
        <p>Voulez-vous vraiment supprimer cet article de votre panier ?</p>
        <div class="popup-buttons">
          <button @click="removeConfirmedItem">Oui</button>
          <button @click="cancelRemove">Non</button>
        </div>
      </div>
    </div>

    <!-- Modal Paiement réussi -->
    <div v-if="showSuccessModal" class="popup-overlay">
      <div class="popup">
        <h2>Paiement réussi !</h2>
        <p>Merci pour votre commande.</p>
        <button @click="closeSuccessModal">Fermer</button>
      </div>
    </div>

    <!-- Modal de choix du moyen de paiement -->
    <div v-if="showPaymentModal" class="popup-overlay">
      <div class="popup">
        <h2>Choisissez votre moyen de paiement</h2>
        <PaypalButton @payment-success="onPaymentSuccess" />
        <button @click="closePaymentModal">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useBasketStore } from "@/stores/BasketStore";
import { useUserStore } from "@/stores/UserStore";
import ProductBasketCard from "@/components/Product/ProductBasketCard";
import { computed, ref, watch } from "vue";
import { checkStock } from "@/services/ProductService";
import PaypalButton from "@/components/paypal/PaypalButton";

export default {
  name: "PanierPage",
  components: {
    ProductBasketCard,
    PaypalButton,
  },
  data() {
    return {
      showConfirmPopup: false, // Contrôle l'affichage du popup
      itemToRemove: null, // Stocke l'ID du produit à supprimer
      showShippingInfo: false, // Contrôle l'affichage d'infos sur les frais de port
      showPaymentModal: false, // Contrôle l'affichage de la modal de paiement
      showSuccessModal: false, // Contrôle l'affichage de la modal de Succes de payement
    };
  },
  setup() {
    const basketStore = useBasketStore();
    const userStore = useUserStore();
    const basket = ref([]); // Utilisation de ref pour une réactivité

    // Initialiser le panier correctement en fonction de l'état de l'utilisateur
    watch(
      () => userStore.user,
      (user) => {
        if (user) {
          basket.value = basketStore.basketItems; // Panier de l'utilisateur
        } else {
          basket.value = basketStore.guestBasket; // Panier invité
        }
      },
      { immediate: true } // Appliquer immédiatement
    );

    // Calculer le sous-total
    const subtotal = computed(() => {
      return basketStore.totalAmount;
    });

    // Frais de port : 3 € si sous-total < 39 €, sinon gratuit
    const shippingCost = computed(() => {
      return subtotal.value < 39 ? 3 : 0;
    });

    // Total avec frais de port
    const totalAmount = computed(() => {
      return subtotal.value + shippingCost.value;
    });

    // Formater les montants
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(amount);
    };

    const subtotalFormatted = computed(() => formatCurrency(subtotal.value));
    const shippingCostFormatted = computed(() => formatCurrency(shippingCost.value));
    const totalAmountFormatted = computed(() => formatCurrency(totalAmount.value));

    const updateQuantity = ({ id, quantity }) => {
      const product = basket.value.find((item) => item.id === id);
      if (product) {
        if (quantity > 0) {
          product.quantity = quantity;
        } else {
          this.confirmRemoveItem(id);
        }
      }
    };
    return {
      basketStore,
      basket,
      subtotalFormatted,
      shippingCostFormatted,
      totalAmountFormatted,
      updateQuantity,
    };
  },
  methods: {
    async handleContinueOrder() {
      try {
        // Vérifiez si l'utilisateur a une adresse
        const userStore = useUserStore();
        if (
          !userStore.user ||
          !userStore.user.profile ||
          !userStore.user.profile.adresse
        ) {
          alert(
            "Vous devez ajouter une adresse ou etre connecter pour continuer votre commande."
          );
          return;
        }

        // Appeler la fonction checkStock avec le panier actuel
        const result = await checkStock(this.basketStore.basketItems);

        if (result.success) {
          // Tous les articles sont en stock, afficher la modal de paiement
          this.showPaymentModal = true;
        } else {
          // Afficher un message d'erreur si des articles ne sont pas en stock
          alert(result.message);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du stock :", error);
        alert("Une erreur s'est produite. Veuillez réessayer.");
      }
    },

    confirmRemoveItem(productId) {
      this.showConfirmPopup = true;
      this.itemToRemove = productId;
    },
    removeConfirmedItem() {
      const basketStore = useBasketStore();
      const userStore = useUserStore();

      basketStore.removeItem(this.itemToRemove);

      if (userStore.user) {
        this.basket = [...basketStore.basketItems]; // Mettre à jour avec les éléments de l'utilisateur
      } else {
        this.basket = [...basketStore.guestBasket]; // Mettre à jour avec les éléments du panier invité
      }

      this.showConfirmPopup = false;
      this.itemToRemove = null;
    },
    onPaymentSuccess() {
      this.showPaymentModal = false; // Ferme la modal de paiement
      this.showSuccessModal = true; // Ouvre la modal de succès
      this.basketStore.loadBasket();
    },
    closeSuccessModal() {
      this.showSuccessModal = false; // Ferme la modal de succès
    },
    cancelRemove() {
      this.showConfirmPopup = false;
      this.itemToRemove = null;
    },
    toggleShippingInfo() {
      this.showShippingInfo = !this.showShippingInfo;
    },
    closePaymentModal() {
      this.showPaymentModal = false;
    },
  },
};
</script>

<style scoped>
.panier {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
}

.titre h1 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #2d9cdb;
  margin-bottom: 30px;
  padding: 15px;
  background-color: #e3f2fd;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.basket-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto; /* Centre le conteneur horizontalement */
}

.total-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  background-color: #f9f9f9;
}

.summary {
  width: 100%;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 10px;
}

.order-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #2d9cdb;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
}

.order-button:hover {
  background-color: #1a75b6;
}

/* Styles pour le popup */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.popup {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.popup H2 {
  color: #44c0f1;
}

.popup-buttons {
  margin-top: 15px;
  display: flex;
  justify-content: space-around;
}

.popup-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.popup-buttons button:first-child {
  background-color: #d92332;
  color: white;
}

.popup-buttons button:last-child {
  background-color: #ccc;
  color: black;
}
</style>
