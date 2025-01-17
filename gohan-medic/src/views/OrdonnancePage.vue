<template>
  <div class="ordonnance-page">
    <h1 class="page-title">Gestion des Ordonnances</h1>
    <div class="menu-container">
      <router-link to="/ordonnance/upload" class="menu-link"
        >Téléverser une ordonnance</router-link
      >
      <router-link to="/ordonnance" class="menu-link">Mes ordonnances</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrdonnancePage",
};
</script>

<style scoped>
.ordonnance-page {
  max-width: 600px;
  margin: 20px auto;
  text-align: center;
}

.page-title {
  font-size: 2rem;
  color: #2d9cdb;
  margin-bottom: 20px;
}

.menu-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.menu-link {
  padding: 10px 20px;
  background-color: #2d9cdb;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.menu-link:hover {
  background-color: #1b6ba8;
}
</style>
