<template>
  <div class="prescription-upload-page">
    <!-- Titre principal de la page -->
    <h1 class="page-title">Téléverser une Ordonnance</h1>

    <!-- Formulaire de téléversement de l'ordonnance -->
    <form @submit.prevent="uploadPrescription" class="upload-form">
      <!-- Champ pour ajouter un commentaire -->
      <label for="comment">Commentaire</label>
      <textarea
        id="comment"
        v-model="comment"
        placeholder="Ajoutez un commentaire à votre ordonnance (facultatif)"
      ></textarea>

      <!-- Champ pour sélectionner un fichier à téléverser -->
      <label for="file">Fichier de l'ordonnance</label>
      <input
        id="file"
        type="file"
        @change="handleFileChange"
        accept=".pdf,.png,.jpg,.jpeg"
        required
      />

      <!-- Bouton de soumission, désactivé si aucun fichier n'est sélectionné -->
      <button type="submit" :disabled="!selectedFile">Téléverser</button>
    </form>
  </div>
</template>

<script>
import { supabase } from "@/lib/supabaseClient"; // Client Supabase pour les appels à la base de données et au stockage

export default {
  name: "PrescriptionUploadPage",
  data() {
    return {
      selectedFile: null, // Fichier sélectionné par l'utilisateur
      comment: "", // Commentaire facultatif pour accompagner l'ordonnance
    };
  },
  methods: {
    // Gestion du fichier sélectionné dans le champ input
    handleFileChange(event) {
      this.selectedFile = event.target.files[0]; // Récupère le fichier sélectionné
    },

    // Fonction pour téléverser l'ordonnance
    async uploadPrescription() {
      try {
        // Vérifie si un fichier est sélectionné
        if (!this.selectedFile) {
          alert("Veuillez sélectionner un fichier.");
          return;
        }

        // Génère un nom unique pour le fichier en ajoutant un timestamp
        const fileName = `${Date.now()}_${this.selectedFile.name}`;

        // Téléverse le fichier dans le bucket Supabase "prescriptions"
        const { error: uploadError } = await supabase.storage
          .from("prescriptions")
          .upload(fileName, this.selectedFile);

        if (uploadError) throw uploadError; // Gère les erreurs de téléversement

        // Récupère l'URL publique du fichier téléversé
        const { data: publicUrlData, error: urlError } = supabase.storage
          .from("prescriptions")
          .getPublicUrl(fileName);

        if (urlError) throw urlError; // Gère les erreurs d'URL

        // Récupère l'ID de l'utilisateur connecté
        const userId = (await supabase.auth.getUser()).data.user.id;

        // Insère les informations de l'ordonnance dans la table "prescription"
        const { error: insertError } = await supabase.from("prescription").insert({
          user_id: userId, // ID de l'utilisateur
          file_url: publicUrlData.publicUrl, // URL publique du fichier
          status: "en attente", // Statut initial de l'ordonnance
          comment: this.comment, // Commentaire ajouté par l'utilisateur
          created_at: new Date(), // Date de création
        });

        if (insertError) throw insertError; // Gère les erreurs d'insertion

        // Message de succès et redirection vers la liste des ordonnances
        alert("Ordonnance téléversée avec succès !");
        this.$router.push("/ordonnance");

        // Rafraîchit les notifications dans la NavBar (si applicable)
        const navBar = this.$root.$refs.navBar; // Récupère la référence à la NavBar
        if (navBar && navBar.fetchPendingPrescriptions) {
          await navBar.fetchPendingPrescriptions(); // Met à jour les notifications
        }
      } catch (error) {
        // Gère les erreurs globales
        console.error("Erreur globale :", error.message);
        alert("Une erreur est survenue : " + error.message);
      }
    },
  },
};
</script>

<style scoped>
/* Conteneur principal de la page */
.prescription-upload-page {
  max-width: 600px; /* Largeur maximale */
  margin: 20px auto; /* Centré avec marges automatiques */
  padding: 20px; /* Espacement interne */
  background-color: #f9fbff; /* Couleur de fond douce */
  border-radius: 10px; /* Bords arrondis */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Ombre pour le relief */
}

/* Titre principal */
.page-title {
  text-align: center; /* Centré horizontalement */
  font-size: 2rem; /* Taille de police grande */
  color: #2d9cdb; /* Couleur bleue douce */
  margin-bottom: 20px; /* Espacement en bas */
}

/* Style des labels dans le formulaire */
.upload-form label {
  font-weight: bold; /* Texte en gras */
  margin-bottom: 5px; /* Espacement en bas */
  display: block; /* Prend toute la largeur */
}

/* Champs de texte et input */
.upload-form textarea,
.upload-form input {
  width: 100%; /* Largeur complète */
  padding: 10px; /* Espacement interne */
  margin-bottom: 15px; /* Espacement en bas */
  border: 1px solid #ccc; /* Bord gris clair */
  border-radius: 5px; /* Coins arrondis */
}

/* Bouton de soumission */
.upload-form button {
  padding: 10px 20px; /* Espacement interne */
  background-color: #2d9cdb; /* Couleur bleue */
  color: white; /* Texte en blanc */
  border: none; /* Pas de bordure */
  border-radius: 5px; /* Coins arrondis */
  cursor: pointer; /* Curseur en main */
  font-size: 1rem; /* Taille du texte */
}

/* Style pour le bouton désactivé */
.upload-form button:disabled {
  background-color: #ccc; /* Couleur grise */
  cursor: not-allowed; /* Curseur interdit */
}
</style>
