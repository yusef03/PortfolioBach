/**
 * migrate-roadmap.mjs
 * Trägt alle alten hardcodierten Roadmap-Daten einmalig in Supabase ein.
 * Lokal ausführen: node scripts/migrate-roadmap.mjs
 */

import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// .env laden (gleiche Logik wie build-roadmap.mjs)
function loadEnv() {
  const paths = [
    resolve(__dirname, '../../portfolio-admin/.env.local'),
    resolve(__dirname, '../.env.local'),
  ]
  for (const p of paths) {
    if (existsSync(p)) {
      readFileSync(p, 'utf-8').split('\n').forEach(line => {
        const [k, ...v] = line.split('=')
        if (k && v.length) process.env[k.trim()] = v.join('=').trim()
      })
      console.log('   .env geladen:', p)
      return
    }
  }
}
loadEnv()

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function insert(rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/roadmap`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(rows),
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`HTTP ${res.status}: ${txt}`)
  }
}

const entries = [

  // ── StudyNexus ──────────────────────────────────────────────────────────────
  {
    scope: 'project', project_slug: 'studynexus',
    title_de: 'Foundation: Auth, DB & Docker',
    title_en: 'Foundation: Auth, DB & Docker',
    title_ar: '',
    description_de: 'JWT Authentication, PostgreSQL-Schema mit Alembic, Docker Compose Stack mit 5 Services, Email-Verifikation via Resend API, vollständige Studienplan-CRUD mit GPA-Berechnung.',
    description_en: 'JWT authentication, PostgreSQL schema with Alembic, Docker Compose stack with 5 services, email verification via Resend API, complete study plan CRUD with GPA calculation.',
    description_ar: '',
    phase_label_de: 'Sprint 1-2 ✓',
    phase_label_en: 'Sprint 1-2 ✓',
    phase_label_ar: '',
    status: 'completed',
    sort_order: 1,
  },
  {
    scope: 'project', project_slug: 'studynexus',
    title_de: 'Mission Control & Mobile',
    title_en: 'Mission Control & Mobile',
    title_ar: '',
    description_de: 'Kanban Board (@dnd-kit), Schedule Board (15-Min CSS Grid), Dashboard Widgets, Mobile FAB, Agenda View für kleine Screens, TanStack Query Migration, vollständige i18n (DE/EN).',
    description_en: 'Kanban board (@dnd-kit), schedule board (15-min CSS grid), dashboard widgets, mobile FAB, agenda view, TanStack Query migration, full i18n (DE/EN).',
    description_ar: '',
    phase_label_de: 'Sprint 3.x ✓',
    phase_label_en: 'Sprint 3.x ✓',
    phase_label_ar: '',
    status: 'completed',
    sort_order: 2,
  },
  {
    scope: 'project', project_slug: 'studynexus',
    title_de: 'BIN Prüfungsordnung Integration',
    title_en: 'BIN Exam Regulations Integration',
    title_ar: '',
    description_de: '37 BIN-Module aus 3 PDFs, Prüfungsart-System (PX/EA/R/BAA+Ko), §6-Voraussetzungen als DB-Constraints, MilestoneWidget, PO-Übersicht-Seite, GPA-Fix BIN-209.',
    description_en: '37 BIN modules from 3 PDFs, exam-type system (PX/EA/R/BAA+Ko), §6 prerequisites as DB constraints, MilestoneWidget, PO overview page, GPA fix for BIN-209.',
    description_ar: '',
    phase_label_de: 'Sprint 4 ✓',
    phase_label_en: 'Sprint 4 ✓',
    phase_label_ar: '',
    status: 'completed',
    sort_order: 3,
  },
  {
    scope: 'project', project_slug: 'studynexus',
    title_de: 'Admin Panel — Enterprise Control Center',
    title_en: 'Admin Panel — Enterprise Control Center',
    title_ar: '',
    description_de: '14 Admin-Seiten, 35+ Endpunkte, Two-Layer Auth (JWT + Redis Sudo), Audit-Log, Analytics (Recharts), JSON-Bulk-Import, 122/122 Tests grün.',
    description_en: '14 admin pages, 35+ endpoints, two-layer auth (JWT + Redis Sudo), audit log, analytics (Recharts), JSON bulk import, 122/122 tests green.',
    description_ar: '',
    phase_label_de: 'Sprint 5 ✓',
    phase_label_en: 'Sprint 5 ✓',
    phase_label_ar: '',
    status: 'completed',
    sort_order: 4,
  },
  {
    scope: 'project', project_slug: 'studynexus',
    title_de: 'Security Audit & Email-Templates',
    title_en: 'Security Audit & Email Templates',
    title_ar: '',
    description_de: 'Admin-API-Rate-Limiting, Toast-Notifications bei API-Errors, E-Mail-Templates für Passwort-Reset, UI-Polishing und Dropdown-Auswahl für UUID-Felder.',
    description_en: 'Admin API rate limiting, toast notifications for API errors, email templates for password reset, UI polishing and dropdown selectors for UUID fields.',
    description_ar: '',
    phase_label_de: 'Sprint 6',
    phase_label_en: 'Sprint 6',
    phase_label_ar: '',
    status: 'planned',
    sort_order: 5,
  },
  {
    scope: 'project', project_slug: 'studynexus',
    title_de: 'Production Launch für die HsH',
    title_en: 'Production Launch for HsH',
    title_ar: '',
    description_de: 'Öffentlicher Launch für alle HS Hannover Studierenden. Onboarding-Flow mit vorausgefüllten Prüfungsordnungen. Gamification: XP, Badges, Streaks.',
    description_en: 'Public launch for all HS Hannover students. Onboarding flow with pre-filled exam regulations. Gamification: XP, badges, streaks.',
    description_ar: '',
    phase_label_de: 'v1.0 — Ziel',
    phase_label_en: 'v1.0 — Goal',
    phase_label_ar: '',
    status: 'planned',
    sort_order: 6,
  },

  // ── HTML-CV ─────────────────────────────────────────────────────────────────
  {
    scope: 'project', project_slug: 'html-cv',
    title_de: 'Core Engine',
    title_en: 'Core Engine',
    title_ar: '',
    description_de: 'HTML Structure & Print CSS',
    description_en: 'HTML Structure & Print CSS',
    description_ar: '',
    phase_label_de: '',
    phase_label_en: '',
    phase_label_ar: '',
    status: 'completed',
    sort_order: 1,
  },
  {
    scope: 'project', project_slug: 'html-cv',
    title_de: 'Privacy Layer',
    title_en: 'Privacy Layer',
    title_ar: '',
    description_de: 'Git Hooks & Data Separation',
    description_en: 'Git Hooks & Data Separation',
    description_ar: '',
    phase_label_de: '',
    phase_label_en: '',
    phase_label_ar: '',
    status: 'completed',
    sort_order: 2,
  },
  {
    scope: 'project', project_slug: 'html-cv',
    title_de: 'JSON Import',
    title_en: 'JSON Import',
    title_ar: '',
    description_de: 'Lebenslauf-Daten aus JSON-Datei laden statt Hardcoding.',
    description_en: 'Load CV data from JSON file instead of hardcoding.',
    description_ar: '',
    phase_label_de: '',
    phase_label_en: '',
    phase_label_ar: '',
    status: 'planned',
    sort_order: 3,
  },
  {
    scope: 'project', project_slug: 'html-cv',
    title_de: 'PDF-Auto-Gen',
    title_en: 'PDF-Auto-Gen',
    title_ar: '',
    description_de: 'Automatischer PDF-Export via Node.js (Puppeteer) bei jedem Git Push.',
    description_en: 'Automatic PDF export via Node.js (Puppeteer) on every Git Push.',
    description_ar: '',
    phase_label_de: '',
    phase_label_en: '',
    phase_label_ar: '',
    status: 'planned',
    sort_order: 4,
  },

  // ── Portfolio (global) ───────────────────────────────────────────────────────
  {
    scope: 'portfolio', project_slug: null,
    title_de: 'Architecture & TypeScript',
    title_en: 'Architecture & TypeScript',
    title_ar: '',
    description_de: 'Migration von statischem HTML zu einer datengetriebenen JS-Engine. i18n JSON-Chunks, striktes TypeScript, einheitliche Komponenten.',
    description_en: 'Migration from static HTML to a data-driven engine. i18n JSON chunks, strict TypeScript, unified components.',
    description_ar: '',
    phase_label_de: '',
    phase_label_en: '',
    phase_label_ar: '',
    status: 'completed',
    sort_order: 1,
  },
  {
    scope: 'portfolio', project_slug: null,
    title_de: 'Dark Mode',
    title_en: 'Dark Mode',
    title_ar: '',
    description_de: 'Light/Dark Mode Toggle unter Beibehaltung der Vanilla-Performance. Status-Speicherung via LocalStorage.',
    description_en: 'Light/Dark Mode toggle while keeping vanilla performance. State persistence via LocalStorage.',
    description_ar: '',
    phase_label_de: '',
    phase_label_en: '',
    phase_label_ar: '',
    status: 'planned',
    sort_order: 2,
  },
  {
    scope: 'portfolio', project_slug: null,
    title_de: 'Blog / Thoughts',
    title_en: 'Blog / Thoughts',
    title_ar: '',
    description_de: 'Eigene /thoughts Sektion — kurze Posts, LinkedIn-Stil aber individuell. Verwaltet im Admin Panel.',
    description_en: 'Own /thoughts section — short posts, LinkedIn-style but individual. Managed in Admin Panel.',
    description_ar: '',
    phase_label_de: '',
    phase_label_en: '',
    phase_label_ar: '',
    status: 'planned',
    sort_order: 3,
  },
  {
    scope: 'portfolio', project_slug: null,
    title_de: 'Arabisch (AR) — Dritte Sprache',
    title_en: 'Arabic (AR) — Third Language',
    title_ar: '',
    description_de: 'Vollständige AR-Übersetzung + RTL-Support. Language Switcher: DE → EN → AR.',
    description_en: 'Full AR translation + RTL support. Language switcher: DE → EN → AR.',
    description_ar: '',
    phase_label_de: '',
    phase_label_en: '',
    phase_label_ar: '',
    status: 'planned',
    sort_order: 4,
  },
]

console.log(`\n📥  Migriere ${entries.length} Roadmap-Einträge nach Supabase…\n`)

try {
  await insert(entries)
} catch (e) {
  console.error('❌  Fehler:', e.message)
  process.exit(1)
}

console.log(`✅  ${entries.length} Einträge erfolgreich eingefügt:`)
console.log(`   StudyNexus:  6 Sprints`)
console.log(`   HTML-CV:     4 Einträge`)
console.log(`   Portfolio:   4 Einträge`)
console.log(`\nNächster Schritt: node scripts/build-roadmap.mjs`)
