# Changelog

Alle wesentlichen Änderungen am Projekt werden hier dokumentiert.
Format basiert auf [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2.5.0] - 2026-05-01 (The AI & Mobile Reliability Update)

Umfassendes Stabilitäts- und Intelligence-Upgrade. Mobilnavigation vollständig neu implementiert, Bot-Intelligenz erweitert und das Wissenssystem des AI-Twins auf das aktuelle Projekt-Portfolio aktualisiert.

### 🐛 Bug Fixes

- **Mobile Navigation (Critical Fix):** Zwei konkurrierende `@media (max-width: 1100px)`-Blöcke in `main.css` zusammengeführt. Der erste Block setzte `.nav-content-wrapper` ohne `.project-nav`-Präfix global, was zu Selektor-Konflikten und fehlerhaftem Overlay-Verhalten führte. Bereinigt auf ein konsistentes System mit `.project-nav`-Scope.
- **Horizontaler Scroll (Mobile):** `width: 100vw` im Overlay verursachte horizontalen Scroll auf schmalen Viewports. Behoben durch `width: 100%`.
- **Outside-Click Close:** Hamburger-Menü schließt sich jetzt korrekt bei einem Klick außerhalb des Overlays (`document` Event-Listener).

### 🤖 AI-Twin Improvements

- **Sprach-Awareness:** Bot erkennt die aktuelle Seitensprache aus `localStorage` und übermittelt sie mit jeder Anfrage an das Backend.
- **Dynamische Sprachsteuerung (Backend):** `api/index.py` injiziert eine verbindliche Sprachanweisung in den System-Prompt basierend auf dem `lang`-Feld der Request. Antworten kommen zuverlässig auf Deutsch oder Englisch.
- **Lokalisierte UI:** Begrüßungsnachricht, Platzhaltertext, Lade-Feedback und Fallback-Meldungen im Bot-Widget sind jetzt vollständig DE/EN lokalisiert.
- **Guardrails:** Strikte Regeln im System-Prompt verhindern Missbrauch: kein Code schreiben, keine externen Aufgaben, keine Persona-Manipulation, ausschließlich Portfolio-relevante Themen.
- **Wissensdatenbank (`yusef_brain.md`):** Vollständige Aktualisierung auf v2.5.0. StudyNexus mit vollständigen technischen Details (FastAPI, PostgreSQL, ADRs, Security-Architektur) hinzugefügt. HDI-Rolle präzisiert. Aktueller Tech-Stack (Next.js, Docker, Redis, Alembic) ergänzt.

### ✨ New Features

- **StudyNexus Case Study (`projects/studynexus.html`):** Vollständige 7-Chapter-Projektseite für das Flaggschiff-Projekt. Beinhaltet Origin-Story, Tech-Stack Deep-Dive, Security-Flow-Diagramme (JWT/CSRF), Datenbankschema (9 SQLAlchemy-Modelle), Architecture Decision Records (14 ADRs) und Deployment-Architektur.
- **StudyNexus im Archiv:** Projekt in `projects-data.ts` als erstes Archiv-Eintrag registriert (inkl. Badges, Features, Zeitrahmen).
- **Neue Tech-Stack-Icons:** Python, React/Next.js, Docker, PostgreSQL, Claude/LLMs zur Marquee-Laufschrift hinzugefügt.

### 🔧 Infrastructure

- **FOUC-Prevention:** `body { visibility: hidden }` + `i18n-ready`-Klasse verhindert das Aufblitzen von HTML-Fallback-Text vor dem Laden der Übersetzungen. Catch-Block-Safety stellt sicher, dass die Seite bei JS-Fehlern trotzdem sichtbar bleibt.

---

## [2.4.1] - 2026-04-30 (The Product Engineer & StudyNexus Intro)

Inhaltliches und Identitäts-Upgrade. Narrative angepasst an aktuelle Positionierung als Product Engineer und AI Developer.

### ✍️ Content & Rebranding

- **Narrative Shift:** Hero- und About-Sektionen neu geschrieben. Fokus auf Product Engineering, AI Orchestration und Systemarchitektur.
- **Tone of Voice:** Weg von elitärer "Anti-Framework"-Rhetorik hin zu pragmatischer Problemlösung.

---

## [2.4.0] - 2026-04-26 (The TypeScript & Performance Core)

Signifikantes Architektur-Upgrade. Migration auf TypeScript und async i18n JSON Fetching.

### 🧱 Architecture

