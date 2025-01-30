import { supabase } from "@/lib/supabaseClient";

// Fonction pour récupérer toutes les prescriptions
export const fetchPrescriptions = async () => {
  try {
    // Récupérer toutes les prescriptions triées par date décroissante
    const { data, error } = await supabase.rpc("get_prescriptions");

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
    // Appel de la procédure stockée
    const { data, error } = await supabase.rpc("count_pending_prescriptions");

    // Gérer les erreurs
    if (error) {
      console.error("Erreur lors de la récupération du nombre d'ordonnances en attente :", error);
      throw error;
    }

    console.log("Nombre d'ordonnances en attente :", data); // Afficher le résultat

    return data || 0; // Retourner le nombre d'ordonnances ou 0 si aucune
  } catch (error) {
    console.error("Erreur globale dans fetchPendingPrescriptionsCount :", error);
    throw error;
  }
}

// Fonction pour mettre à jour le statut d'une ordonnance
export const updatePrescriptionStatus = async (prescriptionId, status, reason = null) => {
  try {
    // Appel de la procédure stockée pour mettre à jour le statut
    const { error } = await supabase
      .rpc("update_prescription_status", {
        _prescription_id: prescriptionId,
        _new_status: status,
        _new_reason: reason,  // facultatif
      });

    // Gérer les erreurs
    if (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
      throw error; // Remonter l'erreur pour signaler l'échec
    }
  } catch (error) {
    console.error("Erreur dans updatePrescriptionStatus :", error);
    throw error;
  }
};
