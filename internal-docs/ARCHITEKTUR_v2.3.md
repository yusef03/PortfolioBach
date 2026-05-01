# PortfolioBach Architektur Log (v2.5)

Dieses Dokument liegt absichtlich im Ordner `internal-docs/` und ist nur im Source-Code-Repository sichtbar. Es dient als private Entwickler-Dokumentation für zukünftige Entwicklungen.

## Stand der Technik (v2.5.0 — 2026-05-01)

- **TypeScript:** Alle JavaScript Logik liegt in `src/ts/`. Build via `node_modules/.bin/tsc` (kein globaler npm-Befehl nötig, `npm install` einmalig ausführen).
- **Build Step:** TypeScript kompiliert direkt nach `js/`. Kein Webpack, Vite oder Bundler-Overhead.
- **HTML Referenz:** HTML lädt `.js`-Dateien direkt. TypeScript-Quellen sind für den Browser unsichtbar.
- **Performance / Asset Loading:** `loading="lazy"` systemweit für alle Images below the fold.

## i18n System (Internationalisierung)
- JSON Chunking: `lang/de.json` und `lang/en.json` werden per `fetch()` lazy nachgeladen.
- `applyTranslations(lang)` in `script.ts` ist async und setzt nach dem Laden `document.body.classList.add("i18n-ready")`.
- **FOUC Prevention:** `body { visibility: hidden }` in `utilities.css`. Body wird erst nach Übersetzungs-Anwendung sichtbar (`i18n-ready`-Klasse). `maintenance.html` hat ein direktes Inline-Style-Override, da dort kein `script.js` läuft.
- **Fallback:** Im `catch`-Block wird `i18n-ready` trotzdem gesetzt, damit die Seite nie dauerhaft unsichtbar bleibt.

## Mobile Navigation System
- **Selektor-Scope:** `.project-nav .nav-content-wrapper` — IMMER mit `.project-nav`-Präfix. Nie nur `.nav-content-wrapper` global setzen (würde mit Desktop-Reset interferieren).
- **Desktop-Reset:** Die Klasse `.project-nav .nav-content-wrapper` hat außerhalb des Media-Queries einen Force-Reset mit `!important` auf `display: flex`, `visibility: visible`, `position: static`.
- **Mobile Overlay:** `position: fixed`, `width: 100%` (nicht `100vw` — das verursacht horizontalen Scroll), `visibility: hidden` → `.active` setzt `visibility: visible`.
- **JS-Logik:** `projectHamburger` und `projectNavLinks` per ID referenziert. Toggle `.active`-Klasse. Outside-Click via `document.addEventListener("click", ...)` schließt das Menü.

## AI-Twin Architektur
- **Backend:** `api/index.py` (FastAPI + urllib, kein Gemini-SDK). REST-Call direkt an Gemini-Endpoint.
- **Failover:** `gemini-2.5-flash` → `gemini-2.5-flash-lite` → `gemini-2.0-flash` → `gemini-2.0-flash-lite` bei 503/404-Fehlern.
- **Sprache:** `bot.ts` liest `localStorage.getItem("language")` und sendet `{ query, lang }` an Backend. Backend injiziert Sprachanweisung als erste Zeile des System-Prompts.
- **Wissensdatenbank:** `yusef_brain.md` im Root. Enthält Persona, Guardrails, alle Projekte (inkl. StudyNexus), Tech-Stack, Berufserfahrung.
- **Guardrails:** Im System-Prompt — kein Code schreiben, nur Portfolio-Themen, keine Persona-Manipulation.

## Projekt-Daten
- **Quelle der Wahrheit:** `src/ts/projects-data.ts` — HERO_PROJECT_ID bestimmt, welches Projekt hero-featured wird; alle anderen landen im Archiv.
- **Render-Engine:** `src/ts/project-renderer.ts` injiziert dynamisch auf `index.html`.

## Notizen für Maintenance
- **node_modules:** Nach Checkout einmalig `npm install` ausführen. `node_modules/` ist in `.gitignore`.
- **EmailJS Key:** Client-seitig — in EmailJS-Dashboard Domain `yusefbach.de` whitelisten (Missbrauchsschutz).
- **Vercel Deploy:** `api/index.py` wird automatisch als Serverless Function erkannt. `GEMINI_API_KEY` als Environment Variable im Vercel-Dashboard setzen.
- **Neue Subseite:** Wenn eine neue Projektseite angelegt wird: (1) Eintrag in `projects-data.ts`, (2) HTML-Datei in `projects/` nach Vorlage (studynexus.html), (3) i18n-Keys in `lang/de.json` + `lang/en.json`, (4) `tsc` kompilieren.
