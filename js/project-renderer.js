/**
 * ============================================================================
 * DATEI: js/project-renderer.js
 * PROJEKT: PortfolioBach (Bachelor Thesis Artifact)
 * AUTOR:   03yusef
 * VERSION: 2.1.0 (Final Release - Mobile Fix)
 *
 * BESCHREIBUNG:
 * Kern-Logik für das dynamische Rendering der Projektinhalte.
 * Verarbeitet die JSON-Daten, trennt Hero- von Archiv-Projekten und
 * handhabt die relative Pfad-Auflösung für Assets in Unterordnern.
 * ============================================================================
 */


/* Initialisierung nach DOM-Load sicherstellen */
document.addEventListener("DOMContentLoaded", () => {
  initProjectRender();
});



/**
 * Hauptfunktion: Steuert den Render-Prozess für Hero- und Grid-Bereiche.
 * Prüft auf Verfügbarkeit der Container und Datenintegrität.
 */
function initProjectRender() {
  const heroContainer = document.getElementById("hero-project-container");
  const archiveContainer = document.getElementById("archive-grid-container");


  // Abbruch, falls Daten-Objekt noch nicht geladen wurde (Race-Condition Schutz)
  if (typeof projectsData === "undefined") return;

// 1. Datensegmentierung: Hero-Projekt vs. Restliche Projekte
  const heroItem = projectsData.find((p) => p.id === HERO_PROJECT_ID);
  const archiveItems = projectsData.filter((p) => p.id !== HERO_PROJECT_ID);

  // 2. Render Index Page (Hero)
  if (heroContainer && heroItem) {
    heroContainer.innerHTML = renderHeroTemplate(heroItem);
  }

  // 3. Render Archive Page (Grid)
  if (archiveContainer) {
    let gridHTML = "";

// KONTEXT-CHECK: Befinden wir uns in einem Unterordner?
    // Wichtig für korrekte Asset-Verlinkung (../ Präfix Logik)
    const isSubFolder = window.location.pathname.includes("/projects/");

    archiveItems.forEach((item) => {
      let adjustedItem = { ...item };

      // Falls im Unterordner, Bildpfade relativ anpassen
      if (
        isSubFolder &&
        !adjustedItem.image.startsWith("http") &&
        !adjustedItem.image.startsWith("../")
      ) {
        adjustedItem.image = "../" + adjustedItem.image;
      }

      gridHTML += renderArchiveTemplate(adjustedItem);
    });

    // Github-Karte als letztes Element statisch hinzufügen
    gridHTML += renderGithubCard();
    archiveContainer.innerHTML = gridHTML;
  }
}

/* ==========================================================================
   TEMPLATES & COMPONENT GENERATORS
   Erzeugt HTML-Strings basierend auf den übergebenen Datenobjekten.
   ========================================================================== */

/**
 * Generiert das HTML für das hervorgehobene Hero-Projekt.
 * @param {Object} p - Das Projekt-Datenobjekt
 */

function renderHeroTemplate(p) {
  const badges = p.badges
    .map((b) => `<span class="tech-badge">${b}</span>`)
    .join("");


  const features = p.features
    ? p.features.map((k) => `<li data-i18n="${k}"></li>`).join("")
    : "";

  return `
    <div class="project-info reveal">
        <div class="hero-project-layout">
            <div class="hero-image-wrapper">
                 <img src="${p.image}" alt="Project Hero" class="hero-project-img" loading="lazy">
            </div>
            <div class="hero-text-wrapper">
                <h3>${p.titleKey}</h3>
                <div class="tech-stack-row">${badges}</div>
                <p class="project-description" data-i18n="${p.descKey}"></p>
                <ul class="project-features">${features}</ul>
                <div class="project-buttons">
                    <a href="${p.linkDetails}" class="cta-button" data-i18n="${p.btnKey}">View</a>
                    <a href="${p.linkCode}" target="_blank" class="cta-button cta-button-outline" data-i18n="${p.codeKey}">Code</a>
                </div>
            </div>
        </div>
    </div>`;
}

/**
 * Generiert das HTML für eine Standard-Projektkarte im Grid.
 * Extrahiert den Dateinamen für relative Verlinkung.
 */

function renderArchiveTemplate(p) {
  const relativeLink = p.linkDetails.split("/").pop(); // Holt "dateiname.html"

  return `
    <div class="archive-card reveal">
        <div class="archive-img-container">
            <img src="${p.image}" alt="Project Preview" loading="lazy">
            <div class="overlay">
                <a href="${relativeLink}" class="view-btn">View Case</a>
            </div>
        </div>
        <div class="card-content">
            <div class="card-header">
                <h4>${p.titleKey}</h4>
                <span class="status-badge" data-i18n="${p.statusKey}"></span>
            </div>
            <p data-i18n="${p.descKey}" class="card-desc"></p>
            <div class="card-tags">
                ${p.badges
                  .slice(0, 3)
                  .map((b) => `<span>${b}</span>`)
                  .join("")}
            </div>
        </div>
    </div>`;
}


/**
 * Statische Komponente für den GitHub-Link am Ende des Grids.
 */

function renderGithubCard() {
  return `
    <div class="archive-card github-card reveal">
        <div class="github-content">
            <div class="github-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="currentColor" width="50" height="50">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.655-3.795-1.275-3.795-1.275-.54-1.38-1.335-1.755-1.335-1.755-1.095-.75.075-.735.075-.735 1.215.09 1.845 1.245 1.845 1.245 1.08 1.86 2.805 1.32 3.495 1.005.105-.78.42-1.32.765-1.62-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.52 1.23-3.42-.12-.3-.54-1.62.12-3.375 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 2.04.135 3 .405 2.28-1.56 3.285-1.23 3.285-1.23.66 1.755.24 3.075.12 3.375.765.9 1.23 2.115 1.23 3.42 0 4.605-2.805 5.61-5.475 5.91.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
            </div>
            <h3>Mehr auf GitHub</h3>
            <p>Schau dir meine aktuellen Repositories, Experimente und Code-Snippets an.</p>
            <a href="https://github.com/yusef03" target="_blank" class="cta-button cta-button-outline">
                Zum Profil &rarr;
            </a>
        </div>
    </div>`;
}
