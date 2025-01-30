// Importation du client Supabase configuré
import { supabase } from "@/lib/supabaseClient";

/**
 * Récupérer toutes les promotions avec leurs produits associés
 */
export async function fetchPromotions() {
  try {
    // Requête pour obtenir les promotions valides et leurs produits associés
    const { data, error } = await supabase
      .from("promotion_product")
      .select(`
        product:product_id (
          id,
          name,
          price,
          description,
          picture,
          is_promotion
        ),
        promotion:promotion_id (
          id,
          percentage,
          created_at,
          end_at
        )
      `)        
      .eq("promotion.is_valid", true) // Filtrer uniquement les promotions valides
      .eq("product.is_promotion", true); // Filtrer uniquement les produits ayant une promotion active

    if (error) {
      console.error("Erreur lors de la récupération des promotions :", error);
      return [];
    }

    // Filtrer et transformer les données pour le formatage final
    const formattedData = data
      .filter(({ product, promotion }) => product && promotion) // Supprimer les entrées invalides
      .map(({ product, promotion }) => {
        const discountedPrice =
          product.price - (product.price * promotion.percentage) / 100; // Calcul du prix remisé

        return {
          id: promotion.id, // ID de la promotion
          name: product.name, // Nom du produit
          originalPrice: product.price, // Prix initial du produit
          discountedPrice: discountedPrice.toFixed(2), // Prix après remise
          percentage: promotion.percentage, // Pourcentage de réduction
          picture: product.picture, // URL de l'image du produit
          startDate: promotion.created_at, // Date de début de la promotion
          endDate: promotion.end_at, // Date de fin de la promotion
        };
      });

    console.log("Données formatées pour affichage :", formattedData);
    return formattedData;
  } catch (error) {
    console.error("Erreur critique lors de la récupération des promotions :", error);
    return [];
  }
}

/**
 * Récupérer les promotions associées à une liste d'ID de produits
 */
export async function fetchPromotionsForMultipleProducts(productIds) {
  const { data, error } = await supabase
    .rpc("get_promotions_for_products", { product_ids: productIds });

  if (error) {
    console.error("Erreur lors de la récupération des promotions :", error);
    return [];
  }

  if (!data || data.length === 0) {
    console.warn("Aucune promotion trouvée pour les produits spécifiés.");
    return [];
  }

  // Réorganiser les promotions par produit pour un accès rapide
  const promotionsByProduct = data.reduce((acc, promo) => {
    acc[promo.product_id] = {
      id: promo.product_id,
      name: promo.product_name,
      originalPrice: promo.original_price,
      discountedPrice: promo.discounted_price.toFixed(2),
      percentage: promo.percentage,
      picture: promo.picture,
      startDate: promo.start_date,
      endDate: promo.end_date,
    };
    return acc;
  }, {});

  return promotionsByProduct;
}

// Récupérer une promotion spécifique par son ID avec les détails du produit
export async function fetchPromotionById(promotionId) {
  try {
    // Appel de la procédure stockée get_promotion_by_id
    const { data, error } = await supabase
      .rpc('get_promotion_by_id', { in_promotion_id: promotionId });

    if (error) {
      console.error("Erreur lors de l'appel de la fonction stockée :", error);
      return null;
    }

    if (!data || data.length === 0) {
      console.warn("Aucune promotion trouvée pour l'ID :", promotionId);
      return null;
    }

    const promotionData = data[0]; // On suppose qu'on ne reçoit qu'une seule entrée

    // Retourner les données dans un format propre
    return {
      promotion: {
        id: promotionData.promotion_id,
        percentage: promotionData.percentage,
        start_date: promotionData.start_date, // Format YYYY-MM-DD
        end_date: promotionData.end_date,
      },
      product: {
        id: promotionData.product_id,
        name: promotionData.product_name,
        price: promotionData.product_price,
        description: promotionData.product_description,
      },
    };
  } catch (error) {
    console.error("Erreur critique lors de la récupération de la promotion :", error);
    return null;
  }
}

// Récupérer une promotion par produit ID
export async function fetchPromotionsByProductId(productId) {
  const { data, error } = await supabase
    .from("promotion_product")
    .select(`
      product:product_id (
        id,
        name,
        price,
        description,
        picture,
        is_promotion
      ),
      promotion:promotion_id (
        id,
        percentage,
        created_at,
        end_at,
        is_valid
      )
    `)
    .eq("product_id", productId) // Filtrer par ID produit
    .eq("product.is_promotion", true) // Filtrer les produits en promotion
    .eq("promotion.is_valid", true); // Filtrer les promotions valides

  if (error) {
    console.error("Erreur lors de la récupération de la promotion :", error);
    return null;
  }

  console.log("Données récupérées :", data);

  if (!data || data.length === 0) {
    console.warn("Aucune promotion trouvée pour le produit :", productId);
    return null;
  }

  // Filtrer pour ne garder que les entrées où 'promotion' est non-null
  const validPromotion = data.filter(entry => entry.promotion !== null && entry.promotion.is_valid === true);

  if (validPromotion.length === 0) {
    console.warn("Aucune promotion valide trouvée pour le produit :", productId);
    return null;
  }

  const { promotion, product } = validPromotion[0];

  if (!promotion || !product) {
    console.error("Promotion ou produit manquant :", { product, promotion });
    return null;
  }

  const discountedPrice =
    product.price - (product.price * promotion.percentage) / 100;

  return {
    id: promotion.id,
    name: product.name,
    originalPrice: product.price, // Prix initial du produit
    discountedPrice: discountedPrice.toFixed(2), // Prix remisé
    percentage: promotion.percentage, // Pourcentage de réduction
    picture: product.picture, // Image du produit
    startDate: promotion.created_at, // Date de début de la promotion
    endDate: promotion.end_at, // Date de fin de la promotion
  };
}

