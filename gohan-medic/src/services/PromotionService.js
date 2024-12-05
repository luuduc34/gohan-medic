import { supabase } from "@/lib/supabaseClient";

export async function fetchPromotions() {
  const { data, error } = await supabase
  .from('promotion_product')
  .select(`
    product:product_id (
      id,
      name,
      price,
      description,
      picture
    ),
    promotion:promotion_id (
      id,
      percentage,
      created_at,
      end_at
    )
  `);

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
  }).filter(Boolean); // Filtre les entrées nulles
}  