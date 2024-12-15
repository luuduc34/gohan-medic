import { defineStore } from "pinia";

export const useProductStore = defineStore("productStore", {
  state: () => ({
    currentProduct: null,
  }),
  actions: {
    setProduct(product) {
      this.currentProduct = product;
    },
  },
});