- **TypeScript Migration:** Komplette Codebasis von `js/` nach `src/ts/` migriert. Strikte Typisierung via Vanilla TypeScript.
- **Interfaces (`types.d.ts`):** Typen für `Project`, `Translations` und alle i18n-Strukturen definiert.
- **Build Step:** `tsc`-Compile-Schritt generiert Plain ES6 JavaScript nach `js/`.

### ⚡ Performance & i18n

- **i18n JSON Chunking:** Monolithische `translations.js` durch dynamisch geladene `lang/de.json` und `lang/en.json` ersetzt.
- **Async Fetch:** Übersetzungen werden per `fetch()` lazy nachgeladen — Ladezeiten um ~40% reduziert.
- **Lazy Loading:** `loading="lazy"` systemweit für alle Images below the fold.

### ♿ Accessibility

- **Keyboard Navigation:** Native `:focus-within`-Ringe in CSS für barrierefreie Tabulator-Steuerung.

---

## [2.3.0] - 2026-04-23 (The AI & RAG Update)

Transformation des statischen Portfolios in eine KI-gestützte Architektur.

### 🧠 Backend & AI

- **RAG Architecture (`api/index.py`):** Vercel Serverless Function Backend mit FastAPI. Liest `yusef_brain.md` als dynamischen System-Kontext.
- **Gemini 2.5 Flash:** Integration der Google Gemini API via direktem REST-Call (kein SDK-Overhead).
- **Failover Pipeline:** 4-stufige Fallback-Kaskade: `gemini-2.5-flash` → `gemini-2.5-flash-lite` → `gemini-2.0-flash` → `gemini-2.0-flash-lite`.
- **CORS & Security:** API Endpoint gesichert, CORS-Policies konfiguriert.

### 💬 Frontend

- **"Ask Yusef" Chat Widget:** Schwebendes Bot-Widget (Vanilla TypeScript, Glassmorphism UI).
- **Graceful Fallback:** Client-seitige Fallback-Nachrichten bei API-Timeout — kein sichtbarer Error.

---

## [2.2.0] - 2025-12-11 (The Meta & Architecture Update)

Portfolio in eine eigene Case Study verwandelt. Rendering-Engine und Archiv implementiert.

### 🚀 New Features

- **Portfolio System Architecture:** Detailseite `projects/portfolio-meta.html` mit Dokumentation der MVC-Engine, DNS-Infrastruktur und Git-Workflows.
- **Dynamic Project Rendering:** JS-basierte Rendering-Engine (`project-renderer.js`). Trennung von Daten (`projects-data.js`) und View.
- **Hero/Archive Logic:** Automatische Hero-Projektzuweisung via Konfigurations-ID.
- **Project Archive:** Dedizierte Seite `projects/archive.html` mit Grid-Layout.
- **Maintenance System:** Globaler Switch (`status.js`) für sofortige Wartungsumleitung.
- **New Case Study:** "HTML/CSS CV Engine" hinzugefügt.

### 🐛 Fixes

- Mobile Navigation: Overlay blockierte Interaktionen — behoben.
- Relative Pfadauflösung für Bilder in Unterordnern.
- CSS Vendor-Prefix Warnungen (`background-clip`) behoben.

---

## [2.1.0] - 2025-12-03 (The Privacy & Polish Update)

Fokus auf Sicherheit, Datenschutz und saubererem Code.

### 🔒 Security & Privacy

- **Kontaktformular:** Formspree → EmailJS (direkte API, keine Weiterleitung).
- **Lebenslauf:** Web-Version mit zensierter Adresse/Telefonnummer (`.gitignore`-Privacy-Ansatz).
- **Datenschutz:** Texte DSGVO-konform aktualisiert.

### 💅 UI

- Header Glassmorphism-Effekt, Gradient-Kontakt-Button, sanfteres Sticky-Scroll-Verhalten.

### 🐛 Fixes

- Inline-JS in Unterseiten ausgelagert.
- Favicon-Caching per `?v=2` behoben.
- Eigene 404-Fehlerseite implementiert.

---

## [2.0.0] - 2025-11-30 (The Portfolio Transformation)

Kompletter Umbau von "Bach IT" Firmenwebseite zu persönlichem Entwickler-Portfolio.

### 🚀 Major Changes

- Neues Dark-Mode Design mit Neon-Akzenten.
- Phishing Defender Case Study als erste Detailseite.
- Cinematic Hero Section (Video-Hintergrund), Documentation Hub, Lightbox-Galerie, UML-Diagramme.

---

## [1.0.0] - 2024 (Legacy)

- Erste Version als Landingpage für fiktive "Bach IT GmbH".
- Grundlegendes HTML/CSS Setup.
