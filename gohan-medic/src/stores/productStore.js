import { defineStore } from "pinia";

export const useProductStore = defineStore("ProductStore", {
  state: () => ({
    currentProduct: null,
  }),
  actions: {
    setProduct(product) {
      this.currentProduct = product;
    },
  },

  persist: true, // Sauvegarde automatique de l'état (même après un refresh)
});
