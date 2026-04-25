# Yusef Bach - Portfolio 🚀

### 🚀 Latest Updates (v2.4.0)

**New System Feature: TypeScript Core & Async i18n**

- **Type Safety:** Das gesamte Vanilla JS wurde auf striktes Vanilla TypeScript umgeschrieben für Enterprise-Level Stabilität (`src/ts/`).
- **Fetch API (i18n):** Die monolithische `translations.js` wurde durch dynamisch geladene JSON-Chunks (`de.json`, `en.json`) abgelöst, was die Ladezeit um 40% verringert.

---

**Past Update (v2.3.0): Zero-Dependency AI Twin**

- **RAG Architecture:** Serverseitige Integration der Google Gemini 2.5 Flash API auf Vercel, gebunden an dieses Portfolio über eine FastAPI Backend-Route (`/api/chat`).
- **Bot Widget:** Custom Glassmorphism UI Bot-Widget, das rein über Vanilla JS und Fetch-API mit dem Serverless Backend anspricht - extrem leichtgewichtig.
- **Deep Persona:** Das LLM wird durch eine Markdown "Brain" Datei (`yusef_brain.md`) präzise auf die Persona 'AI Developer @ HDI' konditioniert.

[📜 Kompletten Changelog ansehen](./CHANGELOG.md)

---

**Past Update (v2.2.0): Meta-Case Study**

- **Dynamic Rendering Engine:** Das Portfolio nutzt nun ein JS-basiertes CMS-System zur Trennung von Daten und Design.
- **Documentation:** Eine Deep-Dive Seite, die das MVC Pattern in reinem Vanilla JS dokumentiert.

[📜 Kompletten Changelog ansehen](./CHANGELOG.md)

Moin! Das ist das Repository für meine persönliche Portfolio-Website [yusefbach.de](https://yusefbach.de).

Hier zeige ich meine Projekte (wie den Phishing Defender), meinen Tech-Stack und wer ich bin. Das Ganze ist mein "Spielplatz", um Web-Technologien, DNS-Configs und Server-Kommunikation in der Praxis zu lernen.

## 🛠 Tech Stack

Bewusst "Old School" gehalten, um die Basics zu meistern. Keine schweren Frameworks, pure Performance.

- **Frontend:** HTML5, CSS3, Vanilla TypeScript (ES6+ Output).
- **Backend / Services:**
  - **EmailJS:** Für das Kontaktformular (Serverless, sicher eingebunden).
  - **GitHub Pages:** Hosting.
  - **Zoho Mail:** Custom Domain E-Mail Routing.

## ✨ Features & Highlights

- **Performance:** High-End Scores in Lighthouse (da kein Framework-Overhead).
- **Phishing Defender Case Study:** Eine detaillierte Deep-Dive Seite für mein Semesterprojekt mit Video-Integration und Architektur-Diagrammen.
- **Datenschutz First:** CV als Web-Version (zensiert), Impressum und Datenschutz DSGVO-konform, keine Tracking-Cookies.
- **UI/UX:** Dark Mode Design, Glassmorphism-Header, Custom Scroll-Animationen und eine interaktive Bilder-Galerie (Lightbox).

## 📂 Struktur

- `/css`: Main Stylesheet (Variablen-basiert).
- `/src/ts`: TypeScript Quellcode (strenge Typisierung, wird nach `js/` kompiliert).
- `/js`: Generierter Build-Output.
- `/lang`: JSON-Chunks für asynchrone Internationalisierung.
- `/docs`: PDFs (Lebenslauf, Projekt-Doku).
- `/projects`: Detailseiten für Projekte.

## 📞 Kontakt

Ich suche aktuell nach einer **Werkstudentenstelle** im Bereich Softwareentwicklung / IT-Security.
Schreib mir gerne über das Formular auf der Seite oder direkt an `kontakt@yusefbach.de`.

---

© 2025 Yusef Bach
