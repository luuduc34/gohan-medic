import { supabase } from "@/lib/supabaseClient";

// Récupérer les promotions avec produits associés
export async function fetchPromotions() {
  try {
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
      .eq("promotion.is_valid", true) // Seules les promotions valides
      .eq("product.is_promotion", true); // Seuls les produits en promotion

    if (error) {
      console.error("Erreur lors de la récupération des promotions :", error);
      return [];
    }

    // Assurez-vous que les données sont correctement formatées et non nulles
    const formattedData = data
      .filter(({ product, promotion }) => product && promotion) // Exclure les entrées invalides
      .map(({ product, promotion }) => {
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
      });

    console.log("Données formatées pour affichage :", formattedData);
    return formattedData;
  } catch (error) {
    console.error("Erreur critique lors de la récupération des promotions :", error);
    return [];
  }
}

// Récupérer une promotion par produit ID
export async function fetchPromotionsByProductId(productId) {
  const { data, error } = await supabase
    .from("promotion_product")
    .select(`
      promotion:promotion_id (
        id,
        percentage,
        created_at,
        end_at
      ),
      product:product_id (
        price,
        picture,
        name,
        description
      )
    `)
    .eq("product_id", productId);

  if (error) {
    console.error("Erreur lors de la récupération de la promotion :", error);
    return null;
  }

  if (!data || data.length === 0) {
    console.warn("Aucune promotion trouvée pour le produit :", productId);
    return null;
  }

  const { promotion, product } = data[0];

  if (!promotion || !product) {
    console.error("Promotion ou produit manquant :", { product, promotion });
    return null;
  }

  const discountedPrice =
    product.price - (product.price * promotion.percentage) / 100;

  return {
    ...product,
    discountedPrice: discountedPrice.toFixed(2),
    percentage: promotion.percentage,
    createdAt: promotion.created_at,
    endAt: promotion.end_at,
  };
}

// Ajouter une promotion
export async function addPromotion(promotionData, productId) {
  try {
    // Vérifier que les dates sont valides
    const currentDate = new Date();
    const startDate = new Date(promotionData.created_at);
    const endDate = new Date(promotionData.end_at);

    if (startDate < currentDate || endDate < startDate) {
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

    // Étape 3 : Mettre à jour `is_promotion` dans le produit
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

// Récupérer une promotion par ID
export async function fetchPromotionById(promotionId) {
  const { data, error } = await supabase
    .from("promotion")
    .select("*, promotion_product(product_id)")
    .eq("id", promotionId)
    .single();

  if (error) {
    console.error("Erreur lors de la récupération de la promotion :", error);
    return null;
  }

  return data;
}

// Modifier une promotion
export async function updatePromotion(promotionId, updatedData) {
  const { error } = await supabase
    .from("promotion")
    .update(updatedData)
    .eq("id", promotionId);

  if (error) {
    console.error("Erreur lors de la mise à jour de la promotion :", error);
    throw new Error(error.message);
  }
}

export async function fetchPromotionsForManagement() {
  try {
    const today = new Date().toISOString();

    const { data, error } = await supabase
      .from("promotion_product")
      .select(`
        promotion:promotion_id (
          id,
          percentage,
          created_at,
          end_at
        ),
        product:product_id (
          id,
          name,
          is_promotion
        )
      `);

    if (error) {
      throw new Error("Erreur lors de la récupération des promotions : " + error.message);
    }

    if (!data || data.length === 0) {
      console.warn("Aucune promotion trouvée.");
      return [];
    }

    // Formatage des données
    return data.map(({ promotion, product }) => {
      if (!promotion || !product) {
        console.warn("Données manquantes pour promotion ou produit :", { promotion, product });
        return null;
      }

      return {
        promotionId: promotion.id,
        productName: product.name,
        percentage: promotion.percentage,
        createdAt: promotion.created_at,
        endAt: promotion.end_at,
        isValid: today <= promotion.end_at,
      };
    }).filter(Boolean); // Filtre les résultats nuls
  } catch (error) {
    console.error("Erreur critique lors de la récupération des promotions :", error);
    return [];
  }
}

// Désactiver une promotion (Soft Delete)
export async function softDeletePromotion(promotionId) {
  const { error } = await supabase
    .from("promotion")
    .update({ is_active: false })
    .eq("id", promotionId);

  if (error) {
    console.error("Erreur lors de la suppression de la promotion :", error);
    throw new Error(error.message);
  }
}

// Update des validité des promotions
export async function updatePromotionValidity() {
  const currentDate = new Date().toISOString();

  try {
    // Récupérer les promotions expirées
    const { data: expiredPromotions, error: expiredError } = await supabase
      .from("promotion")
      .select("id")
      .lt("end_at", currentDate) // end_at < currentDate
      .eq("is_valid", true);

    if (expiredError) {
      console.error("Erreur lors de la récupération des promotions expirées :", expiredError);
      return;
    }

    if (expiredPromotions.length > 0) {
      const expiredPromotionIds = expiredPromotions.map((promo) => promo.id);

      // Mettre à jour `is_valid` dans la table `promotion`
      const { error: updatePromotionError } = await supabase
        .from("promotion")
        .update({ is_valid: false })
        .in("id", expiredPromotionIds);

      if (updatePromotionError) {
        console.error("Erreur lors de la mise à jour des promotions expirées :", updatePromotionError);
      }

      // Mettre à jour `is_promotion` dans la table `product`
      const { data: promotionProducts, error: productError } = await supabase
        .from("promotion_product")
        .select("product_id")
        .in("promotion_id", expiredPromotionIds);

      if (productError) {
        console.error("Erreur lors de la récupération des produits :", productError);
        return;
      }

      const productIds = promotionProducts.map((p) => p.product_id);

      const { error: updateProductError } = await supabase
        .from("product")
        .update({ is_promotion: false })
        .in("id", productIds);

      if (updateProductError) {
        console.error("Erreur lors de la mise à jour des produits :", updateProductError);
      }
    }
  } catch (error) {
    console.error("Erreur critique lors de la mise à jour des validités :", error);
  }
}
