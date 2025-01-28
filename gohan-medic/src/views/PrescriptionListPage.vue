<template>
  <div class="prescription-list-page">
    <!-- Titre principal affiché en haut de la page -->
    <h1 class="page-title">Mes Ordonnances</h1>

    <!-- Tableau affichant les ordonnances -->
    <table v-if="prescriptions.length > 0" class="prescription-table">
      <thead>
        <!-- En-tête du tableau avec les colonnes -->
        <tr>
          <th>#</th>
          <!-- Numéro de l'ordonnance -->
          <th>Ordonnance</th>
          <!-- Lien vers l'ordonnance -->
          <th>Statut</th>
          <!-- Statut de l'ordonnance -->
          <th>Raison du rejet</th>
          <!-- Raison du rejet (si applicable) -->
        </tr>
      </thead>
      <tbody>
        <!-- Parcours de la liste des ordonnances -->
        <tr
          v-for="(prescription, index) in prescriptions"
          :key="prescription.prescription_id"
          :class="{ rejected: prescription.status === 'rejetée' }"
        >
          <!-- Index de l'ordonnance -->
          <td>{{ index + 1 }}</td>

          <!-- Lien vers le fichier de l'ordonnance -->
          <td>
            <a :href="prescription.file_url" target="_blank">
              {{ prescription.comment || "Pas de commentaire" }}
            </a>
          </td>

          <!-- Statut de l'ordonnance -->
          <td>
            <strong>{{ prescription.status }}</strong>
          </td>

          <!-- Affichage de la raison du rejet si le statut est "rejetée" -->
          <td>
            <span v-if="prescription.status === 'rejetée'">
              {{ prescription.reason || "Non spécifiée" }}
            </span>
            <span v-else>-</span>
            <!-- Affiche un tiret si pas rejetée -->
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Message affiché si aucune ordonnance n'est disponible -->
    <p v-else>Aucune ordonnance disponible.</p>
  </div>
</template>

<script>
import { supabase } from "@/lib/supabaseClient";

export default {
  name: "PrescriptionListPage", // Nom du composant
  data() {
    return {
      prescriptions: [], // Liste des ordonnances récupérées depuis la base de données
    };
  },
  async created() {
    try {
      // Récupérer l'utilisateur actuellement connecté via Supabase
      const { data: userData, error: userError } = await supabase.auth.getUser();

      // Vérification des erreurs de récupération de l'utilisateur
      if (userError) {
        console.error(
          "Erreur lors de la récupération de l'utilisateur :",
          userError.message
        );
        throw new Error("Impossible de récupérer les informations utilisateur.");
      }

      // Vérifier si un utilisateur est connecté
      if (!userData?.user) {
        throw new Error("Utilisateur non authentifié. Veuillez vous connecter.");
      }

      const userId = userData.user.id; // ID de l'utilisateur connecté
      console.log("ID utilisateur :", userId);

      // Récupérer les ordonnances liées à cet utilisateur depuis la base de données
      const { data, error } = await supabase
        .from("prescription") // Table "prescription" dans la base de données
        .select("*") // Récupérer toutes les colonnes
        .eq("user_id", userId) // Filtrer par l'ID de l'utilisateur
        .order("created_at", { ascending: false }); // Trier par date décroissante

      // Gérer les erreurs lors de la récupération des ordonnances
      if (error) {
        console.error("Erreur lors de la récupération des ordonnances :", error.message);
        throw error;
      }

      // Stocker les données récupérées dans la variable `prescriptions`
      this.prescriptions = data;
      console.log("Ordonnances récupérées :", data);
    } catch (error) {
      console.error("Erreur lors de la récupération des ordonnances :", error.message);
    }
  },
};
</script>

<style scoped>
/* Conteneur principal de la page */
.prescription-list-page {
  max-width: 1000px; /* Largeur maximale de la page */
  margin: 20px auto; /* Espacement vertical et centrage horizontal */
  padding: 20px; /* Espacement interne */
  background-color: #f9fbff; /* Couleur de fond douce */
  border-radius: 10px; /* Coins arrondis */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Ombre douce */
}

/* Titre principal */
.page-title {
  text-align: center; /* Centré horizontalement */
  font-size: 2rem; /* Taille de la police */
  color: #2d9cdb; /* Bleu clair */
  margin-bottom: 20px; /* Espacement sous le titre */
}

/* Tableau des ordonnances */
.prescription-table {
  width: 100%; /* Largeur complète */
  border-collapse: collapse; /* Fusion des bordures */
}

/* Styles des cellules du tableau */
.prescription-table th,
.prescription-table td {
  padding: 10px; /* Espacement interne */
  border: 1px solid #ddd; /* Bordure grise */
  text-align: center; /* Texte centré */
}

/* En-tête du tableau */
.prescription-table th {
  background-color: #f4f4f4; /* Fond clair */
  font-weight: bold; /* Texte en gras */
}

/* Lignes avec statut "rejetée" */
.prescription-table tr.rejected {
  background-color: #fdecea; /* Fond rouge clair */
  color: #e74c3c; /* Texte rouge */
}

/* Alternance de couleurs pour les lignes */
.prescription-table tr:nth-child(even) {
  background-color: #f9f9f9; /* Fond gris clair */
}

/* Liens vers les ordonnances */
.prescription-table a {
  color: #007bff; /* Bleu clair */
  text-decoration: none; /* Suppression du soulignement */
}

.prescription-table a:hover {
  text-decoration: underline; /* Soulignement au survol */
}
</style>
