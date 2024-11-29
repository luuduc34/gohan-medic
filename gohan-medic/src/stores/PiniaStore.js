// src/store/piniaStore.js
import { createPinia } from 'pinia';
import piniaPersistedState from 'pinia-plugin-persistedstate';

// Créez une instance de Pinia
const pinia = createPinia();

// Ajoutez le plugin piniaPersistedState pour la persistance de l'état
pinia.use(piniaPersistedState);

// Exportez l'instance Pinia
export default pinia;