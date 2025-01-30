import { supabase } from "@/lib/supabaseClient";

// Récupérer tous les produits actifs
export async function fetchProducts(limit = null) {
  try {
    // Appel de la procédure stockée pour récupérer les produits actifs avec une limite éventuelle
    const { data: products, error } = await supabase
      .rpc("fetch_active_products", {
        limit_param: limit
      });

    // Gérer les erreurs
    if (error) {
      console.error("Erreur lors de la récupération des produits :", error);
      return []; // Retourner une liste vide en cas d'erreur
    }

    return products; // Retourner les produits actifs
  } catch (error) {
    console.error("Erreur dans fetchProducts :", error);
    return []; // Retourner une liste vide en cas d'erreur
  }
}

// Récupérer un produit par son ID
export async function fetchProductById(productId) {
  const { data, error } = await supabase
    .rpc('get_product_by_id', { p_product_id: productId }); // Appel de la procédure stockée

  if (error) throw error; // Lancer une erreur si la requête échoue

  return data.length > 0 ? data[0] : null; // Retourner le premier produit ou null si aucun résultat
}

// Récupérer les produits par catégorie
export async function fetchProductByIdCategory(categorieId) {

  const { data, error } = await supabase
    .rpc('get_products_by_category', { p_category_id: categorieId });

  if (error) throw error; // Lancer une erreur si la requête échoue

  return data; // Retourner la liste des produits
}

// Récupérer toutes les catégories
export async function fetchCategories() {
  const { data, error } = await supabase
    .rpc('get_all_categories'); // Appel de la procédure stockée

  if (error) {
    console.error("Erreur lors du chargement des catégories :", error);
    return []; // Retourner une liste vide en cas d'erreur
  }
  return data;
}

// Ajouter un produit
export async function addProduct(productData) {
  const { name, price, description, category_id, picture } = productData;
  
  // Appeler la fonction stockée pour ajouter le produit
  const { data, error } = await supabase
    .rpc('add_product', {
      p_name: name,
      p_price: price,
      p_description: description,
      p_category_id: category_id,
      p_picture: picture
    });

  if (error) {
    throw new Error("Erreur lors de l'ajout du produit : " + error.message);
  }

  // Assurez-vous que les données sont bien renvoyées
  return data; // Renvoie les données du produit ajouté
}

// Modifier un produit existant
export async function updateProduct(productId, updatedData) {
  const { data, error } = await supabase
    .rpc('update_product', {
      p_id: productId,
      p_category_id: updatedData.category_id,
      p_created_at: updatedData.created_at,
      p_description: updatedData.description,
      p_is_active: updatedData.is_active,
      p_is_promotion: updatedData.is_promotion,
      p_name: updatedData.name,
      p_picture: updatedData.picture,
      p_price: updatedData.price,
      p_stock: updatedData.stock
    });

  if (error) {
    throw new Error("Erreur lors de la mise à jour du produit : " + error.message);
  }
  return data;
}

// Suppression "soft" d'un produit (désactivation)
export async function softDeleteProduct(productId) {
  const { data, error } = await supabase
    .rpc('soft_delete_product', { p_id: productId }); // Appel de la procédure stockée avec l'ID du produit

  if (error) {
    throw new Error("Erreur lors de la suppression du produit : " + error.message);
  }
  return data;
}

// Vérification de la disponibilité du stock pour un panier donné
export async function checkStock(cart) {
  try {
    for (const item of cart) {
      // Appeler la procédure stockée pour chaque produit
      const { error } = await supabase
        .rpc('check_product_stock', {
          product_id: item.id, // Assurez-vous que item.id est de type uuid
          required_quantity: item.quantity
        });

      if (error) {
        // Extraire le message d'erreur de la procédure stockée
        throw new Error(error.message); // Le message d'erreur renvoyé par la procédure contient déjà les informations sur le produit
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
      message: error.message, // Affichage du message d'erreur détaillé
    };
  }
}

// Mettre à jour le stock d'un produit
export async function updateProductStock(productId, newStock) {
  const { error } = await supabase.rpc('update_product_stock', {
    product_id: productId, // Assurez-vous que productId est de type UUID
    new_stock: newStock
  });

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