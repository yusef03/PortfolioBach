# Changelog

All notable changes to this project are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

_Nothing yet — see [`/roadmap`](https://yusefbach.de/roadmap.html) for what's planned next._

---

## [3.0.0] - 2026-07-06 (The Managed Relaunch)

The biggest release since launch: the portfolio evolves from a static site into a fully
self-managed, trilingual system — hardened at every layer, with its own admin panel,
AI twin, and a redesigned homepage — still without a single frontend framework.

### ✨ Trilingual, with real SEO

- **Three languages (DE/EN/AR):** Full internationalization across 600+ keys, every page
  translated, Arabic with true RTL layout (`dir="rtl"` + CSS overrides). A 3-way language
  pill (DE · EN · ع) in every header.
- **Static pre-rendering per language:** Client-side translation alone meant Google only
  ever saw German. Now a build step (`build-lang-pages.mjs`, Node + cheerio) generates a
  fully pre-rendered copy of every page per language — German at root, `/en/`, `/ar/` —
  each with correct `hreflang`, `canonical`, and native `<html lang>`/`dir`. Sitemap
  carries `hreflang` alternates; JSON-LD `Person` schema for a clean Google entity.

### 🤖 Ask Yusef · Neural Console (Bot v2)

Complete redesign of the AI-Twin chat window — backend and knowledge base unchanged.

- New FAB with a modern bot-head icon inside an animated accent-glow ring. Idle = ring
  "breathes" (opacity 0.72↔1); hover = ring rotates. Positions itself in the empty zone
  next to the content container on wide screens instead of overlapping it.
- **Auto-hide on scroll:** dims on scroll-down, returns on scroll-up or 1.4s scroll-stop;
  never dims while the panel is open.
- Fullscreen bottom-sheet on mobile with drag-to-close; theme-aware panel (fixes an
  earlier bug where the panel stayed dark in light mode); token-based colors throughout.
- **Context-aware greeting + prompt chips** per page type (project / thought / home),
  in DE/EN/AR. **⌘K / Ctrl+K** opens the panel on desktop.
- Local chat history (30 days, 50 messages, `localStorage` only — nothing sent to Yusef),
  copy-per-message, character counter, typing dots + typewriter reveal.
- Full A11y: `role="dialog"`, focus trap + return, Esc to close, `aria-live` for new
  messages, reduced-motion strips all animation.
- New privacy notice section (§5, `datenschutz.html`) explaining exactly what the chat
  processes and where.

### 🛠 Admin Panel — "SPACE"

- Redesigned into an Apple-inspired management tool: single blue accent, Dark+Light,
  Inter + JetBrains Mono, `framer-motion` throughout.
- **⌘K command palette** — jump to any page or toggle theme, fully keyboard-driven.
- **8 content areas:** translations (repo-first), projects, media, roadmap, changelog,
  thoughts (composer with live preview), bot memory (repo-first), maintenance mode.
- **System Health dashboard:** 7 parallel live checks (Supabase, DeepL, GitHub, portfolio
  reachability, maintenance status, last publish run, storage quota) plus a full
  activity log of every admin action.

### 🔒 Security Fortress

Four independent layers protect the admin panel — before it manages the real live site:

1. Supabase signups disabled — an unknown GitHub account never gets a session.
2. Server-side **whitelist** checked on every request (email + GitHub username + provider).
3. **PIN as a second factor** after GitHub login — HMAC-signed, time-limited cookie,
   rate-limited against brute force.
4. **Rate limits + security headers** (HSTS, CSP, X-Frame-Options) on all write paths.

Also new: `repo-config.ts` — a fail-fast, single source of truth for the target repo
across every API route. No more hardcoded repo name; switching the live target is one
environment variable, not a code change.

### 📰 New public sections

- **Thoughts (blog):** multilingual at `/thoughts/`, one post = one topic in EN/DE/AR
  (a single DB row), Markdown composer with live preview in the admin.
- **Public changelog:** grouped by version/date/category. Cards are now **clickable** and
  open a high-end detail modal (bottom-sheet on mobile) — the overview stays scannable.
- **Dynamic roadmap:** Supabase-driven, scope logic (portfolio + per-project),
  pre-rendered for SEO.
- **GitHub activity widget:** live contribution heatmap + repo stats on the homepage,
  build-baked daily — no client-side API calls.

### 🎬 Homepage redesign — "Calm Cinema"

- **One continuous canvas:** every section background block dissolved into a single
  page-spanning surface with soft light fields and fine grain — no more hard color-block
  seams between sections.
- **Mouse-following aurora** in the hero, cinematic scroll reveals (elements rise with a
  soft blur-to-sharp resolve), a large, quiet editorial layout.
- Smooth custom scrolling, staggered card reveals, cinematic photo blends.

### ♿ Accessibility, PWA & Design System

- Skip links, visible focus states, semantic landmarks, zero CLS, lazy-loaded media,
  full keyboard operability including modal focus traps.
- Dark/Light mode (no-flash), self-hosted variable fonts (Inter + JetBrains Mono), fluid
  typography (`clamp()`), design tokens, motion language built on View Transitions.
- Service Worker (offline-capable, defensive caching), installable via manifest.

### 🐛 Bug fixes & mobile QA

Full mobile pass across hero, tech stack, certifications, projects, about, contact,
changelog, thoughts, and archive. Notable fixes: footer "Roadmap" link missing its
translation; Arabic project descriptions were empty (fell back to German); light-mode
project-page cards were hardcoded dark and unreadable; back-navigation didn't restore
scroll position when using the in-page "back" links (now resolves via `history.back()`
when the referrer confirms it); StudyNexus hero video overlay was too weak, washing out
the title over the login-form footage.

### 🔄 Changed

- **Web root moved to `website/`:** all published assets now live under `website/`.
- **Build pipeline:** `npm run build:all` orchestrates every generator (projects, roadmap,
  thoughts, github-activity, media-manifest, per-language pages) plus pre-render and sitemap.
- **Content backend:** structured content flows from the admin panel through Supabase and
  is published into the repo via GitHub Actions; translations and bot memory commit
  repo-first, direct to the repo.

### 🏗 Infrastructure

- **GitHub Actions publish pipelines:** dedicated workflows for projects/roadmap/thoughts,
  each now also rebuilding the per-language mirrors.
- **Supabase:** PostgreSQL as the content backend with RLS + GRANTs (two protective layers).
- **Service Worker:** cache version bumped to `v4`.

---

## [2.7.0] - 2026-05-11 (The PWA, SEO & Performance Hardening Update)

A comprehensive technical hardening update. Security gaps closed, build pipeline modernized,
the portfolio made offline-capable, and SEO fundamentally improved.

### ✨ New Features

- **PWA / Service Worker (`sw.js`):** The portfolio is now installable as a Progressive Web App. A service worker with a stale-while-revalidate strategy caches all static assets (HTML, CSS, JS, images). API calls are deliberately not cached. Generated via `npm run build` and placed in the root directory.
- **`manifest.json`:** PWA manifest with name, icons, theme color (`#9d00ff`), and start URL. Enables installation as an app on mobile devices.
- **Pre-rendering for SEO (`scripts/prerender.js`):** A Node.js script that, on every `npm run build`, reads `projectsData`, generates the hero and archive HTML, and injects it directly into `index.html` and `archive.html`. Googlebot now sees static HTML instead of empty containers.
- **WebP image optimization (`scripts/convert_webp.sh`):** A bash script converts all `.jpg`/`.png` files to `.webp` via `ffmpeg` (quality 80). 21 WebP files generated. All image tags in `index.html`, `project-renderer.ts`, and the archive switched to `<picture>` tags with a WebP source and a JPEG/PNG fallback.
- **JSON-LD structured data:** `Person` schema in the `<head>` of `index.html` — Google Rich Results ready.

### 🔒 Security Fixes

- **CORS locked down:** `api/index.py` now only allows `https://yusefbach.de`, `http://localhost`, `http://127.0.0.1`. Previously `allow_origins=["*"]` — any website could exhaust the Gemini quota.
- **Rate limiting:** `slowapi` integrated (10 requests/minute per IP) on the `/api/chat` endpoint.
- **Async HTTP:** Replaced `urllib.request` (synchronous, blocking) with `httpx` — no more thread blocking in the async FastAPI context.

### 🔄 Updated

- **StudyNexus as the hero project:** `HERO_PROJECT_ID` changed from `portfolio-meta` to `studynexus` — the flagship project is now featured prominently on the homepage.
- **Build script:** `package.json` `"build"` now runs `tsc && prerender.js && mv sw.js` — the full pipeline in a single command.
- **Typing animation:** New words: `"AI Systems Engineer"`, `"Full-Stack Developer"`, `"Enterprise AI Developer"` — aligned with the AI branding.
- **Semester display:** Calculated dynamically from the start date `2024-09-01` in `script.ts`. No more manual updates required.
- **Contact section:** Consistent informal tone in `index.html` and `lang/de.json`. Formal address fully removed.
- **Redundant CTA section removed:** Deleted the duplicate contact section between About and Contact in `index.html`.
- **`requirements.txt`:** Added `slowapi` and `httpx` as dependencies.

### 🐛 Bug Fixes

- **Semester display design:** `<div class="stat-number">` reverted to `<h3>` — the previous refactor had broken the visual styling of the stats box.
- **StudyNexus case study:** v0.5.0 update — 2 new chapters (BIN examination regulations, admin panel), 22+ ADRs, 17 migrations, 122 tests, 6-box stats grid.

### 🔧 Infrastructure

- **Git hygiene:** `ANTIGRAVITY.md`, `yusef_brain.md`, `internal-docs/`, `.idea/`, `*.iml` removed from Git tracking (`git rm --cached`). Files remain local but are no longer visible on GitHub.
- **`ANALYSE.md` (internal-docs):** Completed items from Phase 1 and Phase 2 removed. The file now reflects the current state.

---

## [2.6.0] - 2026-05-11 (The StudyNexus Deep-Dive Update)

A comprehensive update of the StudyNexus case study to Sprint 5 status. Two new chapters,
updated statistics, new security and admin visualizations. Also: private analysis
documentation, `.gitignore` cleanup, and a CSS bug fix.

### ✨ New Features

- **studynexus.html — Chapter V: BIN Examination Regulations (NEW):** A complete presentation of the BIN-PO integration from Sprint 4. PDF source visualization (3 documents), an exam-type color system (PX/EA/R/BAA+Ko), a §6 prerequisite-rules table, a MilestoneWidget mockup with live milestone chips.
- **studynexus.html — Chapter VII: Admin Panel (NEW):** A Sprint 5 delivery callout (2 days / 14 pages / 35+ endpoints / 122 tests / 0 TS errors), 6 admin feature cards, a two-layer auth diagram, a test-coverage terminal (all 12 test files with counters, "122 passed in 2.34s").
- **Navigation:** New anchors `#bin-po` and `#admin` in the project nav.
- **ADR section:** 2 new ADR cards (ADR-019 Redis session, ADR-021 is_admin in the JWT).
- **Security chapter:** New card "Two-Layer Admin Auth" with a visual layer-1/layer-2 diagram.
- **Feature chapter:** 4 new feature cards (MilestoneWidget, PO overview, admin panel preview, plus an expanded study-plan card).

### 🔄 Updated

- **Hero badge:** "v0.3.7 — In active development" → "Sprint 5 complete · v0.5.0"
- **Dev banner:** Sprint 3.7 text → Sprint 5 completion status with test metrics
- **Stats grid:** 4 boxes → 6 boxes (200+ files / 17 migrations / 22+ ADRs / 122 tests / 37 BIN modules / 5 Docker)
- **ADR subtitle:** "14 ADRs" → "22+ ADRs"
- **Migration timeline:** 9 entries → 17 entries (Sprint 4: 012–014, Sprint 5: 015–017)
- **Database subtitle:** "9 models" → "12+ tables. 17 Alembic migrations."
- **Roadmap:** Sprints 4 and 5 marked ✓ Complete, Sprint 6 added as "Planned", v1.0 retained as the final goal
- **Chapter numbering:** Security → VI, Database → VIII, Roadmap → IX
- **lang/de.json + lang/en.json:** All new i18n keys + updated roadmap keys
- **yusef_brain.md:** StudyNexus section fully updated to v0.5.0 (Sprints 4+5, all new features, 22+ ADRs, 17 migrations, 122 tests)

### 🐛 Bug Fixes

- **CSS syntax error (components.css:220):** Removed a stray `/` after `display: inline-block;` (unclosed comment start).
- **Profile images:** `hero-profile.jpg` and `about-profile.jpg` are now two distinct images (previously a single shared image). The HTML already referenced them correctly.

### 🔒 Privacy & Infrastructure

- **.gitignore:** Added `ANTIGRAVITY.md`, `yusef_brain.md`, `internal-docs/`, `.idea/`, `*.iml`.
- **internal-docs/ANALYSE.md:** Created a private overall analysis of the portfolio (13 sections, never on GitHub).
- **internal-docs/STUDYNEXUS_UPDATE_2026-05-11.md:** Complete documentation of this update session.

---

## [2.5.0] - 2026-05-01 (The AI & Mobile Reliability Update)

A comprehensive stability and intelligence upgrade. Mobile navigation fully reimplemented,
bot intelligence expanded, and the AI twin's knowledge system updated to the current
project portfolio.

### 🐛 Bug Fixes

- **Mobile navigation (critical fix):** Merged two competing `@media (max-width: 1100px)` blocks in `main.css`. The first block set `.nav-content-wrapper` globally without the `.project-nav` prefix, causing selector conflicts and faulty overlay behavior. Cleaned up into one consistent system scoped to `.project-nav`.
- **Horizontal scroll (mobile):** `width: 100vw` in the overlay caused horizontal scrolling on narrow viewports. Fixed with `width: 100%`.
- **Outside-click close:** The hamburger menu now closes correctly on a click outside the overlay (`document` event listener).

### 🤖 AI-Twin Improvements

- **Language awareness:** The bot detects the current page language from `localStorage` and sends it with every request to the backend.
- **Dynamic language control (backend):** `api/index.py` injects a binding language instruction into the system prompt based on the request's `lang` field. Responses reliably come back in German or English.
- **Localized UI:** The greeting message, placeholder text, loading feedback, and fallback messages in the bot widget are now fully localized DE/EN.
- **Guardrails:** Strict rules in the system prompt prevent abuse: no writing code, no external tasks, no persona manipulation, portfolio-relevant topics only.
- **Knowledge base (`yusef_brain.md`):** Full update to v2.5.0. Added StudyNexus with complete technical details (FastAPI, PostgreSQL, ADRs, security architecture). HDI role clarified. Current tech stack (Next.js, Docker, Redis, Alembic) added.

### ✨ New Features

- **StudyNexus case study (`projects/studynexus.html`):** A complete 7-chapter project page for the flagship project. Includes the origin story, a tech-stack deep dive, security-flow diagrams (JWT/CSRF), the database schema (9 SQLAlchemy models), Architecture Decision Records (14 ADRs), and the deployment architecture.
- **StudyNexus in the archive:** Project registered in `projects-data.ts` as the first archive entry (incl. badges, features, timeframe).
- **New tech-stack icons:** Python, React/Next.js, Docker, PostgreSQL, Claude/LLMs added to the marquee.

### 🔧 Infrastructure

- **FOUC prevention:** `body { visibility: hidden }` + an `i18n-ready` class prevents the flash of fallback HTML text before translations load. A catch-block safeguard ensures the page stays visible even if JS errors occur.

---

## [2.4.1] - 2026-04-30 (The Product Engineer & StudyNexus Intro)

A content and identity upgrade. Narrative adapted to the current positioning as a
Product Engineer and AI Developer.

### ✍️ Content & Rebranding

- **Narrative shift:** Hero and About sections rewritten. Focus on product engineering, AI orchestration, and system architecture.
- **Tone of voice:** Moved away from elitist "anti-framework" rhetoric toward pragmatic problem solving.

---

## [2.4.0] - 2026-04-26 (The TypeScript & Performance Core)

A significant architecture upgrade. Migration to TypeScript and async i18n JSON fetching.

### 🧱 Architecture

- **TypeScript migration:** The entire codebase migrated from `js/` to `src/ts/`. Strict typing via Vanilla TypeScript.
- **Interfaces (`types.d.ts`):** Types defined for `Project`, `Translations`, and all i18n structures.
- **Build step:** A `tsc` compile step generates plain ES6 JavaScript into `js/`.

### ⚡ Performance & i18n

- **i18n JSON chunking:** Replaced the monolithic `translations.js` with dynamically loaded `lang/de.json` and `lang/en.json`.
- **Async fetch:** Translations are lazy-loaded via `fetch()` — load times reduced by ~40%.
- **Lazy loading:** `loading="lazy"` applied system-wide to all images below the fold.

### ♿ Accessibility

- **Keyboard navigation:** Native `:focus-within` rings in CSS for accessible tab control.

---

## [2.3.0] - 2026-04-23 (The AI & RAG Update)

Transformation of the static portfolio into an AI-powered architecture.

### 🧠 Backend & AI

- **RAG architecture (`api/index.py`):** A Vercel serverless function backend with FastAPI. Reads `yusef_brain.md` as dynamic system context.
- **Gemini 2.5 Flash:** Integration of the Google Gemini API via a direct REST call (no SDK overhead).
- **Failover pipeline:** A 4-stage fallback cascade: `gemini-2.5-flash` → `gemini-2.5-flash-lite` → `gemini-2.0-flash` → `gemini-2.0-flash-lite`.
- **CORS & security:** API endpoint secured, CORS policies configured.

### 💬 Frontend

- **"Ask Yusef" chat widget:** A floating bot widget (Vanilla TypeScript, glassmorphism UI).
- **Graceful fallback:** Client-side fallback messages on API timeout — no visible error.

---

## [2.2.0] - 2025-12-11 (The Meta & Architecture Update)

The portfolio turned into a case study of its own. Rendering engine and archive implemented.

### 🚀 New Features

- **Portfolio system architecture:** A detail page `projects/portfolio-meta.html` documenting the MVC engine, DNS infrastructure, and Git workflows.
- **Dynamic project rendering:** A JS-based rendering engine (`project-renderer.js`). Separation of data (`projects-data.js`) and view.
- **Hero/archive logic:** Automatic hero-project assignment via a configuration ID.
- **Project archive:** A dedicated page `projects/archive.html` with a grid layout.
- **Maintenance system:** A global switch (`status.js`) for instant maintenance redirects.
- **New case study:** Added "HTML/CSS CV Engine".

### 🐛 Fixes

- Mobile navigation: the overlay blocked interactions — fixed.
- Relative path resolution for images in subfolders.
- CSS vendor-prefix warnings (`background-clip`) fixed.

---

## [2.1.0] - 2025-12-03 (The Privacy & Polish Update)

Focus on security, privacy, and cleaner code.

### 🔒 Security & Privacy

- **Contact form:** Formspree → EmailJS (direct API, no redirect).
- **Résumé:** Web version with redacted address/phone number (`.gitignore` privacy approach).
- **Privacy policy:** Texts updated to be GDPR-compliant.

### 💅 UI

- Header glassmorphism effect, gradient contact button, smoother sticky-scroll behavior.

### 🐛 Fixes

- Inline JS in subpages extracted into separate files.
- Favicon caching fixed via `?v=2`.
- Custom 404 error page implemented.

---

## [2.0.0] - 2025-11-30 (The Portfolio Transformation)

A complete rebuild from the "Bach IT" company website into a personal developer portfolio.

### 🚀 Major Changes

- New dark-mode design with neon accents.
- Phishing Defender case study as the first detail page.
- Cinematic hero section (video background), documentation hub, lightbox gallery, UML diagrams.

---

## [1.0.0] - 2024 (Legacy)

- First version as a landing page for the fictional "Bach IT GmbH".
- Basic HTML/CSS setup.
