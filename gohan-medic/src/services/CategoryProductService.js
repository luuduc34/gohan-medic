import { supabase } from "@/lib/supabaseClient";

export async function fetchCategoryProducts() {
  try {
    const { data: categoryProducts, error } = await supabase
      .rpc('fetch_category_products');  // Appel de la procédure stockée

    if (error) {
      console.error("Erreur lors de l'appel de la procédure stockée pour les catégories de produits :", error.message);
      return [];
    }

    // Retourne les produits, ou un tableau vide si aucune donnée n'est trouvée
    return categoryProducts || [];
  } catch (err) {
    console.error("Erreur lors de la récupération des produits :", err.message);
    return [];
  }
}
