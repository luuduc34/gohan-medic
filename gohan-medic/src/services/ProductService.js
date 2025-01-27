import { supabase } from "@/lib/supabaseClient";

// Récupérer tous les produits actifs
export async function fetchProducts(limit = null) {
  let query = supabase.from('product').select('*').eq('is_active', true); // Filtrer uniquement les produits actifs
  
  // Si une limite est spécifiée, l'ajouter à la requête
  if (limit) {
    query = query.limit(limit);
  }

  const { data: product, error } = await query;

  if (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    return []; // Retourner une liste vide en cas d'erreur
  }

  console.log("Produits récupérés :", product); // Afficher les produits récupérés pour debug

  return product; // Retourne les produits actifs
}

// Récupérer un produit par son ID
export async function fetchProductById(productId) {
  const { data, error } = await supabase
    .from('product')
    .select('*')
    .eq('id', productId) // Filtrer par l'ID du produit
    .single(); // Retourner un seul résultat
  if (error) throw error; // Lancer une erreur si la requête échoue
  return data;
}

// Récupérer les produits par catégorie
export async function fetchProductByIdCategory(categorieId) {
  const { data, error } = await supabase
    .from('product')
    .select('*')
    .eq('category_id', categorieId) // Filtrer par catégorie
    .eq('is_active', true); // Filtrer les produits actifs
  if (error) throw error;
  return data;
}

// Récupérer toutes les catégories
// Récupérer toutes les catégories
export async function fetchCategories() {
  const { data, error } = await supabase.from("category_product").select("*");
  if (error) {
    console.error("Erreur lors du chargement des catégories :", error);
    return []; // Retourner une liste vide en cas d'erreur
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
    .update(updatedData) // Mettre à jour les champs spécifiés
    .eq("id", productId); // Filtrer par l'ID du produit
  if (error) {
    throw new Error("Erreur lors de la mise à jour du produit : " + error.message);
  }
  return data;
}

// Suppression "soft" d'un produit (désactivation)
export async function softDeleteProduct(productId) {
  const { data, error } = await supabase
    .from("product")
    .update({ is_active: false }) // Mettre is_active à false
    .eq("id", productId); // Filtrer par l'ID du produit

  if (error) {
    throw new Error("Erreur lors de la suppression du produit : " + error.message);
  }
  return data;
}

// Vérification de la disponibilité du stock pour un panier donné
export async function checkStock(cart) {
  try {
    for (const item of cart) {
      const { data: product, error } = await supabase
        .from('product')
        .select('stock') // Récupérer uniquement le stock du produit
        .eq('id', item.id) // Filtrer par l'ID du produit
        .single();

      if (error) {
        throw new Error(`Erreur lors de la vérification du stock pour le produit ID ${item.id} : ${error.message}`);
      }

      // Vérifier si la quantité demandée dépasse le stock disponible
      if (!product || product.stock < item.quantity) {
        return {
          success: false,
          message: `Le produit "${item.name}" n'est pas en stock ou la quantité demandée dépasse le stock disponible.`,
        };
      }
    }

    // Si tous les articles sont en stock
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

// Mettre à jour le stock d'un produit
export async function updateProductStock(productId, newStock) {
  const { error } = await supabase
    .from("product")
    .update({ stock: newStock }) // Mettre à jour la valeur du stock
    .eq("id", productId); // Filtrer par l'ID du produit
  if (error) {
    throw new Error("Erreur lors de la mise à jour du stock : " + error.message);
  }
}

// Diminuer le stock d'un produit
export async function decrementProductStock(productId, quantityToRemove) {
  try {
    // Récupérer les informations du produit
    const product = await fetchProductById(productId);

    // Vérifier que le produit existe et a un stock suffisant
    if (!product || product.stock < quantityToRemove) {
      throw new Error(`Stock insuffisant pour le produit ID ${productId} ou produit introuvable.`);
    }

    // Calculer le nouveau stock
    const newStock = product.stock - quantityToRemove;

    // Mettre à jour le stock
    await updateProductStock(productId, newStock);

    return {
      success: true,
      message: `Le stock pour le produit ID ${productId} a été mis à jour avec succès.`,
      newStock: newStock, // Nouveau stock après mise à jour
    };
  } catch (err) {
    console.error("Erreur lors de la diminution du stock :", err);
    return {
      success: false,
      message: err.message, // Retourne le message d'erreur
    };
  }
}
