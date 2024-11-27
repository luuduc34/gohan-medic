import { supabase } from "@/lib/supabaseClient";

export async function fetchMedicaments() {
    const { data: medicament, error } = await supabase
    .from('medicament')
    .select('*');
  
    if (error) {
      console.error("Erreur lors de la récupération des médicaments :", error);
      return [];
    }

    console.log("Médicaments récupérés :", medicament); // Log les médicaments récupérés
  
    return medicament;
  }