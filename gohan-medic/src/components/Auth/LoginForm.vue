<template>
  <form @submit.prevent="handleLogin" class="login-form">
    <h2>Connexion</h2>
    <div class="form-group">
      <label for="email">Email :</label>
      <input v-model="email" id="email" type="email" placeholder="Email" required />
    </div>
    <div class="form-group">
      <label for="password">Mot de passe :</label>
      <input v-model="password" type="password" placeholder="Mot de passe" required />
    </div>
    <button type="submit" class="submit-button">Se connecter</button>
  </form>
</template>

<script>
import UserService from '@/services/UserService';

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        await UserService.loginWithEmail(this.email, this.password); // connexion avec Supabase(DB)
        this.$router.push('/');  // Redirection vers la page d'accueil ou une page de succès
      } catch (error) {
        alert("Erreur : " + error.message);
      }
    },
  },
};
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  margin: 30px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

label {
  margin-bottom: 8px;
  font-size: 16px;
  color: #555;
}

input {
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
  margin-top: 5px;
}

input:focus {
  border-color: #007bff;
  background-color: #fff;
  outline: none;
}

.submit-button {
  padding: 12px;
  font-size: 16px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}

.submit-button:active {
  background-color: #004085;
}
</style>
