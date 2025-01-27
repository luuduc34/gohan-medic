import { supabase } from "@/lib/supabaseClient";

// Fonction pour récupérer toutes les prescriptions
export const fetchPrescriptions = async () => {
  try {
    // Récupérer toutes les prescriptions triées par date décroissante
    const { data, error } = await supabase
      .from("prescription")
      .select("*") // Récupérer toutes les colonnes
      .order("created_at", { ascending: false }); // Tri décroissant sur la date de création

    // Gérer les erreurs
    if (error) {
      console.error("Erreur lors de la récupération des prescriptions :", error);
      throw error; // Remonter l'erreur pour la gestion dans l'appelant
    }

    // Retourner les données récupérées
    return data;
  } catch (error) {
    console.error("Erreur globale dans fetchPrescriptions :", error); // Gérer les erreurs critiques
    throw error; // Remonter l'erreur pour signaler l'échec
  }
};

// Fonction pour compter les prescriptions avec le statut "en attente"
export async function fetchPendingPrescriptionsCount() {
  try {
    // Récupérer les ordonnances avec le statut "en attente"
    const { data, count, error } = await supabase
      .from("prescription")
      .select("*", { count: "exact" }) // Inclure le comptage précis
      .eq("status", "en attente"); // Filtrer par le statut "en attente"

    console.log("Ordonnances récupérées avec statut 'en attente' :", data); // Afficher les ordonnances récupérées
    console.log("Nombre d'ordonnances comptées :", count); // Afficher le nombre total

    // Gérer les erreurs
    if (error) {
      console.error("Erreur lors de la récupération des ordonnances en attente :", error);
      throw error; // Remonter l'erreur pour la gestion dans l'appelant
    }

    // Retourner le nombre d'ordonnances ou 0 si aucune
    return count || 0;
  } catch (error) {
    console.error("Erreur globale dans fetchPendingPrescriptionsCount :", error); // Gérer les erreurs critiques
    throw error; // Remonter l'erreur pour signaler l'échec
  }
}

// Fonction pour mettre à jour le statut d'une ordonnance
export const updatePrescriptionStatus = async (prescriptionId, status, reason = null) => {
  try {
    // Préparer les données de mise à jour
    const updates = {
      status, // Nouveau statut
      updated_at: new Date().toISOString(), // Date de mise à jour actuelle
    };

    // Ajouter la raison si elle est fournie
    if (reason) {
      updates.reason = reason;
    }

    // Effectuer la mise à jour dans la table "prescription"
    const { error } = await supabase
      .from("prescription")
      .update(updates) // Mettre à jour les champs nécessaires
      .eq("prescription_id", prescriptionId); // Filtrer par l'ID de l'ordonnance

    // Gérer les erreurs
    if (error) {
      throw error; // Remonter l'erreur pour signaler l'échec
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut :", error); // Gérer les erreurs critiques
    throw error; // Remonter l'erreur pour la gestion dans l'appelant
  }
};
