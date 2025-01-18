import { supabase } from "@/lib/supabaseClient";

export const fetchPrescriptions = async () => {
  try {
    const { data, error } = await supabase.from("prescription").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des ordonnances :", error);
    throw error;
  }
};

export const updatePrescriptionStatus = async (
  prescriptionId,
  status,
  reason = null
) => {
  try {
    const updates = {
      status,
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
