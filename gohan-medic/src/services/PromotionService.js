import { supabase } from "@/lib/supabaseClient";

export async function fetchPromotions() {
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
    .filter("product.is_promotion", "eq", true) // Filtrer sur is_promotion à true
    .not("product", "is", null); // Exclure les produits null

  if (error) {
    console.error("Erreur lors de la récupération des promotions :", error);
    return [];
  }

  console.log("Données récupérées :", data);

  // Formater les données
  return data.map(({ product, promotion }) => {
    if (!product || !promotion) {
      console.error("Produit ou promotion manquant :", { product, promotion });
      return null; // Ignore cette entrée si des données manquent
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
  }).filter(Boolean); // Filtrer les entrées nulles
}

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
    .eq("product_id", productId); // Filtrer par ID du produit

  if (error) {
    console.error("Erreur lors de la récupération de la promotion :", error);
    return null;
  }

  if (!data || data.length === 0) {
    console.warn("Aucune promotion trouvée pour le produit :", productId);
    return null;
  }

  const promotion = data[0].promotion;
  const product = data[0].product;

  if (!promotion || !product) {
    console.error("Promotion ou produit manquant :", { product, promotion });
    return null;
  }

  // Calcul du prix remisé
  const discountedPrice =
    product.price - (product.price * promotion.percentage) / 100;

  // Retourner les données combinées avec le prix remisé
  return {
    ...product,
    discountedPrice: discountedPrice.toFixed(2),
    percentage: promotion.percentage,
    createdAt: promotion.created_at,
    endAt: promotion.end_at,
  };
}
