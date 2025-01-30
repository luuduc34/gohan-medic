import { supabase } from "@/lib/supabaseClient";
import { useBasketStore } from "@/stores/BasketStore";
import { useUserStore } from "@/stores/UserStore";
import { useUserOrderStore } from "@/stores/UserOrderStore";
import { decrementProductStock } from "./ProductService";

export async function getUserOrders(id_user) {
  try {
    const { data: orders, error } = await supabase
      .rpc("get_user_orders", { _id_user: id_user }); // Appel de la procédure stockée

    if (error) {
      console.error("Erreur lors de l'appel de la procédure stockée pour les commandes :", error.message);
      throw new Error("Impossible de récupérer les commandes.");
    }

    return orders || []; // Retourne les commandes ou un tableau vide
  } catch (err) {
    console.error("Erreur interne :", err.message);
    throw new Error("Une erreur est survenue lors de la récupération des commandes.");
  }
}


export async function getOrderLines(id_order) {
  try {
    const { data: orderLines, error } = await supabase
      .rpc("get_order_lines", { _id_order: id_order }); // Appel de la procédure stockée

    if (error) {
      console.error("Erreur lors de l'appel de la procédure stockée pour les lignes de commande :", error.message);
      throw new Error("Impossible de récupérer les lignes de commande.");
    }

    return orderLines || []; // Retourne les lignes de commande ou un tableau vide
  } catch (err) {
    console.error("Erreur interne :", err.message);
    throw new Error("Une erreur est survenue lors de la récupération des lignes de commande.");
  }
}


export async function insertOrder(id_user, total_price, shipping_costs) {
    try {
      // Insérer une nouvelle commande dans la table `order`
      const { data, error } = await supabase.rpc("insert_order", {
        _id_user: id_user,
        _total_price: Number(total_price),  // S'assurer que c'est bien un nombre
        _shipping_costs: Number(shipping_costs),
      });
  
      if (error) {
        console.error("Erreur lors de l'insertion de la commande :", error);
        throw new Error("Impossible de créer la commande.");
      }
  
      console.log("Commande créée avec succès :", data);
      return data[0]; // Retourne la commande nouvellement créée
    } catch (err) {
      console.error("Erreur interne :", err);
      throw new Error("Une erreur est survenue lors de la création de la commande.");
    }
}

export async function insertOrderLine(orderId, productID, quantity, price) {
  try {
      const { data, error } = await supabase.rpc("insert_order_line", {
          _id_order: orderId,
          _id_product: productID,
          _quantity_ordered: quantity,
          _price: parseFloat(price), // Conversion en float si nécessaire
      });

      if (error) {
          console.error("Erreur lors de l'ajout de l'article :", error);
          throw error;
      }

      return data;
  } catch (err) {
      console.error("Erreur interne :", err);
      throw err;
  }
}

export async function create_order(total_price, shipping_costs) {
    
    const basketStore = useBasketStore();
    const userStore = useUserStore();
    const orderStore = useUserOrderStore();
  
    try {
      // Vérifiez si l'utilisateur est connecté
      if (!userStore.user || !userStore.user.id) {
        throw new Error("Utilisateur non connecté.");
      }
  
      // Récupérer l'ID de l'utilisateur depuis le store
      const id_user = userStore.user.id;
  
      // Créer la commande principale
      const order = await insertOrder(id_user, total_price, shipping_costs);
  
      // Parcourir les articles du panier, insérer chaque ligne et diminuer le stock
      const lignesPromises = basketStore.basketItems.map(async (item) => {
        // Insérer une ligne de commande

        const ligne = await insertOrderLine(order.order_id, item.id, item.quantity, item.price);
  
        // Diminuer le stock après insertion de la ligne
        await decrementProductStock(item.id, item.quantity);
  
        return ligne;
      });
  
      // Attendre que toutes les lignes soient insérées et les stocks diminués
      const lignes = await Promise.all(lignesPromises);

      // Une fois la commande et les lignes créées, vider le panier
      basketStore.clearBasket();
      orderStore.fetchOrders(id_user);
  
      console.log("Commande et lignes ajoutées avec succès !");
      return { order, lignes };
    } catch (err) {
      console.error("Erreur lors de la création de la commande :", err);
      throw new Error("Une erreur est survenue lors de la création de la commande.");
    }
}