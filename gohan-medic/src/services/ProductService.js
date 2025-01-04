import { supabase } from "@/lib/supabaseClient";

export async function fetchProducts(limit = null) {
  let query = supabase.from('product').select('*').eq('is_active', true);
  
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

  export async function fetchProductByIdCategory(categorieId) {
    const { data, error } = await supabase
      .from('product')
      .select('*')
      .eq('category_id', categorieId)
      .eq('is_active', true);
    if (error) throw error;
    return data;
  }

  // Récupérer toutes les catégories
export async function fetchCategories() {
  const { data, error } = await supabase.from("category_product").select("*");
  if (error) {
    console.error("Erreur lors du chargement des catégories :", error);
    return [];
  }
  return data;
}

// Ajouter un produit
export async function addProduct(productData) {
  const { data, error } = await supabase.from("product").insert([productData]);
  if (error) {
    throw new Error("Erreur lors de l'ajout du produit : " + error.message);
  }
  return data;
}

// Modifier un produit existant
export async function updateProduct(productId, updatedData) {
  const { data, error } = await supabase
    .from("product")
    .update(updatedData)
    .eq("id", productId);
  if (error) {
    throw new Error("Erreur lors de la mise à jour du produit : " + error.message);
  }
  return data;
}

// Soft suppression
export async function softDeleteProduct(productId) {
  const { data, error } = await supabase
    .from("product")
    .update({ is_active: false })
    .eq("id", productId);

  if (error) {
    throw new Error("Erreur lors de la suppression du produit : " + error.message);
  }
  return data;
}
