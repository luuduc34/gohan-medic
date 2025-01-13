export function exportToCSV(data, filename) {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(",")); // Ajouter les en-têtes
  
    for (const row of data) {
      const values = headers.map((header) =>
        JSON.stringify(row[header], (_, value) => value ?? "")
      );
      csvRows.push(values.join(","));
    }
  
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    a.click();
  }
  