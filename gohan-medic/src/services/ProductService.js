import { supabase } from "@/lib/supabaseClient";

  export async function fetchProducts() {
    const { data: product, error } = await supabase
    .from('product')
    .select('*');
  
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
  
  export async function fetchPromotions() {
    const { data: promotions, error } = await supabase
      .from("product") // Assurez-vous que la table utilisée est correcte
      .select("*")
      .eq("is_promotion", true); // Filtrer les produits en promotion
  
    if (error) {
      console.error("Erreur lors de la récupération des promotions :", error);
      return [];
    }
  
    console.log("Produits en promotion récupérés :", promotions);
    return promotions;
  }