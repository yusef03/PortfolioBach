# Yusef Bach — Portfolio

Live: [yusefbach.de](https://yusefbach.de)

---

### 🚀 Latest: v2.7.0 — PWA, SEO & Performance Update

- **Service Worker (PWA):** Portfolio ist jetzt offline-fähig. Stale-While-Revalidate-Caching-Strategie lädt Assets blitzschnell aus dem Cache und updatet sie im Hintergrund. Als App installierbar via `manifest.json`.
- **Pre-Rendering für SEO:** Ein Build-Script generiert statisches HTML aus dem Projekt-Datenmodell und injiziert es direkt in `index.html` und `archive.html`. Google indexiert jetzt alle Projekte zuverlässig.
- **WebP-Bildoptimierung:** Alle 21 Assets konvertiert. `<picture>`-Tags mit WebP-Source und JPEG/PNG-Fallback für maximale Browser-Kompatibilität.
- **StudyNexus als Hero-Projekt:** Flaggschiff-Projekt jetzt prominent auf der Startseite als Hero-Projekt.
- **Sicherheit (API):** CORS auf `yusefbach.de` eingeschränkt. Rate-Limiting via `slowapi` (10 Req/Min). Async `httpx` statt synchronem `urllib`.
- **Content:** Einheitliche „Du"-Ansprache in der Contact-Section. Dynamische Semester-Berechnung. Typing-Animation an AI-Branding angepasst.
- **SEO:** JSON-LD Person-Schema in `index.html`.

[📜 Kompletten Changelog ansehen](./CHANGELOG.md)

---

Moin! Das ist das Repository für meine persönliche Portfolio-Website [yusefbach.de](https://yusefbach.de).

Hier dokumentiere ich meine Projekte (StudyNexus, Phishing Defender, Community Engine und mehr), meinen Tech-Stack und wer ich bin. Das Portfolio ist gleichzeitig Spielplatz und Showcase — gebaut ohne Frameworks, mit bewussten Architekturentscheidungen.

## 🛠 Tech Stack

Bewusst „Zero-Dependency" gehalten für maximale Performance und Kontrolle.

- **Frontend:** Vanilla TypeScript (ES6+ Output, `src/ts/` → `js/`), HTML5, CSS3 (Grid, Glassmorphism, CSS Variables)
- **i18n:** Async JSON-Chunking via `fetch()` (`lang/de.json`, `lang/en.json`)
- **AI Backend:** Python FastAPI auf Vercel Serverless (`api/index.py`), Google Gemini 2.5 Flash mit 4-stufiger Failover-Pipeline, Rate-Limiting via `slowapi`
- **Hosting:** GitHub Pages + Custom Domain (Zoho Mail Routing)
- **Contact:** EmailJS (serverless, keine Weiterleitung)
- **PWA:** Service Worker mit Stale-While-Revalidate, `manifest.json`

## ✨ Features

- **AI-Twin („Ask Yusef"):** Schwebendes Chat-Widget mit Gemini-Backend — beantwortet Recruiter-Fragen zu Skills, Projekten und Erfahrungen. Sprach-aware (DE/EN), mit Guardrails.
- **Datengesteuertes Rendering:** Projekte werden durch eine eigene TypeScript-Engine (`projects-data.ts` + `project-renderer.ts`) dynamisch injiziert — kein statisches HTML.
- **Pre-Rendering:** Build-Script (`scripts/prerender.js`) injiziert statisches HTML für Suchmaschinen.
- **Project Case Studies:** Detailseiten mit technischer Tiefe (Architekturdiagramme, ADRs, Security-Flows, DB-Schemas).
- **Performance:** Lighthouse 100 dank Intersection Observer, WebP-Bilder, Lazy Loading und Hardware-Acceleration.
- **Offline-Fähig (PWA):** Service Worker cacht Assets für Offline-Nutzung.
- **Datenschutz:** DSGVO-konform, keine Tracking-Cookies, zensierter CV.

## 📂 Struktur

```
/
├── src/ts/          TypeScript-Quellcode (kompiliert nach js/)
├── js/              Build-Output (wird nicht direkt bearbeitet)
├── css/             Stylesheets (main.css, components.css)
├── lang/            i18n JSON-Chunks (de.json, en.json)
├── projects/        Case-Study HTML-Seiten
├── images/          Assets (techstack/, projects/, ui/) + WebP-Varianten
├── scripts/         Build-Hilfsskripte (prerender.js, convert_webp.sh)
├── api/             Vercel Serverless Function (Python/FastAPI)
├── sw.js            Service Worker (generiert durch npm run build)
├── manifest.json    PWA Manifest
└── docs/            PDFs, Dokumentation
```

## 🔧 Build

```bash
npm run build
# → TypeScript kompilieren (tsc)
# → Projekte in HTML pre-rendern (scripts/prerender.js)
# → Service Worker ins Root-Verzeichnis verschieben (sw.js)
```

## 📞 Kontakt

- 📧 [kontakt@yusefbach.de](mailto:kontakt@yusefbach.de)
- 🌐 [yusefbach.de](https://yusefbach.de)
- 💼 [LinkedIn](https://linkedin.com/in/yusef-bach)
- 🐙 [GitHub](https://github.com/yusef03)

---

© 2026 Yusef Bach
