# Portfolio Architektur & Zukunfts-Roadmap

> Dieses Dokument ist ausschließlich zur internen Strukturierung gedacht und enthält die konkreten nächsten Architektur-Meilensteine für yusefbach.de.

## Milestone 1: UX & Native Dark Mode (Nächster Task)
**Beschreibung:** Einführung eines systemweiten Light/Dark-Mode Schalters.
- **Implementierung:** Nicht via JavaScript-Styles, sondern hocheffizient über CSS-Variablen (`:root` vs `[data-theme="dark"]`).
- **Feature:** Der Zustand muss in der `localStorage` gespeichert werden, damit der User nicht bei jedem Seitenwechsel "geblendet" wird, wenn er Dark-Mode wählt.
- **Ziel:** 100% Vanilla JS, extrem schnell und flüssiges Fading per CSS `transition`.

## Milestone 2: Das "Eigene Framework" (Reactivity Core)
**Beschreibung:** Ablösung von statischem HTML-Injecting (`innerHTML`) durch reaktives Daten-Bindung.
- **Hintergrund:** Normalerweise nutzen Entwickler dafür React oder Vue. Wir bauen diesen "Kern" selbst!
- **Implementierung:** Einsatz von JavaScript `Proxy` Objekten auf `projectsData`. Wenn ein Skript `projectsData[0].title = "Neu"` aufruft, wird *automatisch* das exakte HTML-Element im DOM aktualisiert, ohne dass die ganze Seite neu geladen wird (Virtual-DOM Prinzip im Kleinformat).
- **Ziel:** Der ultimative Beweis von tiefgreifendem Architektur-Verständnis im Frontend.

## Milestone 3: 100% Headless CMS (Der Endboss)
**Beschreibung:** Absolutes Fullstack-Setup.
- **Hintergrund:** Statt Projekte und Texte in `js/projects-data.ts` oder kleinen JSON-Dateien zu tippen, nutzen wir ein Backend.
- **Implementierung:** Anbindung einer REST API (z.B. Directus, Sanity oder Strapi). Ein externes Dashboard steuert **jedes** kleine Textbaustein-Element und Bild auf der Seite!
- **Ziel:** Das Portfolio wird zu einem reinen dynamischen Frame, der komplett von außen über ein Admin-Panel kontrolliert wird, das den Frontend-Code nicht mehr berührt.
