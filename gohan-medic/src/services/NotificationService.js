import { supabase } from "@/lib/supabaseClient";

// Créer une notification pour un utilisateur
export const createNotification = async (userId, message) => {
  try {
    const { error } = await supabase.from("notifications").insert({
      user_id: userId,
      message,
      read: false,
      created_at: new Date(),
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Erreur lors de la création de la notification :", error);
    throw error;
  }
};

// Récupérer les notifications non lues pour un utilisateur
export const fetchUnreadNotifications = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .eq("read", false)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications :", error);
    throw error;
  }
};

// Marquer les notifications comme lues pour un utilisateur
export const markNotificationsAsRead = async (userId) => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour des notifications :", error);
    throw error;
  }
};
