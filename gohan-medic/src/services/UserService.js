import { supabase } from "@/lib/supabaseClient";


// Inscription
export async function registerWithEmail(email, password, nom, prenom) {
  
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
}


// Connexion
export async function loginWithEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
    
      if (error) throw error;
      return data;
}


// Fonction pour vérifier l'état de la connexion de l'utilisateur
export const checkAuthStatus = async () => {
  const { data: user } = await supabase.auth.getUser();
  return user; // Renvoie l'utilisateur s'il est connecté, sinon null
};


// Fonction pour se déconnecter
export const logout = async () => {
  try {
    await supabase.auth.signOut();
    return true; // Signale que la déconnexion a réussi
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error.message);
    return false; // En cas d'erreur
  }
};