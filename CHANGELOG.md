# Changelog

Alle wesentlichen Änderungen am Projekt werden hier dokumentiert.
Format basiert auf [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2.7.0] - 2026-05-11 (The PWA, SEO & Performance Hardening Update)

Umfassendes technisches Hardening-Update. Sicherheitslücken geschlossen, Build-Pipeline modernisiert, Portfolio offline-fähig gemacht und SEO grundlegend verbessert.

### ✨ New Features

- **PWA / Service Worker (`sw.js`):** Portfolio ist jetzt als Progressive Web App installierbar. Ein Service Worker mit Stale-While-Revalidate-Strategie cacht alle statischen Assets (HTML, CSS, JS, Bilder). API-Calls werden bewusst nicht gecacht. Generiert via `npm run build` und liegt im Root-Verzeichnis.
- **`manifest.json`:** PWA-Manifest mit Name, Icons, Themefarbe (`#9d00ff`) und Start-URL. Ermöglicht Installation als App auf Mobilgeräten.
- **Pre-Rendering für SEO (`scripts/prerender.js`):** Node.js-Script das bei jedem `npm run build` die `projectsData` einliest, Hero- und Archiv-HTML generiert und direkt in `index.html` sowie `archive.html` injiziert. Googlebot sieht jetzt statisches HTML statt leerer Container.
- **WebP-Bildoptimierung (`scripts/convert_webp.sh`):** Bash-Script konvertiert alle `.jpg`/`.png` via `ffmpeg` nach `.webp` (Qualität 80). 21 WebP-Dateien generiert. Alle Bilder-Tags in `index.html`, `project-renderer.ts` und Archiv auf `<picture>`-Tag mit WebP-Source und JPEG/PNG-Fallback umgestellt.
- **JSON-LD Structured Data:** `Person`-Schema in `<head>` von `index.html` — Google Rich Results ready.

### 🔒 Security Fixes

- **CORS geschlossen:** `api/index.py` erlaubt nur noch `https://yusefbach.de`, `http://localhost`, `http://127.0.0.1`. Vorher war `allow_origins=["*"]` — jede Website konnte den Gemini-Quota aufbrauchen.
- **Rate Limiting:** `slowapi` integriert (10 Requests/Minute pro IP) auf dem `/api/chat` Endpunkt.
- **Async HTTP:** `urllib.request` (synchron-blockierend) durch `httpx` ersetzt — kein Thread-Blocking mehr im async FastAPI-Context.

### 🔄 Updated

- **StudyNexus als Hero-Projekt:** `HERO_PROJECT_ID` von `portfolio-meta` auf `studynexus` geändert — Flaggschiff-Projekt jetzt prominent auf der Startseite.
- **Build-Script:** `package.json` `"build"` führt jetzt `tsc && prerender.js && mv sw.js` aus — vollständige Pipeline in einem Befehl.
- **Typing-Animation:** Neue Wörter: `"AI Systems Engineer"`, `"Full-Stack Developer"`, `"Enterprise AI Developer"` — passend zum AI-Branding.
- **Semester-Anzeige:** Dynamisch berechnet aus Startdatum `2024-09-01` in `script.ts`. Kein manuelles Update mehr nötig.
- **Contact-Section:** Einheitliche „Du"-Ansprache in `index.html` und `lang/de.json`. Formelles „Sie" vollständig entfernt.
- **Redundante CTA-Section entfernt:** Die doppelte Kontakt-Sektion zwischen About und Contact aus `index.html` gelöscht.
- **`requirements.txt`:** `slowapi` und `httpx` als Dependencies eingetragen.

### 🐛 Bug Fixes

- **Semester-Anzeige Design:** `<div class="stat-number">` zurück zu `<h3>` — vorheriges Refactoring hatte das visuelle Styling der Stats-Box gebrochen.
- **StudyNexus Case Study:** v0.5.0 Update — 2 neue Kapitel (BIN Prüfungsordnung, Admin Panel), 22+ ADRs, 17 Migrationen, 122 Tests, 6-Box Stats-Grid.

### 🔧 Infrastructure

- **Git-Hygiene:** `ANTIGRAVITY.md`, `yusef_brain.md`, `internal-docs/`, `.idea/`, `*.iml` aus Git-Tracking entfernt (`git rm --cached`). Dateien bleiben lokal, sind aber nicht mehr auf GitHub sichtbar.
- **`ANALYSE.md` (internal-docs):** Erledigte Punkte aus Phase 1 und Phase 2 entfernt. Datei spiegelt aktuellen Stand wider.

