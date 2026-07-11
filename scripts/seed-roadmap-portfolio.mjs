/**
 * seed-roadmap-portfolio.mjs
 *
 * Befüllt Roadmap + Changelog mit echten Einträgen, synchron zu den
 * internal-docs (master-plan.md + aktuell/).
 *
 * IDEMPOTENT: Mehrfaches Ausführen erzeugt KEINE Duplikate
 * (Roadmap-Einträge werden per scope+project_slug+title_de gematcht → PATCH statt INSERT).
 *
 * Was dieses Script tut:
 *   1. Veraltete Einträge löschen:
 *      - "Test"-Einträge (scope=portfolio, title_de=Test)
 *      - "Architecture & TypeScript" (completed) → lebt als Changelog v1.0.0
 *      - "tests"-Leftover auf der StudyNexus-Projektseite
 *   2. Roadmap-Einträge synchronisieren (in-progress + planned, eindeutige sort_order)
 *   3. sort_order der bestehenden alten Einträge setzen (Dark Mode/Blog/AR) → keine Kollisionen
 *   4. Changelog-Einträge einfügen → überspringt Versionen die schon existieren
 *
 * Was es NICHT anfasst:
 *   - Content (DE/EN) der bestehenden alten Einträge — nur deren sort_order
 *   - Andere Projekt-Einträge (scope=project)
 *
 * Lokal testen:
 *   node scripts/seed-roadmap-portfolio.mjs
 *
 * Danach:
 *   node scripts/build-roadmap.mjs && node scripts/prerender-roadmap.js
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))

function loadEnvLocal() {
  const envPaths = [
    resolve(__dir, '../.env.local'),
    resolve(__dir, '../../portfolio-admin/.env.local'),
  ]
  for (const envPath of envPaths) {
    try {
      const content = readFileSync(envPath, 'utf-8')
      for (const line of content.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const eqIndex = trimmed.indexOf('=')
        if (eqIndex === -1) continue
        const key = trimmed.slice(0, eqIndex).trim()
        const val = trimmed.slice(eqIndex + 1).trim()
        if (key && !process.env[key]) process.env[key] = val
      }
      console.log(`   .env geladen: ${envPath}`)
      return
    } catch { }
  }
}

if (!process.env.SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  loadEnvLocal()
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌  SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY fehlen.')
  process.exit(1)
}

const BASE_HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
}

async function sbGet(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: BASE_HEADERS })
  if (!res.ok) throw new Error(`GET ${path}: ${res.status} ${await res.text()}`)
  return res.json()
}

async function sbPost(path, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'POST',
    headers: { ...BASE_HEADERS, Prefer: 'return=minimal' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`POST ${path}: ${res.status} ${await res.text()}`)
}

async function sbPatch(path, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'PATCH',
    headers: { ...BASE_HEADERS, Prefer: 'return=minimal' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`PATCH ${path}: ${res.status} ${await res.text()}`)
}

async function sbDelete(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'DELETE',
    headers: BASE_HEADERS,
  })
  if (!res.ok) throw new Error(`DELETE ${path}: ${res.status} ${await res.text()}`)
}

// ─── 1. Test-Einträge entfernen ──────────────────────────────────────────────

async function deleteTestEntries() {
  const entries = await sbGet('roadmap?scope=eq.portfolio&title_de=eq.Test&select=id,title_de')
  if (!entries.length) { console.log('   Kein Test-Eintrag gefunden'); return }
  for (const e of entries) {
    await sbDelete(`roadmap?id=eq.${e.id}`)
    console.log(`   ✓ Gelöscht: "${e.title_de}" (id=${e.id})`)
  }
}

// ─── 2. Neue Roadmap-Einträge ─────────────────────────────────────────────────
//
// Sortierung auf roadmap.html: in-progress kommt zuerst (sort_order 0),
// dann planned nach Phase (10er-Schritte für einfaches Umsortieren).
// Bestehende Einträge (Dark Mode=1, Blog/Thoughts=2, AR=3 oder ähnlich)
// werden durch sort_order 20+ nicht verdrängt.

const NEW_ROADMAP_ENTRIES = [
  // ── IN PROGRESS ──────────────────────────────────────────────────────────
  {
    scope: 'portfolio',
    project_slug: null,
    title_de: 'Admin Panel — Phase 1 Abschluss',
    title_en: 'Admin Panel — Phase 1 Completion',
    title_ar: 'لوحة الإدارة — إتمام المرحلة الأولى',
    description_de: 'Changelog-Admin + Blog/Thoughts-Editor im Admin Panel. Letzter Schritt von Phase 1 bevor das Portfolio öffentlich geht.',
    description_en: 'Changelog admin + Blog/Thoughts editor in the admin panel. Final step of Phase 1 before the portfolio goes public.',
    description_ar: 'إدارة سجل التغييرات ومحرر المدونة في لوحة الإدارة. الخطوة الأخيرة من المرحلة الأولى.',
    phase_label_de: 'Phase 1 — aktiv',
    phase_label_en: 'Phase 1 — active',
    phase_label_ar: 'المرحلة 1 — نشطة',
    status: 'in-progress',
    sort_order: 0,
  },

  // ── PLANNED — Phase 2 ─────────────────────────────────────────────────────
  {
    scope: 'portfolio',
    project_slug: null,
    title_de: 'Öffentliche Changelog-Seite',
    title_en: 'Public Changelog Page',
    title_ar: 'صفحة سجل التغييرات العامة',
    description_de: 'Eigene /changelog-Seite — alle Releases nach Version, Datum und Kategorie gelistet. Footer-Link, vollständig mehrsprachig.',
    description_en: 'Own /changelog page — all releases listed by version, date, and category. Footer link, fully multilingual.',
    description_ar: 'صفحة /changelog خاصة تعرض جميع الإصدارات مرتبة حسب الإصدار والتاريخ والفئة.',
    phase_label_de: 'Phase 2',
    phase_label_en: 'Phase 2',
    phase_label_ar: 'المرحلة 2',
    status: 'planned',
    sort_order: 10,
  },
  {
    scope: 'portfolio',
    project_slug: null,
    title_de: 'Copy Email Button',
    title_en: 'Copy Email Button',
    title_ar: 'زر نسخ البريد الإلكتروني',
    description_de: 'Ein-Klick-Kopieren der E-Mail in der Kontaktsektion — direkt in die Zwischenablage, kein Mailto-Link.',
    description_en: 'One-click copy of email in the contact section — directly to clipboard, no mailto link.',
    description_ar: 'نسخ البريد الإلكتروني بنقرة واحدة في قسم الاتصال — مباشرةً إلى الحافظة.',
    phase_label_de: 'Phase 2',
    phase_label_en: 'Phase 2',
    phase_label_ar: 'المرحلة 2',
    status: 'planned',
    sort_order: 20,
  },
  {
    scope: 'portfolio',
    project_slug: null,
    title_de: 'GitHub Activity Widget',
    title_en: 'GitHub Activity Widget',
    title_ar: 'أداة نشاط GitHub',
    description_de: 'Live GitHub-Aktivitäten auf der Startseite — Contribution-Graph oder letzte Commits. Belegt aktives Development ohne ein Wort.',
    description_en: 'Live GitHub activity on the homepage — contribution graph or recent commits. Proves active development without a word.',
    description_ar: 'نشاط GitHub المباشر على الصفحة الرئيسية — يثبت التطوير النشط دون كلمة.',
    phase_label_de: 'Phase 2',
    phase_label_en: 'Phase 2',
    phase_label_ar: 'المرحلة 2',
    status: 'planned',
    sort_order: 30,
  },
  {
    scope: 'portfolio',
    project_slug: null,
    title_de: 'Demo-Video Integration',
    title_en: 'Demo Video Integration',
    title_ar: 'تكامل الفيديو التوضيحي',
    description_de: 'Kurze Demo-Videos direkt in Projektseiten — StudyNexus zuerst. Lazy-Loading, kein Autoplay, kein Performance-Impact.',
    description_en: 'Short demo videos directly in project pages — StudyNexus first. Lazy loading, no autoplay, no performance impact.',
    description_ar: 'فيديوهات توضيحية قصيرة في صفحات المشاريع مباشرةً.',
    phase_label_de: 'Phase 2',
    phase_label_en: 'Phase 2',
    phase_label_ar: 'المرحلة 2',
    status: 'planned',
    sort_order: 40,
  },
  {
    scope: 'portfolio',
    project_slug: null,
    title_de: 'Project Status Indicators',
    title_en: 'Project Status Indicators',
    title_ar: 'مؤشرات حالة المشروع',
    description_de: 'Live-Status-Badges auf Projektkarten — "In Entwicklung", "Beta", "Live". Gesteuert aus dem Admin Panel.',
    description_en: 'Live status badges on project cards — "In Development", "Beta", "Live". Controlled from the admin panel.',
    description_ar: 'شارات الحالة المباشرة على بطاقات المشاريع — مدارة من لوحة الإدارة.',
    phase_label_de: 'Phase 2',
    phase_label_en: 'Phase 2',
    phase_label_ar: 'المرحلة 2',
    status: 'planned',
    sort_order: 50,
  },

  // ── PLANNED — Phase 3 ─────────────────────────────────────────────────────
  {
    scope: 'portfolio',
    project_slug: null,
    title_de: 'Animierte Seitenübergänge',
    title_en: 'Animated Page Transitions',
    title_ar: 'انتقالات الصفحات المتحركة',
    description_de: 'Smooth Seitenübergänge via View Transitions API — kein Framework, kein Layout-Shift, kein Performance-Impact.',
    description_en: 'Smooth page transitions via View Transitions API — no framework, no layout shift, no performance impact.',
    description_ar: 'انتقالات سلسة بين الصفحات باستخدام View Transitions API بدون مكتبات.',
    phase_label_de: 'Phase 3',
    phase_label_en: 'Phase 3',
    phase_label_ar: 'المرحلة 3',
    status: 'planned',
    sort_order: 80,
  },
  {
    scope: 'portfolio',
    project_slug: null,
    title_de: 'ES Modules Migration',
    title_en: 'ES Modules Migration',
    title_ar: 'ترحيل وحدات ES',
    description_de: 'Umstieg auf native ES Modules im Browser — saubere Scope-Isolation, kein globaler Window-Clutter, ohne Bundler.',
    description_en: 'Switch to native ES Modules in the browser — clean scope isolation, no global window clutter, no bundler needed.',
    description_ar: 'التحول إلى وحدات ES الأصلية في المتصفح لعزل النطاق بشكل نظيف.',
    phase_label_de: 'Phase 3',
    phase_label_en: 'Phase 3',
    phase_label_ar: 'المرحلة 3',
    status: 'planned',
    sort_order: 90,
  },
]

// ─── Sort-Order der bestehenden (alten) Einträge ─────────────────────────────
// Diese Einträge existieren schon in Supabase und werden NICHT überschrieben —
// nur ihr sort_order wird gesetzt, damit es keine Kollisionen gibt.
// (Vorher: Dark Mode=10, Blog/Thoughts=20 [Kollision!], AR=30 [Kollision!])
const OLD_ENTRY_SORT = [
  { title_de: 'Dark Mode', sort_order: 60 },
  { title_de: 'Blog / Thoughts', sort_order: 70 },
  { title_de: 'Arabisch (AR) — Dritte Sprache', sort_order: 100 },
]

// ─── 3. Changelog-Einträge ────────────────────────────────────────────────────
//
// Dokumentiert was auf BETAPortfolioBach tatsächlich gebaut wurde.
// Versionen werden übersprungen wenn sie schon existieren.
// Zum Ergänzen alter Einträge vom alten Live-System: einfach mehr Einträge
// vor v1.0.0 einfügen und Script erneut ausführen (Duplikat-Check per version).

const CHANGELOG_ENTRIES = [
  {
    version: 'v1.0.0',
    date: '2026-05-25',
    category: 'refactor',
    title_de: 'Architektur & TypeScript Migration',
    title_en: 'Architecture & TypeScript Migration',
    title_ar: 'هجرة البنية وTypeScript',
    description_de: 'Migration von statischem HTML zur datengetriebenen Engine. CSS in 6 Module aufgeteilt (2338 → 931 Zeilen main.css), project-base.css für alle Projektseiten, Web Components (app-header, app-footer, app-project-header), Inline-CSS eliminiert, lightbox.ts extrahiert. Kein Duplikat-Code mehr.',
    description_en: 'Migration from static HTML to a data-driven engine. CSS split into 6 modules (2338 → 931 lines main.css), project-base.css for all project pages, Web Components (app-header, app-footer, app-project-header), inline CSS eliminated, lightbox.ts extracted. No duplicate code.',
    description_ar: 'انتقال من HTML ثابت إلى محرك مدفوع بالبيانات. تقسيم CSS إلى 6 وحدات، مكونات الويب، إزالة التكرار في الكود.',
  },
  {
    version: 'v1.1.0',
    date: '2026-05-26',
    category: 'feature',
    title_de: 'Admin Panel — Infrastruktur & Kern-Features',
    title_en: 'Admin Panel — Infrastructure & Core Features',
    title_ar: 'لوحة الإدارة — البنية التحتية والميزات الأساسية',
    description_de: 'Admin Panel live auf admin.yusefbach.de (Vercel + Next.js + Supabase). GitHub OAuth Login. Maintenance Mode mit Notfall-Knopf, Multi-Sprache (DE/EN/AR), RTL, 30s-Polling. System Health Dashboard. Bot Memory Editor (yusef_brain.md). Translations Manager (DE/EN/AR, ~491 Keys).',
    description_en: 'Admin panel live at admin.yusefbach.de (Vercel + Next.js + Supabase). GitHub OAuth login. Maintenance Mode with emergency button, multi-language (DE/EN/AR), RTL, 30s polling. System Health dashboard. Bot Memory editor (yusef_brain.md). Translations Manager (DE/EN/AR, ~491 keys).',
    description_ar: 'لوحة الإدارة حية على admin.yusefbach.de. تسجيل دخول GitHub OAuth. وضع الصيانة مع زر الطوارئ ودعم RTL. لوحة صحة النظام. محرر ذاكرة البوت. إدارة الترجمات.',
  },
  {
    version: 'v1.2.0',
    date: '2026-05-28',
    category: 'feature',
    title_de: 'Projects & Media Manager',
    title_en: 'Projects & Media Manager',
    title_ar: 'إدارة المشاريع والوسائط',
    description_de: 'Projects CRUD: Admin UI für alle 5 Projekte, dynamischer Renderer (js/projects-data.js), Prerender für SEO, Build-Pipeline via GitHub Action. Media Manager v2: Repo-first Uploads, Admin-Commit-Flow, CV-Verwaltung, Supabase Storage Integration.',
    description_en: 'Projects CRUD: admin UI for all 5 projects, dynamic renderer (js/projects-data.js), prerender for SEO, build pipeline via GitHub Action. Media Manager v2: repo-first uploads, admin commit flow, CV management, Supabase Storage integration.',
    description_ar: 'إدارة المشاريع: واجهة مستخدم للتحكم في جميع المشاريع الخمسة مع عرض ديناميكي. إدارة الوسائط: رفع الصور والمستندات.',
  },
  {
    version: 'v1.3.0',
    date: '2026-05-29',
    category: 'feature',
    title_de: 'Roadmap & Changelog System',
    title_en: 'Roadmap & Changelog System',
    title_ar: 'نظام خارطة الطريق وسجل التغييرات',
    description_de: 'Vollständiges Roadmap-System: Supabase-gesteuert, Scope-Logik (Portfolio + Projekte), Prerender für SEO, Client-Renderer mit DE/EN/AR. Changelog-Komponente mit Kategorie-Badges. Admin: Drag & Drop Sortierung, "→ CL" Button, AR-Felder im Draft-Modal.',
    description_en: 'Full roadmap system: Supabase-driven, scope logic (portfolio + projects), prerender for SEO, client renderer with DE/EN/AR. Changelog component with category badges. Admin: drag & drop sorting, "→ CL" button, AR fields in the draft modal.',
    description_ar: 'نظام خارطة طريق كامل مدفوع بـ Supabase مع منطق النطاق للمحفظة والمشاريع، وعرض متعدد اللغات. مكون سجل التغييرات مع شارات الفئات.',
  },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

// Idempotent: existiert der Eintrag (scope + project_slug + title_de) schon,
// wird er per PATCH aktualisiert statt ein Duplikat zu erzeugen.
async function upsertRoadmapEntry(entry) {
  const slugFilter = entry.project_slug
    ? `&project_slug=eq.${encodeURIComponent(entry.project_slug)}`
    : '&project_slug=is.null'
  const existing = await sbGet(
    `roadmap?scope=eq.${entry.scope}${slugFilter}&title_de=eq.${encodeURIComponent(entry.title_de)}&select=id`
  )
  if (existing.length > 0) {
    await sbPatch(`roadmap?id=eq.${existing[0].id}`, entry)
    return 'updated'
  }
  await sbPost('roadmap', entry)
  return 'inserted'
}

async function syncRoadmapEntries() {
  let count = 0
  for (const entry of NEW_ROADMAP_ENTRIES) {
    try {
      const action = await upsertRoadmapEntry(entry)
      console.log(`   ✓ [${entry.status.padEnd(11)}] ${entry.title_de}  (${action})`)
      count++
    } catch (err) {
      console.warn(`   ⚠ ${entry.title_de}: ${err.message}`)
    }
  }
  return count
}

// Setzt nur sort_order der bestehenden alten Einträge (kein Content-Overwrite).
async function applyOldSortOrders() {
  for (const o of OLD_ENTRY_SORT) {
    try {
      const found = await sbGet(
        `roadmap?scope=eq.portfolio&project_slug=is.null&title_de=eq.${encodeURIComponent(o.title_de)}&select=id`
      )
      if (!found.length) { console.log(`   → "${o.title_de}" nicht gefunden — übersprungen`); continue }
      await sbPatch(`roadmap?id=eq.${found[0].id}`, { sort_order: o.sort_order })
      console.log(`   ✓ sort_order=${o.sort_order} → "${o.title_de}"`)
    } catch (err) {
      console.warn(`   ⚠ ${o.title_de}: ${err.message}`)
    }
  }
}

// Löscht veraltete / fälschlich vorhandene Einträge.
async function deleteStaleEntries() {
  // (a) "Architecture & TypeScript" als completed-Roadmap-Eintrag —
  //     ist bereits als Changelog v1.0.0 dokumentiert → raus aus der Roadmap.
  const arch = await sbGet(
    `roadmap?scope=eq.portfolio&status=eq.completed&title_de=eq.${encodeURIComponent('Architecture & TypeScript')}&select=id,title_de`
  )
  for (const e of arch) {
    await sbDelete(`roadmap?id=eq.${e.id}`)
    console.log(`   ✓ Gelöscht (lebt als Changelog v1.0.0): "${e.title_de}"`)
  }
  // (b) Leftover Test-Eintrag "tests" auf der StudyNexus-Projektseite.
  const tests = await sbGet(
    `roadmap?scope=eq.project&project_slug=eq.studynexus&title_de=eq.tests&select=id,title_de`
  )
  for (const e of tests) {
    await sbDelete(`roadmap?id=eq.${e.id}`)
    console.log(`   ✓ Gelöscht (Test-Leftover): "${e.title_de}"`)
  }
  if (!arch.length && !tests.length) console.log('   Keine veralteten Einträge gefunden')
}

async function insertChangelogEntries() {
  let count = 0
  for (const entry of CHANGELOG_ENTRIES) {
    try {
      const existing = await sbGet(`changelog?version=eq.${encodeURIComponent(entry.version)}&select=id`)
      if (existing.length > 0) {
        console.log(`   → ${entry.version} schon vorhanden — übersprungen`)
        continue
      }
      // Seed dokumentiert nur bereits gelieferte Releases → direkt veröffentlicht.
      await sbPost('changelog', { ...entry, published: true })
      console.log(`   ✓ ${entry.version}  ${entry.title_de}`)
      count++
    } catch (err) {
      console.warn(`   ⚠ ${entry.version}: ${err.message}`)
    }
  }
  return count
}

async function main() {
  console.log('🧹  Lösche Test-Einträge...')
  await deleteTestEntries()
  await deleteStaleEntries()

  console.log('\n📝  Synchronisiere Roadmap-Einträge (idempotent)...')
  const roadmapCount = await syncRoadmapEntries()

  console.log('\n🔢  Setze sort_order der bestehenden Einträge (Kollisionen auflösen)...')
  await applyOldSortOrders()

  console.log('\n📋  Füge Changelog-Einträge ein...')
  const changelogCount = await insertChangelogEntries()

  console.log(`\n✅  Fertig — ${roadmapCount} Roadmap synchronisiert + ${changelogCount} neue Changelog Einträge`)
  console.log('\n💡  Nächste Schritte (lokal, damit 127.0.0.1:5501 die Änderungen sieht):')
  console.log('   node scripts/build-roadmap.mjs && node scripts/prerender-roadmap.js')
  console.log('\n📌  Hinweis: "Architecture & TypeScript" wurde aus der Roadmap entfernt')
  console.log('   (ist als Changelog v1.0.0 dokumentiert). NICHT erneut "→ CL" drücken,')
  console.log('   sonst entsteht eine doppelte Changelog-Zeile.')
}

main().catch(e => {
  console.error('❌  Fehler:', e.message)
  process.exit(1)
})
