/**
 * Fonction pour exporter des données au format CSV
 * @param {Array} data - Tableau d'objets contenant les données à exporter
 * @param {string} filename - Nom du fichier CSV à télécharger
 */
export function exportToCSV(data, filename) {
  const csvRows = []; // Initialisation d'un tableau pour stocker les lignes CSV

  // Récupération des clés (en-têtes) du premier objet des données
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(",")); // Ajout des en-têtes en tant que première ligne du CSV

  // Boucle sur chaque élément (ligne) du tableau de données
  for (const row of data) {
    // Map sur les clés (en-têtes) pour récupérer les valeurs associées à chaque clé
    const values = headers.map((header) =>
      // JSON.stringify est utilisé pour gérer les caractères spéciaux ou les chaînes
      JSON.stringify(row[header], (_, value) => value ?? "") // Valeur par défaut : chaîne vide si null/undefined
    );
    csvRows.push(values.join(",")); // Ajout de la ligne formatée au tableau CSV
  }

  // Fusionne toutes les lignes CSV avec un retour à la ligne pour créer le contenu final
  const csvContent = csvRows.join("\n");

  // Création d'un objet Blob contenant les données CSV
  const blob = new Blob([csvContent], { type: "text/csv" });

  // Génération d'une URL temporaire pour le Blob
  const url = URL.createObjectURL(blob);

  // Création d'un élément `<a>` pour déclencher le téléchargement
  const a = document.createElement("a");
  a.setAttribute("href", url); // Ajoute l'URL du Blob comme href
  a.setAttribute("download", filename); // Définit le nom du fichier téléchargé
  a.click(); // Simule un clic pour déclencher le téléchargement
}
