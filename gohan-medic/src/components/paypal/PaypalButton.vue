<template>
  <div>
    <div id="paypal-boutons"></div>
  </div>
</template>

<script>
/* global paypal */

import { onMounted } from "vue";
import { useBasketStore } from "@/stores/BasketStore";
import { create_order } from "@/services/OrderService";

export default {
  setup(_, { emit }) {
    const basketStore = useBasketStore();

    // Variable pour stocker les montants calculés dans createOrder
    let orderSummary = {
      itemTotal: 0,
      shippingCost: 0,
      totalWithShipping: 0,
    };

    onMounted(() => {
      loadPayPalSDK();
    });

    function loadPayPalSDK() {
      const paypalContainer = document.getElementById("paypal-boutons");
      if (paypalContainer) {
        paypalContainer.innerHTML = ""; // Supprime tout contenu précédent
      }

      if (document.querySelector("script[src*='paypal.com/sdk/js']")) {
        console.warn("Le SDK PayPal est déjà chargé.");
        loadPayPalButtons();
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://www.paypal.com/sdk/js?client-id=Ac2CoYOwl_n6qX6WSsQLsi6gh-zAT96BCLJr46STp848fQN7yOa_WJN3z2E1ZjdS9rB0ed02L7_Vutgh&currency=EUR";
      script.async = true;
      script.onload = loadPayPalButtons;
      document.body.appendChild(script);
    }

    function loadPayPalButtons() {
      const paypalContainer = document.getElementById("paypal-boutons");
      if (!paypalContainer) {
        console.error("Le conteneur #paypal-boutons n'existe pas.");
        return;
      }

      paypalContainer.innerHTML = "";

      if (!paypal) {
        console.error("Le SDK PayPal n'est pas chargé correctement.");
        alert("Une erreur est survenue avec PayPal. Veuillez réessayer plus tard.");
        return;
      }

      paypal
        .Buttons({
          createOrder: (data, actions) => {
            const { produits, totalAmount } = basketStore.basketItems.reduce(
              (acc, item) => {
                const unitPrice = parseFloat(item.price).toFixed(2);
                acc.produits.push({
                  name: item.name,
                  quantity: item.quantity,
                  unit_amount: {
                    value: unitPrice,
                    currency_code: "EUR",
                  },
                });
                acc.totalAmount += parseFloat(unitPrice) * item.quantity;
                return acc;
              },
              { produits: [], totalAmount: 0 }
            );

            let shippingCost = totalAmount < 39 ? 3 : 0;
            const totalWithShipping = totalAmount + shippingCost;

            // Stocker les montants dans la variable orderSummary
            orderSummary = {
              itemTotal: parseFloat(totalAmount).toFixed(2),
              shippingCost: parseFloat(shippingCost).toFixed(2),
              totalWithShipping: parseFloat(totalWithShipping).toFixed(2),
            };

            return actions.order.create({
              purchase_units: [
                {
                  items: produits,
                  amount: {
                    value: totalWithShipping.toFixed(2),
                    currency_code: "EUR",
                    breakdown: {
                      item_total: { value: totalAmount.toFixed(2), currency_code: "EUR" },
                      shipping: { value: shippingCost.toFixed(2), currency_code: "EUR" },
                    },
                  },
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              create_order(orderSummary.itemTotal, orderSummary.shippingCost);

              // Émet les détails du paiement vers le parent
              emit("payment-success", {
                details,
                orderSummary,
              });
            });
          },
          onCancel: () => {
            alert("Transaction annulée !");
          },
        })
        .render("#paypal-boutons");
    }

    return {};
  },
};
</script>
