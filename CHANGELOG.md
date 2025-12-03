# Changelog

Hier dokumentiere ich, was sich am Projekt ändert.

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
