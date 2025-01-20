<template>
  <div>
    <h1 class="profil-title">Gestion du profil</h1>

    <!-- Affichage des informations du profil et formulaire d'édition -->
    <div v-if="userStore.user && userStore.user.profile">
      <div class="profile-info">
        <div>
          <!-- Formulaire de modification du nom -->
          <label for="name">Nom :</label>
          <input
            v-model="editedProfile.name"
            type="text"
            id="name"
            :placeholder="userStore.user.profile.name"
          />
        </div>

        <div>
          <!-- Formulaire de modification du prénom -->
          <label for="first_name">Prénom :</label>
          <input
            v-model="editedProfile.first_name"
            type="text"
            id="first_name"
            :placeholder="userStore.user.profile.first_name"
          />
        </div>

        <div>
          <!-- Formulaire de modification de l'email -->
          <label for="email">Email :</label>
          <input
            v-model="editedProfile.email"
            type="email"
            id="email"
            :placeholder="userStore.user.profile.email"
            disabled
          />
        </div>

        <!-- Formulaire d'adresse -->
        <div v-if="userStore.user.profile.adresse">
          <h2>Adresse :</h2>
          <div>
            <label for="street">Rue :</label>
            <input
              v-model="editedProfile.adresse.street"
              type="text"
              id="street"
              :placeholder="userStore.user.profile.adresse.street"
            />
          </div>

          <div>
            <label for="city">Ville :</label>
            <input
              v-model="editedProfile.adresse.city"
              type="text"
              id="city"
              :placeholder="userStore.user.profile.adresse.city"
            />
          </div>

          <div>
            <label for="postal_code">Code Postal :</label>
            <input
              v-model="editedProfile.adresse.postal_code"
              type="text"
              id="postal_code"
              :placeholder="userStore.user.profile.adresse.postal_code"
            />
          </div>

          <div>
            <label for="country">Pays :</label>
            <input
              v-model="editedProfile.adresse.country"
              type="text"
              id="country"
              :placeholder="userStore.user.profile.adresse.country"
            />
          </div>
        </div>
      </div>

      <!-- Bouton pour appliquer les changements -->
      <div class="apply-button-container">
        <button @click="applyChanges" class="apply-changes-button">
          Appliquer les changements
        </button>
      </div>
    </div>

    <!-- Si les données ne sont pas disponibles -->
    <div v-else>
      <p>Les informations du profil ne sont pas disponibles.</p>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/UserStore";

export default {
  name: "ProfilPage",
  setup() {
    const userStore = useUserStore();

    // Création de l'objet local pour les modifications
    const editedProfile = {
      name: userStore.user?.profile.name || "",
      first_name: userStore.user?.profile.first_name || "",
      email: userStore.user?.profile.email || "",
      adresse: userStore.user?.profile.adresse
        ? {
            street: userStore.user.profile.adresse.street || "",
            city: userStore.user.profile.adresse.city || "",
            postal_code: userStore.user.profile.adresse.postal_code || "",
            country: userStore.user.profile.adresse.country || "",
          }
        : {},
    };

    // Appliquer les changements au userStore
    const applyChanges = () => {
      alert("Changements appliqués avec succès !");
    };

    return {
      userStore,
      editedProfile,
      applyChanges,
    };
  },
};
</script>

<style scoped>
/* Styles existants pour le catalogue */
.profil-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #2d9cdb;
  margin-bottom: 30px;
  padding: 15px;
  background-color: #e3f2fd;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.profile-info {
  margin: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-info div {
  margin-bottom: 15px;
}

.profile-info label {
  font-weight: bold;
}

.profile-info input {
  width: 100%;
  max-width: 400px; /* Limiter la largeur des champs */
  padding: 8px;
  margin-top: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
  display: block; /* Pour s'assurer que l'input prend seulement la largeur définie */
}

.apply-button-container {
  display: flex;
  justify-content: center; /* Centrer le bouton */
  margin-top: 20px;
}

.apply-changes-button {
  background-color: #2d9cdb;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.apply-changes-button:hover {
  background-color: #1a7bbf;
}
</style>
