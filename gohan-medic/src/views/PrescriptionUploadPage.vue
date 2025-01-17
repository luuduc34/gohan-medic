<template>
  <div class="prescription-upload-page">
    <h1 class="page-title">Téléverser une Ordonnance</h1>
    <form @submit.prevent="uploadPrescription" class="upload-form">
      <label for="comment">Commentaire</label>
      <textarea
        id="comment"
        v-model="comment"
        placeholder="Ajoutez un commentaire à votre ordonnance (facultatif)"
      ></textarea>

      <label for="file">Fichier de l'ordonnance</label>
      <input
        id="file"
        type="file"
        @change="handleFileChange"
        accept=".pdf,.png,.jpg,.jpeg"
        required
      />

      <button type="submit" :disabled="!selectedFile">Téléverser</button>
    </form>
  </div>
</template>

<script>
import { supabase } from "@/lib/supabaseClient";
import { useUserStore } from "@/stores/UserStore";

export default {
  name: "PrescriptionUploadPage",
  data() {
    return {
      selectedFile: null,
      comment: "",
    };
  },
  methods: {
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    async uploadPrescription() {
      try {
        if (!this.selectedFile) {
          alert("Veuillez sélectionner un fichier.");
          return;
        }

        console.log("Début du téléversement du fichier...");

        const fileName = `${Date.now()}_${this.selectedFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("prescriptions")
          .upload(fileName, this.selectedFile);

        if (uploadError) {
          console.error("Erreur lors du téléversement du fichier :", uploadError.message);
          throw new Error(
            "Erreur lors du téléversement du fichier : " + uploadError.message
          );
        }
        console.log("User ID:", useUserStore.user?.id);

        console.log("Téléversement réussi. Récupération de l'URL publique...");

        const { data: publicUrlData, error: urlError } = supabase.storage
          .from("prescriptions")
          .getPublicUrl(fileName);

        if (urlError) {
          console.error(
            "Erreur lors de la récupération de l'URL publique :",
            urlError.message
          );
          throw new Error(
            "Erreur lors de la récupération de l'URL publique : " + urlError.message
          );
        }

        const publicURL = publicUrlData.publicUrl;

        if (!publicURL) {
          throw new Error(
            "L'URL publique est introuvable. Vérifiez la configuration du bucket."
          );
        }

        console.log("URL publique récupérée :", publicURL);

        // Récupérer l'utilisateur connecté
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError) {
          console.error(
            "Erreur lors de la récupération de l'utilisateur :",
            userError.message
          );
          throw new Error("Impossible de récupérer les informations utilisateur.");
        }

        // Assurez-vous que l'utilisateur est défini
        if (!userData?.user) {
          throw new Error("Utilisateur non authentifié. Connectez-vous pour continuer.");
        }

        const userId = userData.user.id; // Récupère l'ID de l'utilisateur
        console.log("ID utilisateur :", userId);

        // Utiliser `userId` dans l'insertion en base de données
        const { error: insertError } = await supabase.from("prescription").insert({
          user_id: userId, // Utilise l'ID récupéré ici
          file_url: publicURL,
          status: "pending",
          comment: this.comment,
          created_at: new Date(),
        });

        if (insertError) {
          console.error("Erreur lors de l'insertion en base :", insertError.message);
          throw new Error("Erreur lors de l'insertion en base : " + insertError.message);
        }

        alert("Ordonnance téléversée avec succès !");
        this.$router.push("/ordonnance");
      } catch (error) {
        console.error("Erreur globale :", error.message);
        alert("Une erreur est survenue : " + error.message);
      }
    },
  },
};
</script>

<style scoped>
.prescription-upload-page {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9fbff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.page-title {
  text-align: center;
  font-size: 2rem;
  color: #2d9cdb;
  margin-bottom: 20px;
}

.upload-form label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.upload-form textarea,
.upload-form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.upload-form button {
  padding: 10px 20px;
  background-color: #2d9cdb;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.upload-form button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>

<style scoped>
.prescription-upload-page {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9fbff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.page-title {
  text-align: center;
  font-size: 2rem;
  color: #2d9cdb;
  margin-bottom: 20px;
}

.upload-form label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.upload-form textarea,
.upload-form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.upload-form button {
  padding: 10px 20px;
  background-color: #2d9cdb;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.upload-form button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
