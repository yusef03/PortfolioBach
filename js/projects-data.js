/**
 * ============================================================================
 * DATEI: js/projects-data.js
 * PROJEKT: PortfolioBach (Bachelor Thesis Artifact)
 * AUTOR:   03yusef
 * VERSION: 1.2.0 (Final Data Set)
 *
 * BESCHREIBUNG:
 * Zentrale Datenhaltung für alle Projekt-Exponate.
 * Dient als statische Datenbank (Single Source of Truth) für den
 * Project-Renderer. Enthält Metadaten, Asset-Pfade und i18n-Keys.
 * ============================================================================
 */

/**
 * KONFIGURATION: Highlight-Projekt
 * Definiert, welches Projekt als "Hero"-Section auf der Startseite
 * prominent dargestellt wird.
 */
const HERO_PROJECT_ID = "portfolio-meta";



/**
 * DATENSATZ: Projekt-Portfolio
 * Array aus Projekt-Objekten. Keys wie 'titleKey' oder 'descKey' korrespondieren
 * mit der Datei translations.js für die Mehrsprachigkeit.
 */
const projectsData = [
  {
    id: "phishing-defender",
    titleKey: "PhishingDefender",
    descKey: "pd_desc",
    btnKey: "pd_btn_view",
    codeKey: "pd_btn_code",

    image: "images/projects/phishing/hero.png",

    linkDetails: "projects/phishing-defender.html",
    linkCode: "https://github.com/yusef03/PhishingDefender",
    badges: ["Java 17", "Swing / AWT", "Gson (JSON)", "MVC Pattern"],
    features: ["pd_feat_java", "pd_feat_arch", "pd_feat_features"],
    statusKey: "proj_cv_status",
  },
  {
    id: "html-cv",
    titleKey: "HTML/CSS CV Engine",
    descKey: "proj_cv_desc",
    btnKey: "project_btn",
    codeKey: "project_code",

    image: "images/projects/cv-engine/cv.png",

    linkDetails: "projects/html-cv.html",
    linkCode: "https://github.com/yusef03/Custom-Modern-Html-CV",
    badges: ["HTML5", "CSS3 Print", "Git Privacy", "Glassmorphism"],
    features: ["cv_card_feat_1", "cv_card_feat_2", "cv_card_feat_3"],
    statusKey: "proj_cv_status",
  },

  {
    id: "portfolio-meta",
    titleKey: "NEU: Portfolio System Architecture", // Verweist auf translation
    descKey: "meta_desc", // Verweist auf translation
    btnKey: "meta_btn", // "View Case"
    codeKey: "meta_code", // "View Code" (GitHub)

    image: "images/projects/portfolio-meta/logopf.png",

    linkDetails: "projects/portfolio-meta.html",
    linkCode: "https://github.com/yusef03/PortfolioBach", // Link zum Repo selbst

    // Badges für die Karte im Archiv
    badges: ["Architecture", "Vanilla JS", "DevOps", "Case Study"],
    features: [], // Brauchen wir hier nicht zwingend, da es im Archiv angezeigt wird
    statusKey: "meta_status",
  },
];