---

## [2.6.0] - 2026-05-11 (The StudyNexus Deep-Dive Update)


Umfassendes Update der StudyNexus Case Study auf Sprint-5-Stand. Zwei neue Kapitel, aktualisierte Statistiken, neue Sicherheits- und Admin-Visualisierungen. Außerdem: private Analysedokumentation, .gitignore-Bereinigung und CSS-Bugfix.

### ✨ New Features

- **studynexus.html — Chapter V: BIN Prüfungsordnung (NEU):** Vollständige Darstellung der BIN-PO-Integration aus Sprint 4. PDF-Quellen-Visualisierung (3 Dokumente), Prüfungsart-Farbsystem (PX/EA/R/BAA+Ko), §6-Voraussetzungsregeln-Tabelle, MilestoneWidget-Mockup mit Live-Milestone-Chips.
- **studynexus.html — Chapter VII: Admin Panel (NEU):** Sprint-5-Delivery-Callout (2 Tage / 14 Seiten / 35+ Endpunkte / 122 Tests / 0 TS-Fehler), 6 Admin-Feature-Karten, Two-Layer-Auth-Diagram, Test-Coverage-Terminal (alle 12 Testdateien mit Zählern, "122 passed in 2.34s").
- **Navigation:** Neue Anker `#bin-po` und `#admin` in der Projekt-Nav.
- **ADR-Sektion:** 2 neue ADR-Karten (ADR-019 Redis-Session, ADR-021 is_admin im JWT).
- **Security-Kapitel:** Neue Karte "Two-Layer Admin Auth" mit visuellem Layer-1/Layer-2-Diagram.
- **Feature-Kapitel:** 4 neue Feature-Cards (MilestoneWidget, PO-Übersicht, Admin Panel Preview, plus erweiterte Studienplan-Karte).

### 🔄 Updated

- **Hero Badge:** "v0.3.7 — In aktiver Entwicklung" → "Sprint 5 abgeschlossen · v0.5.0"
- **Dev Banner:** Sprint-3.7-Text → Sprint-5-Abschluss-Status mit Testmetriken
- **Stats Grid:** 4 Boxes → 6 Boxes (200+ Files / 17 Migrations / 22+ ADRs / 122 Tests / 37 BIN Module / 5 Docker)
- **ADR-Subtitle:** "14 ADRs" → "22+ ADRs"
- **Migration Timeline:** 9 Einträge → 17 Einträge (Sprint 4: 012–014, Sprint 5: 015–017)
- **Database Subtitle:** "9 Modelle" → "12+ Tabellen. 17 Alembic-Migrationen."
- **Roadmap:** Sprint 4+5 auf ✓ Abgeschlossen gesetzt, Sprint 6 als "In Planung" ergänzt, v1.0 als finales Ziel beibehalten
- **Kapitel-Nummerierung:** Security → VI, Database → VIII, Roadmap → IX
- **lang/de.json + lang/en.json:** Alle neuen i18n-Keys + aktualisierte Roadmap-Keys
- **yusef_brain.md:** StudyNexus-Sektion vollständig auf v0.5.0 aktualisiert (Sprint 4+5, alle neuen Features, 22+ ADRs, 17 Migrations, 122 Tests)

### 🐛 Bug Fixes

- **CSS Syntax Error (components.css:220):** Stray `/` nach `display: inline-block;` entfernt (unclosed comment start).
- **Profil-Bilder:** `hero-profile.jpg` und `about-profile.jpg` sind jetzt zwei unterschiedliche Bilder (vorher ein geteiltes Bild). HTML bereits korrekt referenziert.

### 🔒 Privacy & Infrastructure

- **.gitignore:** `ANTIGRAVITY.md`, `yusef_brain.md`, `internal-docs/`, `.idea/`, `*.iml` zur .gitignore hinzugefügt.
- **internal-docs/ANALYSE.md:** Private Gesamt-Analyse des Portfolios erstellt (13 Abschnitte, niemals auf GitHub).
- **internal-docs/STUDYNEXUS_UPDATE_2026-05-11.md:** Lückenlose Dokumentation dieser Update-Session.

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
