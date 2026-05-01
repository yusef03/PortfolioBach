# Changelog

Hier dokumentiere ich, was sich am Projekt ändert.

## [2.4.1] - 2026-05-01 (The Product Engineer & StudyNexus Update)

Ein massives Content- und Identitäts-Upgrade. Die Ausrichtung des Portfolios wurde von "Vanilla-Only" auf moderne Systemarchitektur und AI-Driven Engineering aktualisiert. Einführung des Flaggschiff-Projekts StudyNexus.

### 🚀 New Features & Pages

- **StudyNexus Case Study (`studynexus.html`):** Eine hochdetaillierte Projektseite hinzugefügt. Beinhaltet Architektur-Diagramme, Security-Flows (CSRF, JWT), das PostgreSQL-Datenbankschema und Architecture Decision Records (ADRs).
- **Modern Tech Stack Marquee:** Laufschrift um moderne Enterprise- und KI-Tools erweitert (Next.js, Docker, Python, PostgreSQL, LLMs), um den aktuellen Tech-Fokus widerzuspiegeln.

### ✍️ Content & Rebranding

- **Narrative Shift:** Die "Über Mich"- und Hero-Sektionen wurden komplett neu geschrieben. Der Fokus liegt nun auf _Product Engineering, AI Orchestration_ und _Systemarchitektur_ (Passend zur Werkstudentenstelle bei der HDI Group).
- **Tone of Voice:** Verzicht auf elitäre "Anti-Framework"-Rhetorik. Fokus auf pragmatische Problemlösungen, bei denen das Verständnis des Fundaments (wie MVC) genutzt wird, um moderne Frameworks und KI-Agenten effizient zu steuern.

## [2.4.0] - 2026-04-26 (The TS & Performance Core Update)

Ein signifikantes Architektur-Upgrade. Das Framework wurde von purem JavaScript auf TypeScript gehärtet und die Internationalisierung (i18n) wurde auf asynchrone Requests ausgelagert.

### 🧱 Architecture & Typings

- **TypeScript Migration:** Die komplette `js/` Basis wurde nach `src/ts/` umgezogen und streng via Vanilla TypeScript typisiert.
- **Interfaces (`types.d.ts`):** Strikte Typen für Projekte und Übersetzungen sichern die Skalierbarkeit ohne Third-Party-Bloatware.
- **Build Step:** Ein minimaler lokaler Compile-Prozess konvertiert die Dateien in Plain ES6 JavaScript.

### ⚡ Performance & Async UI

- **i18n JSON Chunking:** Die monolithische `translations.js` (60KB) wurde vollständig aufgelöst.
- **Dynamic Fetch:** Übersetzungen (`lang/de.json`, `lang/en.json`) werden per `fetch()` lazy nachgeladen, erst bei Sprachwechsel. Ladezeiten massiv verkürzt.
- **Lazy Loading (Bilder):** Systemweite Implementierung von `loading="lazy"` für alle Images "below the fold".

### ♿ Accessibility (A11y)

- **Keyboard Navigation:** Native `:focus-within` Ringe in CSS implementiert zur barrierefreien Tabulator-Steuerung.

---

## [2.3.0] - 2026-04-23 (The AI & RAG Update)

Dieses Update verwandelt das statische Portfolio in eine KI-gestützte Architektur, inklusive Zero-Dependency Frontend-Bot und Serverless Python-Backend.

### 🧠 Backend & AI Integration

- **RAG Architecture (`api/index.py`):** Neues Vercel Serverless Function Backend implementiert. Liest dynamisch `yusef_brain.md` als System-Kontext.
- **Gemini 1.5 Flash:** Vollständige Migration auf das neue `google-genai` SDK zur performanten Beantwortung von User-Fragen zum Portfolio in Echtzeit.
- **CORS & Security:** API Endpoint sicher isoliert und via CORS-Policies geschützt.

### 💬 Frontend & Design

- **"Ask Yusef" Chat Widget:** Eigenentwickeltes, schwebendes Bot-Widget (Vanilla JS, kein Framework-Overhead).
- **Glassmorphism UI:** Neues CSS-Styling (`backdrop-filter`) für das Chatfenster im Enterprise-Design.
- **Async UX:** "Ghost-Message" Typing-Animation und Error-Handling implementiert für sauberes Nutzerfeedback.

