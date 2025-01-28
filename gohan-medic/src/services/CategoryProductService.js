import { supabase } from "@/lib/supabaseClient";

export async function fetchCategoryProducts() {
  let { data: category_product, error } = await supabase
  .from('category_product')
  .select('*')

    if (error) {
      console.error("Erreur lors de la récupération des categories des produits :", error);
      return [];
    }
  
    return category_product;
  }