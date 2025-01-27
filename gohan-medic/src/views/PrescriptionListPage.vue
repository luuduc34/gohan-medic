<template>
  <div class="prescription-list-page">
    <!-- Titre principal de la page -->
    <h1 class="page-title">Mes Ordonnances</h1>

    <!-- Liste des ordonnances de l'utilisateur -->
    <ul v-if="prescriptions.length > 0">
      <!-- Boucle pour afficher chaque ordonnance -->
      <li v-for="prescription in prescriptions" :key="prescription.id">
        <!-- Lien pour consulter le fichier de l'ordonnance -->
        <a :href="prescription.file_url" target="_blank">
          {{
            prescription.comment || "Ordonnance sans commentaire"
            /* Affiche un commentaire ou un message par défaut si aucun commentaire n'est fourni */
          }}
        </a>
        <!-- Affichage du statut de l'ordonnance -->
        <p>Statut : {{ prescription.status }}</p>
      </li>
    </ul>
    <!-- Message affiché lorsque l'utilisateur n'a aucune ordonnance -->
    <p v-else>Aucune ordonnance disponible.</p>
  </div>
</template>

<script>
import { supabase } from "@/lib/supabaseClient";

export default {
  name: "PrescriptionListPage", // Nom du composant
  data() {
    return {
      prescriptions: [], // Liste des ordonnances récupérées
    };
  },
  async created() {
    try {
      // Récupérer les informations de l'utilisateur via Supabase
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error(
          "Erreur lors de la récupération de l'utilisateur :",
          userError.message
        );
        throw new Error("Impossible de récupérer les informations utilisateur.");
      }

      if (!userData?.user) {
        throw new Error("Utilisateur non authentifié. Veuillez vous connecter.");
      }

      const userId = userData.user.id; // Récupération de l'ID de l'utilisateur connecté
      console.log("ID utilisateur :", userId);

      // Récupération des ordonnances associées à l'utilisateur
      const { data, error } = await supabase
        .from("prescription") // Nom de la table dans la base de données
        .select("*") // Sélection de toutes les colonnes
        .eq("user_id", userId) // Filtrer par l'ID de l'utilisateur
        .order("created_at", { ascending: false }); // Trier par date décroissante

      if (error) {
        console.error("Erreur lors de la récupération des ordonnances :", error.message);
        throw error;
      }

      // Stocker les ordonnances récupérées dans la variable `prescriptions`
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
  max-width: 600px; /* Largeur maximale de la page */
  margin: 20px auto; /* Centrer la page */
  padding: 20px; /* Espacement interne */
  background-color: #f9fbff; /* Couleur de fond */
  border-radius: 10px; /* Coins arrondis */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Ombre légère */
}

/* Style du titre de la page */
.page-title {
  text-align: center; /* Centrer le texte */
  font-size: 2rem; /* Taille de la police */
  color: #2d9cdb; /* Couleur bleue */
  margin-bottom: 20px; /* Espacement en bas */
}

/* Liste des ordonnances */
ul {
  list-style: none; /* Suppression des puces de la liste */
  padding: 0; /* Suppression des marges internes */
}

/* Style des éléments de la liste */
li {
  margin-bottom: 15px; /* Espacement entre chaque élément */
}
</style>
