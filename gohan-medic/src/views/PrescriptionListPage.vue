<template>
  <div class="prescription-list-page">
    <h1 class="page-title">Mes Ordonnances</h1>
    <ul v-if="prescriptions.length > 0">
      <li v-for="prescription in prescriptions" :key="prescription.id">
        <a :href="prescription.file_url" target="_blank">{{
          prescription.comment || "Ordonnance sans commentaire"
        }}</a>
        <p>Statut : {{ prescription.status }}</p>
      </li>
    </ul>
    <p v-else>Aucune ordonnance disponible.</p>
  </div>
</template>

<script>
import { supabase } from "@/lib/supabaseClient";

export default {
  name: "PrescriptionListPage",
  data() {
    return {
      prescriptions: [], // Liste des ordonnances
    };
  },
  async created() {
    try {
      // Récupérer l'utilisateur via Supabase
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

      const userId = userData.user.id; // ID de l'utilisateur
      console.log("ID utilisateur :", userId);

      // Récupérer les ordonnances liées à cet utilisateur
      const { data, error } = await supabase
        .from("prescription")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Erreur lors de la récupération des ordonnances :", error.message);
        throw error;
      }

      // Stocker les ordonnances dans la liste
      this.prescriptions = data;
      console.log("Ordonnances récupérées :", data);
    } catch (error) {
      console.error("Erreur lors de la récupération des ordonnances :", error.message);
    }
  },
};
</script>

<style scoped>
.prescription-list-page {
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

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 15px;
}
</style>
