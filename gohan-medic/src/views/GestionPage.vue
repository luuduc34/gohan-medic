<template>
  <div class="gestion">
    <header class="titre">
      <h1>Bienvenue sur la page de gestion</h1>
    </header>

    <!-- Menu de gestion -->
    <nav class="menu-gestion">
      <ul>
        <li>
          <router-link to="/Gestion/Stock">Gestion des stocks</router-link>
        </li>
        <li>
          <router-link to="/Gestion/Export">Export</router-link>
        </li>
        <li>
          <router-link to="/Gestion/NewProduct">Ajout produit</router-link>
        </li>
        <li>
          <router-link to="/Gestion/ModifyProduct">Modifier produit</router-link>
        </li>
      </ul>
    </nav>

    <!-- Contenu des sous-pages (sera remplacé par les routes) -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "GestionPage",
};
</script>

<style scoped>
.gestion {
  padding: 20px;
  background-color: #e3f2fd; /* Bleu clair */
  border-radius: 10px;
  max-width: 800px;
  margin: auto;
}

.titre {
  text-align: center;
  margin-bottom: 20px;
}

.menu-gestion {
  margin: 20px 0;
}

.menu-gestion ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-gestion li {
  font-size: 1.2rem;
}

.menu-gestion a {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
  transition: color 0.3s;
}

.menu-gestion a:hover {
  color: #0056b3;
}
</style>
