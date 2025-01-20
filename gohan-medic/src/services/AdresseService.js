import { supabase } from "@/lib/supabaseClient";

// Ajoute une nouvelle adresse pour un utilisateur
export async function insertAdresse({ userId, street, city, postalCode, country }) {
    try {
      const { data, error } = await supabase
        .from("adresses")
        .insert([
          {
            user_id: userId,
            street,
            city,
            postal_code: postalCode,
            country,
          },
        ])
        .select()
        .single(); // Retourne uniquement la ligne insérée
  
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
        .from("adresses")
        .update({
          street,
          city,
          postal_code: postalCode,
          country,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id) // Met à jour l'adresse par son ID
        .eq("user_id", userId) // Vérifie que l'adresse appartient bien à l'utilisateur
        .select()
        .single(); // Retourne uniquement la ligne mise à jour
  
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
        .from("adresses")
        .select("*")
        .eq("user_id", id)
        .eq("is_default", true)
        .single(); // On s'attend à ce qu'une seule adresse soit retournée
  
      if (error) {
        if (error.code === "PGRST116") {
          // Code pour "row not found"
          return null; // Aucun résultat trouvé
        }
        throw new Error(error.message); // Autres erreurs
      }
  
      return adresse; // Retourne l'adresse trouvée
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
