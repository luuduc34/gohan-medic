<template>
  <div>
    <button @click="handleGoogleLogin" class="google-login-button">
      Connexion avec Google
    </button>
  </div>
</template>

<script>
// Importez votre fonction de connexion avec Google
import { loginWithGoogle } from "@/services/UserService";

export default {
  methods: {
    async handleGoogleLogin() {
      try {
        const result = await loginWithGoogle();
        if (result.success) {
          // Redirigez ou actualisez l'utilisateur connecté
          console.log("Connexion réussie avec Google :", result.user);
        } else {
          alert("Erreur lors de la connexion avec Google : " + result.error);
        }
      } catch (err) {
        alert("Une erreur est survenue : " + err.message);
      }
    },
  },
};
</script>

<style scoped>
.google-login-button {
  padding: 12px;
  font-size: 16px;
  color: white;
  background-color: #db4437; /* Couleur rouge Google */
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.3s ease;
}

.google-login-button:hover {
  background-color: #c23321; /* Rouge foncé Google */
}

.google-login-button:active {
  background-color: #a32e1c;
}
</style>
