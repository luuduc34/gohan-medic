<template>
  <div class="search-bar">
    <input
      v-model="searchQuery"
      @input="onSearch"
      type="text"
      class="search-input"
      placeholder="Rechercher..."
    />
    <button @click="clearSearch" class="clear-button" v-if="searchQuery">✕</button>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  props: {
    initialQuery: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      searchQuery: this.initialQuery,
    };
  },
  methods: {
    onSearch() {
      this.$emit("update:searchQuery", this.searchQuery); // Émet la recherche vers le parent
    },
    clearSearch() {
      this.searchQuery = "";
      this.onSearch(); // Réinitialise la recherche
    },
  },
};
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
}

.search-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.clear-button {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #888;
}

.clear-button:hover {
  color: #555;
}
</style>
