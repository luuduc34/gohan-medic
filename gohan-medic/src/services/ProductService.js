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

// verification si stock commander (panier) est disponible 
export async function checkStock(cart) {
  try {
    // Parcourir chaque article dans le panier pour vérifier le stock
    for (const item of cart) {
      const { data: product, error } = await supabase
        .from('product')
        .select('stock') // Récupérer uniquement le stock du produit
        .eq('id', item.id) // Utiliser l'ID du produit dans le panier
        .single();

      if (error) {
        throw new Error(`Erreur lors de la vérification du stock pour le produit ID ${item.id} : ${error.message}`);
      }

      // Vérifier si le stock est suffisant
      if (!product || product.stock < item.quantity) {
        return {
          success: false,
          message: `Le produit "${item.name}" n'est pas en stock ou la quantité demandée dépasse le stock disponible.`,
        };
      }
    }

    // Tous les articles sont en stock
    return {
      success: true,
      message: "Tous les articles sont disponibles en stock.",
    };
  } catch (error) {
    console.error("Erreur lors de la vérification du stock :", error);
    return {
      success: false,
      message: "Une erreur s'est produite lors de la vérification des stocks.",
    };
  }
}