### 📝 Content & Persona Shift

- **HDI Group Positionierung:** Überarbeitung aller Hero- und About-Texte (Fokus auf Clean Architecture, MVC und AI Development).
- **Neues Projekt:** "Community Software" (Lead Developer, Lua, SQL Optimization, High-Traffic Architektur) vollständig in die `projects-data.js` integriert.
- **System-Prompt (`yusef_brain.md`):** Detaillierte Persona-Datenbank für das LLM aufgebaut.

---

## [2.2.0] - 2025-12-11 (The Meta Update)

Dieses Update dokumentiert das System selbst. Wir haben das Portfolio in eine eigene Case Study verwandelt.

### 🚀 New Project

- **Portfolio System Architecture:** Neue Detailseite (`projects/portfolio-meta.html`) hinzugefügt.
  - **Inhalt:** Dokumentation der Custom Rendering Engine (MVC), DNS-Infrastruktur und Git-Workflows.
  - **Interactive Assets:** Implementierung von CSS-basierten Terminal-Fenstern, lebendigen Git-Graphen und Lighthouse-Visualisierungen.
  - **Design:** Neuer "Cyber-Grid" Hero-Bereich mit Scanline-Animationen und Neon-Timeline.

### 🐛 Fixes & Polish

- **Navigation Layout:** Korrektur der Flexbox-Anordnung für den Sprach-Button und Hamburger-Menü (Mobile & Desktop).
- **CSS Compliance:** Behebung von Vendor-Prefix Warnungen (`background-clip`).
- **Translations:** Vollständige DE/EN Unterstützung für die neue Meta-Seite.

### 🚀 New Features (Architecture)

- **Dynamic Project Rendering:** Implementierung einer JS-basierten Rendering-Engine (`project-renderer.js`). Trennung von Daten (`projects-data.js`) und View-Layer.
- **Hero/Archive Logic:** Automatische Zuweisung des Hero-Projekts auf der Startseite basierend auf Konfiguration ID. Alle weiteren Projekte werden automatisch in das Archiv verschoben.
- **Project Archive:** Neue dedizierte Unterseite (`projects/archive.html`) für die Projektübersicht mit Grid-Layout.
- **Maintenance System:** Globaler Switch (`status.js`) zur sofortigen Umleitung auf eine Wartungsseite bei kritischen Updates.

### 📦 Content & Projects

- **New Case Study:** "HTML/CSS CV Engine" hinzugefügt.
  - Integration der Detailseite mit Privacy-First Workflow Beschreibung.
  - Live-Demo und Repository Verlinkung.
- **Translations:** Erweiterung der `translations.js` um CV-Projekt-Daten und Archiv-Navigation (DE/EN).

### ♻️ Refactoring

- **Asset Reorganization:** Umstrukturierung des `images/` Ordners nach Domain-Driven Design (`ui/`, `projects/phishing/`, `projects/cv-engine/`) für bessere Skalierbarkeit.
- **Navigation Redesign:** - Desktop: Symmetrisches Layout mit zentrierten Links.
  - Mobile: Optimierte Header-Controls (Sprache & Hamburger getrennt vom Overlay-Menü) zur Behebung von Z-Index Konflikten.
- **CSS Architecture:** Einführung von Utility-Klassen für Hero-Layouts und Archiv-Cards.

### 🐛 Bug Fixes

- Korrektur der mobilen Navigation (Overlay blockierte Interaktionen).
- Fix der relativen Pfadauflösung für Bilder in Unterordnern (`projects/`).

### 🚀 New Features (Architecture)

- **Dynamic Project Rendering:** Implementierung einer JS-basierten Rendering-Engine (`project-renderer.js`). Trennung von Daten (`projects-data.js`) und View-Layer.
- **Hero/Archive Logic:** Automatische Zuweisung des Hero-Projekts auf der Startseite basierend auf Konfiguration ID. Alle weiteren Projekte werden automatisch in das Archiv verschoben.
- **Project Archive:** Neue dedizierte Unterseite (`projects/archive.html`) für die Projektübersicht mit Grid-Layout.
- **Maintenance System:** Globaler Switch (`status.js`) zur sofortigen Umleitung auf eine Wartungsseite bei kritischen Updates.

