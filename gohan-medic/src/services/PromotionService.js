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
    .in("product_id", productIds) // Filtrer par une liste d'ID produits
    .eq("product.is_promotion", true) // Seuls les produits en promotion
    .eq("promotion.is_valid", true); // Seules les promotions valides

  if (error) {
    console.error("Erreur lors de la récupération des promotions :", error);
    return [];
  }


  if (!data || data.length === 0) {
    console.warn("Aucune promotion trouvée pour les produits spécifiés.");
    return [];
  }

  // Réorganiser les promotions par produit pour un accès rapide
  const promotionsByProduct = data.reduce((acc, entry) => {
    const { product, promotion } = entry;

    if (!promotion || !product) return acc;

    const discountedPrice =
      product.price - (product.price * promotion.percentage) / 100;

    // Ajouter au dictionnaire
    acc[product.id] = {
      id: promotion.id,
      name: product.name,
      originalPrice: product.price,
      discountedPrice: discountedPrice.toFixed(2),
      percentage: promotion.percentage,
      picture: product.picture,
      startDate: promotion.created_at,
      endDate: promotion.end_at,
    };
    return acc;
  }, {});

  return promotionsByProduct;
}

/**
 * Ajouter une nouvelle promotion
 */
export async function addPromotion(promotionData, productId) {
  try {
    // Vérification des dates de la promotion
    const currentDate = new Date();
    const startDate = new Date(promotionData.created_at);
    const endDate = new Date(promotionData.end_at);

    if (startDate <= currentDate || endDate < startDate) {
      throw new Error("Les dates de promotion ne sont pas valides.");
    }

    // Étape 1 : Ajouter une nouvelle promotion
    const { data: promotion, error: promotionError } = await supabase
      .from("promotion")
      .insert([promotionData])
      .select("id")
      .single();

    if (promotionError) {
      throw new Error("Erreur lors de l'ajout de la promotion : " + promotionError.message);
    }

    const promotionId = promotion?.id;

    // Étape 2 : Lier la promotion au produit
    const { error: linkError } = await supabase
      .from("promotion_product")
      .insert([{ promotion_id: promotionId, product_id: productId }]);

    if (linkError) {
      throw new Error("Erreur lors de la liaison produit-promotion : " + linkError.message);
    }

    // Étape 3 : Activer `is_promotion` dans le produit
    const { error: updateError } = await supabase
      .from("product")
      .update({ is_promotion: true })
      .eq("id", productId);

    if (updateError) {
      throw new Error("Erreur lors de la mise à jour du produit : " + updateError.message);
    }

    return promotion;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la promotion :", error);
    throw error;
  }
}

// Récupérer une promotion spécifique par son ID
export async function fetchPromotionById(promotionId) {
  const { data, error } = await supabase
    .from("promotion")
    .select("*, promotion_product(product_id)") // Inclut également les produits liés
    .eq("id", promotionId) // Filtre par l'ID de la promotion
    .single(); // Récupère un seul enregistrement

  if (error) {
    console.error("Erreur lors de la récupération de la promotion :", error);
    return null; // Retourne null en cas d'erreur
  }

  return data; // Retourne les détails de la promotion
}

// Mettre à jour une promotion avec des données modifiées
export async function updatePromotion(promotionId, updatedData) {
  const { error } = await supabase
    .from("promotion")
    .update(updatedData) // Met à jour les champs fournis dans `updatedData`
    .eq("id", promotionId); // Filtre par l'ID de la promotion

  if (error) {
    console.error("Erreur lors de la mise à jour de la promotion :", error);
    throw new Error(error.message); // Lève une erreur en cas de problème
  }
}

// Récupérer toutes les promotions pour la gestion (affichage)
export async function fetchPromotionsForManagement() {
  try {
    const { data, error } = await supabase
      .from("promotion_product")
      .select(`
        promotion:promotion_id (
          id,
          percentage,
          created_at,
          end_at,
          is_valid
        ),
        product:product_id (
          id,
          name
        )
      `); // Sélectionne les promotions et les produits associés

    if (error) {
      console.error("Erreur lors de la récupération des promotions :", error);
      return [];
    }

    // Formate les données pour les rendre plus exploitables
    return data.map(({ promotion, product }) => ({
      promotionId: promotion.id,
      productName: product.name,
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

// Mettre à jour la validité des promotions (désactiver celles expirées)
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
        .update({ is_valid: false }) // Met `is_valid` à false
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
        .update({ is_promotion: false }) // Met `is_promotion` à false
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
    // Étape 1 : Désactiver la promotion
    const { error: promotionError } = await supabase
      .from("promotion")
      .update({ is_valid: false }) // Met `is_valid` à false
      .eq("id", promotionId); // Filtre par l'ID de la promotion

    if (promotionError) {
      throw new Error("Erreur lors de la suppression de la promotion : " + promotionError.message);
    }

    // Étape 2 : Récupérer les produits liés à cette promotion
    const { data: products, error: productError } = await supabase
      .from("promotion_product")
      .select("product_id") // Récupère les IDs des produits
      .eq("promotion_id", promotionId); // Filtre par l'ID de la promotion

    if (productError) {
      throw new Error("Erreur lors de la récupération des produits liés : " + productError.message);
    }

    if (products.length === 0) {
      console.warn("Aucun produit lié à la promotion.");
      return;
    }

    const productIds = products.map((product) => product.product_id);

    // Étape 3 : Désactiver le statut promotionnel des produits
    const { error: updateError } = await supabase
      .from("product")
      .update({ is_promotion: false }) // Met `is_promotion` à false
      .in("id", productIds); // Filtre par les IDs des produits

    if (updateError) {
      throw new Error("Erreur lors de la mise à jour des produits : " + updateError.message);
    }

    console.log("Promotion désactivée et produits mis à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors de la désactivation de la promotion :", error);
    throw error;
  }
}
