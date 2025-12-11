# Changelog

Hier dokumentiere ich, was sich am Projekt ändert.

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
