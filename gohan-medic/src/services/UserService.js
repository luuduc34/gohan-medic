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

    // Utilisation de la procédure stockée pour l'insertion
    const { error: insertError } = await supabase.rpc('insert_user', {
      user_id: user.id,
      user_email: email,
      user_nom: nom,
      user_prenom: prenom
    });

    if (insertError) throw new Error(insertError.message);

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
      options: {
        redirectTo: window.location.origin, // Redirection vers la page d'origine
      },
    });
    
    if (error) {
      throw new Error("Impossible de se connecter avec Google.");
    }

    // Attendre que l'utilisateur soit redirigé et connecté
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData?.session?.user) {
      throw new Error("Échec de la récupération de l'utilisateur après la connexion avec Google.");
    }

    // Récupération des informations utilisateur
    const user = sessionData.session.user;
    const { email, user_metadata } = user;
    const nom = user_metadata?.full_name?.split(" ")[1] || "Nom inconnu";
    const prenom = user_metadata?.full_name?.split(" ")[0] || "Prénom inconnu";

    // Vérifier si l'utilisateur existe déjà avec la procédure stockée
    const { data: existingUser, error: fetchError } = await supabase.rpc('get_user_by_id', {
      user_id: user.id
    });

    if (fetchError) {
      throw new Error("Erreur lors de la vérification de l'utilisateur.");
    }

    if (!existingUser) {
      // Si l'utilisateur n'existe pas, l'insérer via la procédure stockée
      const { error: insertError } = await supabase.rpc('insert_user', {
        user_id: user.id,
        user_email: email,
        user_nom: nom,
        user_prenom: prenom
      });

      if (insertError) {
        throw new Error("Erreur lors de l'enregistrement de l'utilisateur.");
      }

      console.log("Nouvel utilisateur enregistré avec succès :", { email, nom, prenom });
    } else {
      console.log("Utilisateur déjà existant :", existingUser);
    }

    return { success: true, user };
  } catch (err) {
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

    // Appel à la procédure stockée pour récupérer les infos utilisateur
    const { data: userData, error: userError } = await supabase
      .rpc("get_user_by_id", { user_id: user.id }) // Remplace par le bon nom de procédure
      .single();

    if (userError) throw new Error(userError.message);

    // Récupérer l'adresse de l'utilisateur
    const adresse = await checkAdresse(user.id);

    return { 
      ...user, 
      profile: { 
        ...userData, 
        adresse: adresse || null 
      } 
    };
  } catch (err) {
    console.error("Erreur lors de la vérification de l'utilisateur:", err.message);
    return null;
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

    // Appel de la procédure stockée
    const { error: updateError } = await supabase.rpc("update_user_profile", {
      p_id: userId,
      p_name: name,
      p_first_name: firstName,
    });

    if (updateError) throw new Error(updateError.message);

    console.log("Profil utilisateur mis à jour avec succès.");
    return true;
  } catch (err) {
    console.error("Erreur lors de la mise à jour du profil utilisateur:", err.message);
    return false;
  }
}