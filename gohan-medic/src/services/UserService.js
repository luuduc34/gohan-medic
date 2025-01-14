import { supabase } from "@/lib/supabaseClient";

// Inscription avec email et mot de passe
export async function registerWithEmail(email, password, nom, prenom) {
  try {
    // Validation des entrées
    if (!email || !password || !nom || !prenom) {
      throw new Error("Tous les champs sont obligatoires.");
    }

    const { data: user, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);

    const { error: updateError } = await supabase.from("users").insert({
      id: user.id,
      email,
      name: nom,
      first_name: prenom,
    });
    if (updateError) throw new Error(updateError.message);

    return user;
  } catch (err) {
    console.error("Erreur lors de l'inscription:", err.message);
    throw err; // Renvoyer l'erreur pour un traitement personnalisé
  }
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
    if (error) throw new Error(error.message);

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();
    if (userError) throw new Error(userError.message);

    return { ...user, profile: userData }; // Fusionne les données utilisateur
  } catch (err) {
    console.error("Erreur lors de la vérification de l'utilisateur:", err.message);
    return null; // Retourne null en cas d'échec
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