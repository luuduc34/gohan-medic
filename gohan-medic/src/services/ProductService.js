import { supabase } from "@/lib/supabaseClient";

export async function fetchProducts(limit = null) {
  let query = supabase.from('product').select('*');
  
  // Si une limite est spécifiée, on l'applique
  if (limit) {
    query = query.limit(limit);
  }

  const { data: product, error } = await query;
  
  if (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    return [];
  }

  console.log("Produits récupérés :", product); // Log les produits récupérés

  return product;
}  

  export async function fetchProductById(productId) {
    const { data, error } = await supabase
      .from('product')
      .select('*')
      .eq('id', productId)
      .single();
    if (error) throw error;
    return data;
  }