### 📦 Content & Projects

- **New Case Study:** "HTML/CSS CV Engine" hinzugefügt.
  - Integration der Detailseite mit Privacy-First Workflow Beschreibung.
  - Live-Demo und Repository Verlinkung.
- **Translations:** Erweiterung der `translations.js` um CV-Projekt-Daten und Archiv-Navigation (DE/EN).

### ♻️ Refactoring

- **Asset Reorganization:** Umstrukturierung des `images/` Ordners nach Domain-Driven Design (`ui/`, `projects/phishing/`, `projects/cv-engine/`) für bessere Skalierbarkeit.
- **Navigation Redesign:** - Desktop: Symmetrisches Layout mit zentrierten Links.
  - Mobile: Optimierte Header-Controls (Sprache & Hamburger getrennt vom Overlay-Menü) zur Behebung von Z-Index Konflikten.
- **CSS Architecture:** Einführung von Utility-Klassen für Hero-Layouts und Archiv-Cards.

### 🐛 Bug Fixes

- Korrektur der mobilen Navigation (Overlay blockierte Interaktionen).
- Fix der relativen Pfadauflösung für Bilder in Unterordnern (`projects/`).

## [2.1.0] - 2025-12-03 (The Privacy & Polish Update)

Wir haben ordentlich unter der Haube aufgeräumt. Der Fokus lag auf Sicherheit, Datenschutz und einem cleaneren Look für die Navigation.

### 🔒 Security & Privacy

- **Kontaktformular:** Formspree komplett rausgeworfen und auf **EmailJS** umgestellt. Läuft jetzt direkt über die API, keine Weiterleitung mehr sichtbar.
- **Lebenslauf:** Die PDF-Datei wurde zensiert ("Web-Version"). Private Anschrift und Handynummer sind raus, um Spam zu vermeiden.
- **Datenschutz:** Texte aktualisiert (EmailJS statt Formspree).
- **Broken Links:** Platzhalter-Bild (`team1.jpg`) durch echtes Profilbild ersetzt.

### 💅 UI & Design

- **Header Upgrade:** Die Navigation hat jetzt einen Glas-Effekt (`backdrop-filter`) und mehr "Luft" (Padding), damit es nicht so gequetscht aussieht.
- **Kontakt-Button:** Neuer Gradient-Look mit Glow-Effekt statt flachem Lila.
- **Sticky Header:** Der Header schrumpft beim Scrollen jetzt sanfter und behält genug Abstand, damit die Links lesbar bleiben.

### 🐛 Fixes & Code Quality

- **Inline-JS entfernt:** Die Skripte aus den Unterseiten (Lightbox-Logik) wurden sauber in die `script.js` ausgelagert. Clean Code!
- **Caching-Problem:** Favicon wird jetzt durch `?v=2` zuverlässig neu geladen.
- **404 Seite:** Endlich eine eigene Fehlerseite ("Seite existiert nicht") statt der GitHub-Standardseite.

---

## [2.0.0] - 2025-11-30 (The Portfolio Update)

### 🚀 Major Transformation

- Kompletter Umbau von einer fiktiven Test-Firmenwebseite ("Bach IT") zu meinem **persönlichen Entwickler-Portfolio**.
- Integration der **"Phishing Defender" Case Study** als Deep-Dive Seite.

### ✨ Added

- **Cinematic Hero Section:** Video-Hintergrund auf der Projektseite.
- **Documentation Hub:** Download-Bereich für PDFs und JAR-Files.
- **Gallery:** Lightbox-Zoom für Screenshots.
- **Architecture:** Einbindung von UML-Diagrammen.

### 🛠 Changed

- **Design System:** Wechsel zu Dark-Mode mit Neon-Akzenten.
- **Struktur:** HTML und CSS modularisiert.

---

## [1.0.0] - 2024 (Legacy)

- Erste Version als Landingpage für fiktive "Bach IT GmbH".
- Grundlegendes HTML/CSS Setup.
