# Portfolio Architektur & Zukunfts-Roadmap

> Dieses Dokument ist ausschließlich zur internen Strukturierung gedacht und enthält die konkreten nächsten Architektur-Meilensteine für yusefbach.de. Die Roadmap ist iterativ aufgebaut und kann jederzeit erweitert werden.

---

## Phase 1: Security, Performance & UX (Short-Term)
*Der Fokus liegt auf der Härtung des bestehenden Systems und der Optimierung für alle Endgeräte.*

### Milestone 1.1: API Security & Rate Limiting
**Beschreibung:** Absicherung der Vercel Serverless Function (`api/index.py`).
- **Hintergrund:** CORS allein schützt das RAG-Backend nicht vor direktem Script-Abuse (z.B. via cURL).
- **Implementierung:** Implementierung von IP-basiertem Rate Limiting (z.B. max 10 Requests pro Minute pro IP) im Python-Backend.
- **Ziel:** Die Gemini API Quotas und Vercel-Limits effektiv vor böswilligen Bot-Anfragen schützen.

### Milestone 1.2: UX & Native Dark Mode
**Beschreibung:** Einführung eines systemweiten Light/Dark-Mode Schalters.
- **Implementierung:** Nicht via JavaScript-Styles, sondern hocheffizient über CSS-Variablen (`:root` vs `[data-theme="dark"]`).
- **Feature:** Der Zustand wird in der `localStorage` gespeichert, um konsistente UX über alle Unterseiten hinweg zu bieten.
- **Ziel:** 100% Vanilla JS, extrem schnelles und flüssiges Fading per CSS `transition`.

### Milestone 1.3: Mobile Performance & Widget UX
**Beschreibung:** Optimierung der "Glas-Effekte" (Glassmorphism) für Low-End Devices und kleine Screens.
- **Hintergrund:** Das schwebende Bot-Widget und `backdrop-filter` können auf schwachen Smartphones beim Scrollen Ruckler verursachen oder Content verdecken.
- **Implementierung:** Einsatz von CSS `@supports`-Abfragen für Performance-Fallbacks (solide Transparenz statt Blur). JS-Logik zum automatischen Minimieren des Widgets beim Scrollen.
- **Ziel:** Garantierte 60 FPS auf allen Geräten und eine ungestörte Lese-Erfahrung auf Mobile.

### Milestone 1.4: Native ES Modules & Scope Isolation
**Beschreibung:** Umstellung der Frontend-Architektur auf `<script type="module">`.
- **Hintergrund:** Vermeidung von globalem Scope-Clutter (Pollution). Aktuell liegen viele kompilierte TS-Variablen auf dem `window` Objekt.
- **Implementierung:** Native `import` und `export` Syntax direkt im Browser nutzen.
- **Ziel:** Code-Modularität auf Enterprise-Niveau bewahren, ohne einen Bundler (Webpack/Vite) als Abhängigkeit einführen zu müssen.

---

## Phase 2: Progressive Web Features & SEO (Mid-Term)
*Der Fokus liegt auf der Erreichbarkeit und Verfügbarkeit, sowohl für Nutzer (Offline) als auch für Suchmaschinen (Bots).*

### Milestone 2.1: Offline-First (Service Worker Cache)
**Beschreibung:** Verwandlung des Portfolios in eine Progressive Web App (PWA).
- **Hintergrund:** Aktuell bricht das asynchrone i18n (`fetch()`) ab, wenn die Verbindung abreißt (z.B. im Zug).
- **Implementierung:** Ein Service Worker cacht die i18n JSON-Chunks, Bilder und CSS-Dateien direkt im Browser.
- **Ziel:** Die Seite lädt bei wiederholten Besuchen extrem schnell (Cache-First) und funktioniert auch komplett offline (Flugmodus).

### Milestone 2.2: Pre-Rendering Engine (SSG vs. SEO)
**Beschreibung:** Lösung des SEO-Dilemmas bei Client-Side Rendering (CSR).
- **Hintergrund:** Projekte werden via `project-renderer.js` geladen. Googlebot indexiert statisches HTML zuverlässiger als nachträglich per JS injizierte Inhalte.
- **Implementierung:** Entwicklung eines eigenen, extrem leichten Build-Scripts (Node.js), das vor dem Deployment statisches HTML aus der `projects-data.ts` generiert (Static Site Generation).
- **Ziel:** 100% SEO-Kompatibilität, ohne die dynamische Architektur im Browser aufgeben zu müssen.

---

## Phase 3: The Architecture Endgame (Long-Term)
*Der finale Beweis des "Zero Dependency" Konzepts: Eigene Framework-Logik und Fullstack.*

### Milestone 3.1: Das "Eigene Framework" (Reactivity Core)
**Beschreibung:** Ablösung von statischem HTML-Injecting (`innerHTML`) durch reaktives Daten-Bindung.
- **Hintergrund:** Normalerweise nutzen Entwickler dafür React oder Vue. Hier wird dieser "Kern" selbst gebaut.
- **Implementierung:** Einsatz von JavaScript `Proxy` Objekten auf dem State. Wenn z.B. `projectsData[0].title = "Neu"` gesetzt wird, aktualisiert sich automatisch das korrekte DOM-Element (Virtual-DOM Prinzip im Kleinformat).
- **Ziel:** Der ultimative Beweis von tiefgreifendem Architektur-Verständnis im Frontend.

### Milestone 3.2: 100% Headless CMS (Der Endboss)
**Beschreibung:** Absolutes Fullstack-Setup.
- **Hintergrund:** Statt Projekte und Texte in Code-Dateien (TypeScript/JSON) zu pflegen, wird das Portfolio über ein Backend administriert.
- **Implementierung:** Anbindung einer REST API (z.B. Directus, Sanity oder Strapi). Ein externes Dashboard steuert **jedes** Content-Element der Seite.
- **Ziel:** Das Portfolio wird zu einem rein dynamischen Frame, der komplett von außen über ein Admin-Panel kontrolliert wird, ohne dass der Frontend-Code bei neuen Projekten angefasst werden muss.
