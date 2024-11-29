import { supabase } from "@/lib/supabaseClient";

// Inscription avec email et mot de passe
export async function registerWithEmail(email, password, nom, prenom) {
  const { data: user, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error("Erreur d'inscription:", error.message);
    alert("Erreur : " + error.message);
    return;
  }

  // Ajout des informations supplémentaires dans la table 'users'
  const { error: updateError } = await supabase
    .from("users")
    .insert({ id: user.id, email, name: nom, first_name: prenom });

  if (updateError) {
    console.error("Erreur d'insertion dans la table users:", updateError.message);
    throw new Error(updateError.message);
  }

  return user;
}

// Connexion avec email et mot de passe

export async function loginWithEmail(email, password) {
  try {
    console.log("Tentative de connexion avec :", email.trim(), password.trim());
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Erreur lors de la connexion :", error);
      alert("Erreur : " + error.message);
      return null;
    }

    console.log("Connexion réussie :", data);
    return data;
  } catch (err) {
    console.error("Erreur inattendue :", err);
    alert("Une erreur inattendue est survenue.");
    return null;
  }
}

// Retourne l'utilisateur connecté
export async function seeCurrentUser() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Erreur lors de la récupération de la session :", error);
    return null;
  }
  return data?.session?.user || null;
}

// Vérifie si un utilisateur est connecté
export async function checkAuthStatus() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Erreur lors de la vérification de l'utilisateur :", error.message);
      return null;
    }

    // Récupère les informations supplémentaires de l'utilisateur dans la table 'users'
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError) {
      console.error("Erreur lors de la récupération des informations utilisateur:", userError.message);
      return null;
    }

    // On retourne l'utilisateur avec ses informations supplémentaires
    return { ...user, profile: userData };
  } 
  catch (err) {
    console.error("Erreur inattendue :", err.message);
    return null;
  }
}

// Déconnecte l'utilisateur
export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erreur lors de la déconnexion :", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Erreur inattendue :", err.message);
    return false;
  }
}