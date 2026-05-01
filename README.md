# Yusef Bach — Portfolio

Live: [yusefbach.de](https://yusefbach.de)

---

### 🚀 Latest: v2.5.0 — AI & Mobile Reliability Update

- **Mobile Nav Fix:** Hamburger-Menü und Overlay vollständig neu implementiert. Konkurrierende CSS-Blöcke zusammengeführt, Selektor-Konflikte behoben, horizontaler Scroll eliminiert.
- **Bot Spracherkennung:** AI-Twin antwortet jetzt automatisch in der Seitensprache (DE/EN) — erkennt `localStorage`-Präferenz und übermittelt sie ans Backend.
- **Bot Guardrails:** Strikte System-Prompt-Regeln verhindern Missbrauch (kein Code schreiben, keine externen Aufgaben, nur Portfolio-Themen).
- **StudyNexus Case Study:** Neue 7-Chapter-Showcase-Seite für das Flaggschiff-Projekt (FastAPI + Next.js 14 + PostgreSQL + Docker).
- **FOUC Prevention:** `visibility: hidden` + `i18n-ready`-Klasse verhindert Fallback-Text-Flash.

[📜 Kompletten Changelog ansehen](./CHANGELOG.md)

---

Moin! Das ist das Repository für meine persönliche Portfolio-Website [yusefbach.de](https://yusefbach.de).

Hier dokumentiere ich meine Projekte (StudyNexus, Phishing Defender, Community Engine und mehr), meinen Tech-Stack und wer ich bin. Das Portfolio ist gleichzeitig Spielplatz und Showcase — gebaut ohne Frameworks, mit bewussten Architekturentscheidungen.

## 🛠 Tech Stack

Bewusst "Zero-Dependency" gehalten für maximale Performance und Kontrolle.

- **Frontend:** Vanilla TypeScript (ES6+ Output, `src/ts/` → `js/`), HTML5, CSS3 (Grid, Glassmorphism, CSS Variables)
- **i18n:** Async JSON-Chunking via `fetch()` (`lang/de.json`, `lang/en.json`)
- **AI Backend:** Python FastAPI auf Vercel Serverless (`api/index.py`), Google Gemini 2.5 Flash mit 4-stufiger Failover-Pipeline
- **Hosting:** GitHub Pages + Custom Domain (Zoho Mail Routing)
- **Contact:** EmailJS (serverless, keine Weiterleitung)

## ✨ Features

- **AI-Twin ("Ask Yusef"):** Schwebendes Chat-Widget mit Gemini-Backend — beantwortet Recruiter-Fragen zu Skills, Projekten und Erfahrungen. Sprach-aware (DE/EN), mit Guardrails.
- **Datengesteuertes Rendering:** Projekte werden durch eine eigene TypeScript-Engine (`projects-data.ts` + `project-renderer.ts`) dynamisch injiziert — kein statisches HTML.
- **Project Case Studies:** Detailseiten mit technischer Tiefe (Architekturdiagramme, ADRs, Security-Flows, DB-Schemas).
- **Performance:** Lighthouse 100 dank Intersection Observer, Lazy Loading und Hardware-Acceleration.
- **Datenschutz:** DSGVO-konform, keine Tracking-Cookies, zensierter CV.

## 📂 Struktur

```
/
├── src/ts/          TypeScript-Quellcode (kompiliert nach js/)
├── js/              Build-Output (wird nicht direkt bearbeitet)
├── css/             Stylesheets (main.css, utilities.css)
├── lang/            i18n JSON-Chunks (de.json, en.json)
├── projects/        Case-Study HTML-Seiten
├── images/          Assets (techstack/, projects/, ui/)
├── api/             Vercel Serverless Function (Python)
├── lang/            i18n JSON-Chunks
└── docs/            PDFs, Dokumentation
```

## 📞 Kontakt

- 📧 [kontakt@yusefbach.de](mailto:kontakt@yusefbach.de)
- 🌐 [yusefbach.de](https://yusefbach.de)
- 💼 [LinkedIn](https://linkedin.com/in/yusef-bach)
- 🐙 [GitHub](https://github.com/yusef03)

---

© 2026 Yusef Bach
