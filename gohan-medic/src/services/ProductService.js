import { supabase } from "@/lib/supabaseClient";

export async function fetchProducts() {
    const { data: produit, error } = await supabase
    .from('product')
    .select('*');
  
    if (error) {
      console.error("Erreur lors de la récupération des produits :", error);
      return [];
    }

    console.log("Produits récupérés :", produit); // Log les produits récupérés
  
    return produit;
  }  

  export async function fetchProductById(productId) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    if (error) throw error;
    return data;
  }
  