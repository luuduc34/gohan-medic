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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Erreur lors de la connexion :", error);
      alert("Erreur : " + error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Erreur inattendue :", err);
    alert("Une erreur inattendue est survenue.");
    return null;
  }
}

// Connexion avec google
export async function loginWithGoogle() {
  try {
    // Lancer le processus de connexion avec Google
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    
    if (error) {
      console.error("Erreur lors de la connexion avec Google :", error.message);
      throw new Error("Impossible de se connecter avec Google.");
    }

    // Attendre que l'utilisateur soit redirigé et connecté
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData?.session?.user) {
      console.error("Erreur lors de la récupération de la session après la connexion :", sessionError?.message);
      throw new Error("Échec de la récupération de l'utilisateur après la connexion avec Google.");
    }

    // Récupération des informations utilisateur
    const user = sessionData.session.user;
    const { email, user_metadata } = user;
    const nom = user_metadata?.full_name?.split(" ")[1] || "Nom inconnu";
    const prenom = user_metadata?.full_name?.split(" ")[0] || "Prénom inconnu";

    console.log("Utilisateur Google connecté :", { email, nom, prenom });

    // Vérifier si l'utilisateur existe déjà dans la table `users`
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 correspond à "Row not found", donc on ignore cette erreur
      console.error("Erreur lors de la vérification de l'utilisateur :", fetchError.message);
      throw new Error("Erreur lors de la vérification de l'utilisateur.");
    }

    if (!existingUser) {
      // Si l'utilisateur n'existe pas, l'insérer dans la table `users`
      const { error: insertError } = await supabase.from("users").insert({
        id: user.id,
        email,
        name: nom,
        first_name: prenom,
      });

      if (insertError) {
        console.error("Erreur lors de l'insertion de l'utilisateur :", insertError.message);
        throw new Error("Erreur lors de l'enregistrement de l'utilisateur.");
      }

      console.log("Nouvel utilisateur enregistré avec succès :", { email, nom, prenom });
    } else {
      console.log("Utilisateur déjà existant :", existingUser);
    }

    return { success: true, user };
  } catch (err) {
    console.error("Erreur lors de la connexion avec Google :", err.message);
    return { success: false, error: err.message };
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
    // Appelle Supabase pour déconnecter l'utilisateur
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erreur lors de la déconnexion :", error.message);
      return { success: false, error: error.message }; // Retourne un objet pour plus de clarté
    }

    return { success: true, error: null }; // Indique une déconnexion réussie
  } catch (err) {
    console.error("Erreur inattendue :", err.message);
    return { success: false, error: "Erreur inattendue lors de la déconnexion." };
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