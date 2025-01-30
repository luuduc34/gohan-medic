import { supabase } from "@/lib/supabaseClient";

/**
 * Crée une notification pour un utilisateur spécifique.
 * @param {string} userId - L'ID de l'utilisateur qui recevra la notification.
 * @param {string} message - Le message à inclure dans la notification.
 */
export const createNotification = async (userId, message) => {
  try {
    // Insérer une nouvelle notification dans la table "notifications"
    const { error } = await supabase.from("notifications").insert({
      user_id: userId, // Associer la notification à un utilisateur
      message, // Message à afficher dans la notification
      read: false, // Par défaut, la notification est non lue
      created_at: new Date(), // Timestamp de création
    });

    // Gérer les erreurs éventuelles
    if (error) {
      throw error; // Remonter l'erreur pour gestion dans l'appelant
    }
  } catch (error) {
    console.error("Erreur lors de la création de la notification :", error);
    throw error; // Propager l'erreur pour signaler l'échec
  }
};

/**
 * Récupère toutes les notifications non lues pour un utilisateur donné.
 * @param {string} userId - L'ID de l'utilisateur pour lequel récupérer les notifications.
 * @returns {Array} - Liste des notifications non lues.
 */

export const fetchUnreadNotifications = async (userId) => {
  try {
    // Sélectionner les notifications non lues pour un utilisateur
    const { data, error } = await supabase
      .from("notifications")
      .select("*") // Récupérer toutes les colonnes
      .eq("user_id", userId) // Filtrer par l'ID utilisateur
      .eq("read", false) // Filtrer uniquement les notifications non lues
      .order("created_at", { ascending: false }); // Trier par date décroissante

    // Gérer les erreurs éventuelles
    if (error) {
      throw error; // Remonter l'erreur pour gestion dans l'appelant
    }

    // Retourner les données récupérées
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications :", error);
    throw error; // Propager l'erreur pour signaler l'échec
  }
};

/**
 * Marque toutes les notifications d'un utilisateur comme lues.
 * @param {string} userId - L'ID de l'utilisateur dont les notifications seront marquées comme lues.
 */

export const markNotificationsAsRead = async (userId) => {
  try {
    // Mettre à jour le champ "read" pour les notifications de l'utilisateur
    const { error } = await supabase
      .from("notifications")
      .update({ read: true }) // Mettre le statut à "true"
      .eq("user_id", userId); // Filtrer par l'ID utilisateur

    // Gérer les erreurs éventuelles
    if (error) {
      throw error; // Remonter l'erreur pour gestion dans l'appelant
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour des notifications :", error);
    throw error; // Propager l'erreur pour signaler l'échec
  }
};
