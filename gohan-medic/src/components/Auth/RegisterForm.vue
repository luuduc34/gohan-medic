<template>
    <form @submit.prevent="handleRegister" class="register-form">
      <h2>Inscription</h2>
      <div class="form-group">
        <label for="nom">Nom :</label>
        <input v-model="nom" id="nom" type="text" placeholder="Nom" required />
      </div>
      <div class="form-group">
        <label for="prenom">Prénom :</label>
        <input v-model="prenom" id="prenom" type="text" placeholder="Prénom" required />
      </div>
      <div class="form-group">
        <label for="email">Email :</label>
        <input v-model="email" id="email" type="email" placeholder="Email" required />
      </div>
      <div class="form-group">
        <label for="password">Mot de passe :</label>
        <input v-model="password" id="password" type="password" placeholder="Mot de passe" required />
      </div>
      <button type="submit" class="submit-button">S'inscrire</button>
    </form>
  </template>
  
  <script>
  import UserService from '@/services/UserService';
  
  export default {
    data() {
      return {
        nom: "",
        prenom: "",
        email: "",
        password: "",
      };
    },
    methods: {
      async handleRegister() {
        try {
          await UserService.registerWithEmail(this.email, this.password, this.nom, this.prenom);
          alert("Inscription réussie !");
          this.$router.push('/');
        } catch (error) {
          alert("Erreur : " + error.message);
        }
      },
    },
  };
  </script>

  <style scoped>
.register-form {
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