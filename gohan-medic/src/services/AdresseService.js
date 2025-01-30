import { supabase } from "@/lib/supabaseClient";

// Ajoute une nouvelle adresse pour un utilisateur
export async function insertAdresse({ userId, street, city, postalCode, country }) {
    try {
      const { data, error } = await supabase
      .rpc("insert_adresse", {
        _user_id: userId,
        _street: street,
        _city: city,
        _postal_code: postalCode,
        _country: country,
      });
  
      if (error) throw new Error(error.message);
  
      return data; // Retourne les détails de l'adresse insérée
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'adresse:", err.message);
      return null; // Retourne null en cas d'échec
    }
}

// Met à jour l'adresse d'un utilisateur
export async function updateAdresse({ id, userId, street, city, postalCode, country }) {
    try {
      const { data, error } = await supabase
      .rpc("update_adresse", {
        _id: id,
        _user_id: userId,
        _street: street,
        _city: city,
        _postal_code: postalCode,
        _country: country,
      });
  
      if (error) throw new Error(error.message);
  
      return data; // Retourne les détails de l'adresse mise à jour
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'adresse:", err.message);
      return null; // Retourne null en cas d'échec
    }
}

// Récupère l'adresse d'un utilisateur par son ID
export async function checkAdresse(id) {
    try {
      const { data: adresse, error } = await supabase
      .rpc('check_default_adresse', { _user_id: id });
  
      if (error) {
        if (error.code === "PGRST116") {
          // Code pour "row not found"
          return null; // Aucun résultat trouvé
        }
        throw new Error(error.message); // Autres erreurs
      }
  
      return adresse && adresse.length ? adresse[0] : null; // Retourne l'adresse trouvée
    } catch (err) {
      console.error("Erreur lors de la récupération de l'adresse:", err.message);
      return null; // Retourne null en cas d'erreur
    }
}

// Vérifie si l'utilisateur a une adresse par défaut et effectue un update ou un insert
export async function upsertAdresse({ userId, street, city, postalCode, country }) {
  try {
    // Vérifier si l'utilisateur a déjà une adresse par défaut
    const existingAdresse = await checkAdresse(userId);

    if (existingAdresse) {
      // Si une adresse existe, effectuer un update
      const updatedAdresse = await updateAdresse({
        id: existingAdresse.id,
        userId,
        street,
        city,
        postalCode,
        country,
      });

      if (!updatedAdresse) {
        throw new Error("Échec de la mise à jour de l'adresse.");
      }

      return updatedAdresse;
    } else {
      // Si aucune adresse par défaut n'existe, insérer une nouvelle adresse
      const newAdresse = await insertAdresse({
        userId,
        street,
        city,
        postalCode,
        country,
      });

      if (!newAdresse) {
        throw new Error("Échec de l'insertion de l'adresse.");
      }

      return newAdresse;
    }
  } catch (err) {
    console.error("Erreur lors de l'upsert de l'adresse:", err.message);
    return null; // Retourne null en cas d'erreur
  }
}