// Récupérer toutes les promotions pour la gestion (affichage)
export async function fetchPromotionsForManagement() {
  try {
    const { data, error } = await supabase
      .rpc("get_promotions_for_management"); // ✅ Appel de la procédure stockée

    if (error) {
      console.error("Erreur lors de la récupération des promotions :", error);
      return [];
    }

    // Les données sont déjà bien formatées par la procédure, donc pas besoin de transformation complexe
    return data.map(promotion => ({
      promotionId: promotion.promotion_id,
      productName: promotion.product_name,
      percentage: promotion.percentage,
      createdAt: promotion.created_at,
      endAt: promotion.end_at,
      isValid: promotion.is_valid,
    }));
  } catch (error) {
    console.error("Erreur critique lors de la récupération des promotions :", error);
    return [];
  }
}

// Ajouter une promotion
export async function addPromotion(promotionData, productId) {
  try {
    // Étape 1 : Ajouter une nouvelle promotion avec la procédure stockée
    const { data: promotionId, error: promotionError } = await supabase
      .rpc("add_promotion", {
        p_percentage: promotionData.percentage,
        p_created_at: promotionData.created_at,
        p_end_at: promotionData.end_at,
      });

    if (promotionError) {
      throw new Error("Erreur lors de l'ajout de la promotion : " + promotionError.message);
    }

    // Étape 2 : Lier la promotion au produit
    const { error: linkError } = await supabase.rpc("link_promotion_to_product", {
      p_promotion_id: promotionId,
      p_product_id: productId,
    });

    if (linkError) {
      throw new Error("Erreur lors de la liaison produit-promotion : " + linkError.message);
    }

    // Étape 3 : Activer is_promotion dans le produit
    const { error: updateError } = await supabase.rpc("activate_product_promotion", {
      p_product_id: productId,
    });

    if (updateError) {
      throw new Error("Erreur lors de la mise à jour du produit : " + updateError.message);
    }

    return promotionId;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la promotion :", error);
    throw error;
  }
}

// Mettre à jour une promotion avec des données modifiées
export async function updatePromotion(promotionId, updatedData) {
  try {
    console.log("Données envoyées pour la mise à jour :", updatedData);

    const dataToUpdate = {
      percentage: updatedData.percentage,
      created_at: updatedData.start_date,
      end_at: updatedData.end_date,
    };

    const { error } = await supabase
      .from("promotion")
      .update(dataToUpdate)
      .eq("id", promotionId);

    if (error) {
      console.error("Erreur lors de la mise à jour de la promotion :", error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Erreur critique lors de la mise à jour de la promotion :", error);
    throw error;
  }
}

// Update des validité des promotions
export async function updatePromotionValidity() {
  const currentDate = new Date().toISOString(); // Date actuelle au format ISO

  try {
    // Étape 1 : Récupérer les promotions expirées
    const { data: expiredPromotions, error: expiredError } = await supabase
      .from("promotion")
      .select("id") // Récupère uniquement les IDs des promotions
      .lt("end_at", currentDate) // Filtre les promotions expirées (end_at < currentDate)
      .eq("is_valid", true); // Seules les promotions encore valides

    if (expiredError) {
      console.error("Erreur lors de la récupération des promotions expirées :", expiredError);
      return;
    }

    if (expiredPromotions.length > 0) {
      const expiredPromotionIds = expiredPromotions.map((promo) => promo.id);

      // Étape 2 : Désactiver les promotions expirées
      const { error: updatePromotionError } = await supabase
        .from("promotion")
        .update({ is_valid: false }) // Met is_valid à false
        .in("id", expiredPromotionIds); // Filtre par les IDs des promotions expirées

      if (updatePromotionError) {
        console.error("Erreur lors de la mise à jour des promotions expirées :", updatePromotionError);
      }

      // Étape 3 : Récupérer les produits liés aux promotions expirées
      const { data: promotionProducts, error: productError } = await supabase
        .from("promotion_product")
        .select("product_id") // Récupère les IDs des produits
        .in("promotion_id", expiredPromotionIds); // Filtre par les IDs des promotions expirées

      if (productError) {
        console.error("Erreur lors de la récupération des produits :", productError);
        return;
      }

      const productIds = promotionProducts.map((p) => p.product_id);

      // Étape 4 : Désactiver les promotions pour les produits concernés
      const { error: updateProductError } = await supabase
        .from("product")
        .update({ is_promotion: false }) // Met is_promotion à false
        .in("id", productIds); // Filtre par les IDs des produits concernés

      if (updateProductError) {
        console.error("Erreur lors de la mise à jour des produits :", updateProductError);
      }
    }
  } catch (error) {
    console.error("Erreur critique lors de la mise à jour des validités :", error);
  }
}

// Désactiver une promotion (soft delete)
export async function softDeletePromotion(promotionId) {
  try {
    const { error } = await supabase.rpc("soft_delete_promotion", { _promotion_id: promotionId });

    if (error) {
      throw new Error("Erreur lors de la suppression de la promotion : " + error.message);
    }

    console.log("Promotion désactivée et produits mis à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors de la désactivation de la promotion :", error);
    throw error;
  }
}