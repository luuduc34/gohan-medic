import { supabase } from "@/lib/supabaseClient";

export const fetchPrescriptions = async () => {
  try {
    const { data, error } = await supabase
      .from("prescription")
      .select("*")
      .order("created_at", { ascending: false }); // Tri par date décroissante

    if (error) {
      console.error("Erreur lors de la récupération des prescriptions :", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erreur globale dans fetchPrescriptions :", error);
    throw error;
  }
};


export async function fetchPendingPrescriptionsCount() {
  try {
    const { count, error } = await supabase
      .from("prescription")
      .select("prescription_id", { count: "exact" })
      .eq("status", "en attente"); // Statut traduit

    console.log("Nombre d'ordonnances en attente :", count);

    if (error) {
      console.error("Erreur lors de la récupération des ordonnances en attente :", error);
      throw error;
    }

    return count;
  } catch (error) {
    console.error("Erreur globale dans fetchPendingPrescriptionsCount :", error);
    throw error;
  }
}

export const updatePrescriptionStatus = async (prescriptionId, status, reason = null) => {
  try {
    const updates = {
      status, // Statut en français
      updated_at: new Date().toISOString(),
    };

    if (reason) {
      updates.reason = reason;
    }

    const { error } = await supabase
      .from("prescription")
      .update(updates)
      .eq("prescription_id", prescriptionId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut :", error);
    throw error;
  }
};
