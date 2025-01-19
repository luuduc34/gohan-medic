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

        const fileName = `${Date.now()}_${this.selectedFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("prescriptions")
          .upload(fileName, this.selectedFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData, error: urlError } = supabase.storage
          .from("prescriptions")
          .getPublicUrl(fileName);

        if (urlError) throw urlError;

        const userId = (await supabase.auth.getUser()).data.user.id;

        const { error: insertError } = await supabase.from("prescription").insert({
          user_id: userId,
          file_url: publicUrlData.publicUrl,
          status: "en attente",
          comment: this.comment,
          created_at: new Date(),
        });

        if (insertError) throw insertError;

        alert("Ordonnance téléversée avec succès !");
        this.$router.push("/ordonnance");

        // Rafraîchir les notifications dans la NavBar
        const navBar = this.$root.$refs.navBar; // Récupère la NavBar depuis App.vue
        if (navBar && navBar.fetchPendingPrescriptions) {
          await navBar.fetchPendingPrescriptions(); // Met à jour les notifications
        }
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
