import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores/PiniaStore'
import { GoogleLoginPlugin } from 'vue3-google-login';

// Créer l'application Vue et utiliser à la fois Pinia et Vue Router
const app = createApp(App);

app.use(pinia);  // Utilisation de Pinia pour gérer l'état
app.use(router);  // Utilisation de Vue Router pour la navigation
app.use(GoogleLoginPlugin, {
    clientId: '459113751075-koc14kmi6be24f2vn8s1b77hf816mq2b.apps.googleusercontent.com',
  });

app.mount('#app');