<template>
  <div>
    <h1 class="profil-title">Gestion du profil</h1>

    <!-- Conteneur centré -->
    <div class="profile-container">
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
          <div>
            <h2>Adresse :</h2>
            <div>
              <label for="street">Rue :</label>
              <input
                v-model="editedProfile.adresse.street"
                type="text"
                id="street"
                placeholder="Entrez votre rue"
              />
            </div>

            <div>
              <label for="city">Ville :</label>
              <input
                v-model="editedProfile.adresse.city"
                type="text"
                id="city"
                placeholder="Entrez votre ville"
              />
            </div>

            <div>
              <label for="postal_code">Code Postal :</label>
              <input
                v-model="editedProfile.adresse.postal_code"
                type="text"
                id="postal_code"
                placeholder="Entrez votre code postal"
              />
            </div>

            <div>
              <label for="country">Pays :</label>
              <input
                v-model="editedProfile.adresse.country"
                type="text"
                id="country"
                placeholder="Entrez votre pays"
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
  </div>
</template>

<script>
import { useUserStore } from "@/stores/UserStore";
import { updateUserProfile } from "@/services/UserService";
import { upsertAdresse } from "@/services/AdresseService";

export default {
  name: "ProfilPage",
  setup() {
    const userStore = useUserStore();

    // Création de l'objet local pour les modifications
    const editedProfile = {
      name: userStore.user?.profile.name || "",
      first_name: userStore.user?.profile.first_name || "",
      email: userStore.user?.profile.email || "",
      adresse: {
        street: userStore.user?.profile.adresse?.street || "",
        city: userStore.user?.profile.adresse?.city || "",
        postal_code: userStore.user?.profile.adresse?.postal_code || "",
        country: userStore.user?.profile.adresse?.country || "",
      },
    };

    // Appliquer les changements au userStore
    const applyChanges = async () => {
      try {
        let success = true;

        // Mettre à jour le profil utilisateur
        const updatedProfile = await updateUserProfile(
          userStore.user.id,
          editedProfile.name,
          editedProfile.first_name
        );

        if (!updatedProfile) {
          success = false;
          console.error("Échec de la mise à jour du profil.");
        }

        // blablabla
        // Vérifiez si l'adresse a été remplie
        const hasAddress =
          editedProfile.adresse.street ||
          editedProfile.adresse.city ||
          editedProfile.adresse.postal_code ||
          editedProfile.adresse.country;

        if (hasAddress) {
          const updatedAdresse = await upsertAdresse({
            userId: userStore.user.id, // ID de l'utilisateur
            street: editedProfile.adresse.street || "",
            city: editedProfile.adresse.city || "",
            postalCode: editedProfile.adresse.postal_code || "",
            country: editedProfile.adresse.country || "",
          });

          if (!updatedAdresse) {
            success = false;
            console.error("Échec de la mise à jour de l'adresse.");
          }
        }

        // Rafraîchir les données utilisateur
        await userStore.fetchUser();

        if (success) {
          alert("Profil et adresse mis à jour avec succès !");
        } else {
          alert("Une ou plusieurs erreurs se sont produites lors de la mise à jour.");
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        alert("Une erreur critique est survenue lors de la mise à jour.");
      }
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

.profile-container {
  display: flex;
  justify-content: center; /* Centrer horizontalement */
  align-items: center; /* Centrer verticalement */
  padding: 20px;
}

.profile-info {
  margin: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

.profile-info div {
  margin-bottom: 15px;
}

.profile-info label {
  font-weight: bold;
}

.profile-info input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
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
