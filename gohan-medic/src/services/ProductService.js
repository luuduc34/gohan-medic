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
  