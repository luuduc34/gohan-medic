<template>
    <form @submit.prevent="handleLogin"  class="login-form">
      <h2>Connexion</h2>
      <div class="form-group">
        <label for="email">Email :</label>
        <input v-model="email" class="email" type="email" placeholder="Email" required />
      </div>
      <div class="form-group">
        <label for="password">Mot de passe :</label>
        <input v-model="password"  type="password" placeholder="Mot de passe" required />
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
          await UserService.loginWithEmail(this.email, this.password); // connexion avec supabase(DB)
          this.$router.push('/');  // Redirection vers la page de succès
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
  width: 300px;
  margin: 30px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

label {
  margin-bottom: 5px;
  font-size: 14px;
}

input {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  padding: 10px;
  font-size: 16px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  align-self: center;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>