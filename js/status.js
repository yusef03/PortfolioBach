/**
 * ============================================================================
 * DATEI: js/status.js
 * PROJEKT: PortfolioBach
 * AUTOR:   03yusef
 * VERSION: 1.0.0 (Global Config)
 *
 * BESCHREIBUNG:
 * Zentraler Schalter für den Wartungsmodus.
 * Leitet Besucher automatisch um, wenn Wartungsarbeiten stattfinden.
 * ============================================================================
 */

/* =========================================
   MAINTENANCE MODE SWITCH
   ========================================= */

// Hauptschalter: true = Wartung aktiv, false = Seite online
const MAINTENANCE_MODE = false;

(function () {
  // Pfad zur Wartungsseite (relativ zur Root)
  const maintenancePage = "/maintenance.html";

  // Aktueller Pfad
  const currentPath = window.location.pathname;

  // Logik: Wenn Wartung AN ist UND wir nicht schon auf der Wartungsseite sind...
  if (MAINTENANCE_MODE && !currentPath.includes("maintenance.html")) {
    // ... leite sofort um!
    // Für GitHub Pages Projekt-Unterordner ggf. anpassen, aber das sollte gehen:
    if (
      document.location.hostname !== "127.0.0.1" &&
      document.location.hostname !== "localhost"
    ) {
      window.location.replace("https://yusefbach.de/maintenance.html");
    } else {
      // Lokal testen wir oft ohne https://yusefbach.de, daher relative Weiterleitung
      if (!currentPath.includes("maintenance.html"))
        window.location.href = "maintenance.html";
    }
  }
})();
