<template>
  <div>
    <!-- Titre principal -->
    <h1 class="gestion-title">Gestion</h1>

    <!-- Menu Gestion -->
    <div class="menu-container">
      <ul class="menu-gestion">
        <li>
          <router-link to="/Gestion/Stock">Gestion des stocks</router-link>
        </li>
        <li>
          <router-link to="/Gestion/Export">Export</router-link>
        </li>
        <li>
          <router-link to="/Gestion/Produits">Gestion des produits</router-link>
        </li>
      </ul>
    </div>

    <!-- Contenu des sous-pages -->
    <div class="gestion-content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "GestionPage",
};
</script>

<style scoped>
/* Titre en bleu clair */
.gestion-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #2d9cdb; /* Bleu pharmaceutique */
  margin-bottom: 30px;
  padding: 15px;
  background-color: #e3f2fd; /* Bleu clair doux */
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Conteneur du menu */
.menu-container {
  background-color: #ffffff; /* Fond blanc */
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto 20px auto;
  padding: 20px;
  text-align: center;
}

/* Menu */
.menu-gestion {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-around;
}

.menu-gestion li a {
  text-decoration: none;
  font-size: 1.2rem;
  color: #007bff;
  font-weight: bold;
  transition: color 0.3s ease;
}

.menu-gestion li a:hover {
  color: #0056b3;
}

/* Contenu des sous-pages */
.gestion-content {
  background-color: #ffffff;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
