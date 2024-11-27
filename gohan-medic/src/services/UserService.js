import { supabase } from "@/lib/supabaseClient";

// Regrouper les fonctions sous un objet UserService
const UserService = {
  
  // Inscription avec email et mot de passe
  async registerWithEmail(email, password, nom, prenom) {
    // Création de l'utilisateur
    const { data: user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Erreur d'inscription:", error.message);
      alert("Erreur : " + error.message); // Affiche un message d'erreur détaillé
      return;
    }

    // Ajouter le nom et prénom dans la table user
    const { error: updateError } = await supabase
      .from("users")
      .insert({
        email,
        Nom: nom,
        Prenom: prenom,
      });

    if (updateError) {
      console.error("Erreur d'insertion dans la table user:", updateError.message);
      throw new Error(updateError.message);
    }

    return user;
  },

  // Connexion avec email et mot de passe
  async loginWithEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Vérifier l'état de la connexion de l'utilisateur
  async checkAuthStatus() {
    const { data: user } = await supabase.auth.getUser();
    return user; // Renvoie l'utilisateur s'il est connecté, sinon null
  },

  // Déconnexion
  async logout() {
    try {
      await supabase.auth.signOut();
      return true; // Signale que la déconnexion a réussi
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error.message);
      return false; // En cas d'erreur
    }
  }
};

export default UserService;