import { supabase } from "@/lib/supabaseClient";
import { checkAdresse } from "./AdresseService";

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

    // Récupérer l'adresse de l'utilisateur
    const adresse = await checkAdresse(user.id);

    return { 
      ...user, 
      profile: { 
        ...userData, 
        adresse: adresse || null // Ajoute l'adresse ou `null` si absente
      } 
    };
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

// Met à jour le nom et le prénom de l'utilisateur
export async function updateUserProfile(userId, name, firstName) {
  try {
    
    

    console.log("ID user :", userId);
    console.log("Les données à modifier :", name, firstName);

    // Validation des entrées
    if (!name || !firstName) {
      throw new Error("Les champs 'name' et 'firstName' sont obligatoires.");
    }

    // Mise à jour dans la table users
    const { error: updateError } = await supabase
      .from("users")
      .update({
        name,
        first_name: firstName,
      })
      .eq("id", userId);

    if (updateError) throw new Error(updateError.message);

    console.log("Profil utilisateur mis à jour avec succès.");
    return true; // Retourne true en cas de succès
  } catch (err) {
    console.error("Erreur lors de la mise à jour du profil utilisateur:", err.message);
    return false; // Retourne false en cas d'échec
  }
}

