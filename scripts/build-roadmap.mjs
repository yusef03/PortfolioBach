/**
 * build-roadmap.mjs
 *
 * Liest alle Roadmap-Einträge + Changelog-Einträge aus Supabase und schreibt:
 *   js/roadmap-data.js
 *
 * Wird von der GitHub Action publish-roadmap.yml aufgerufen.
 * Danach läuft prerender.js (injiziert Roadmap in roadmap.html + alle Projektseiten).
 *
 * Lokal testen (aus BETAPortfolioBach/):
 *   node scripts/build-roadmap.mjs
 *
 * Benötigt Env-Vars:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { writeFileSync, mkdirSync, readFileSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const JS_DIR = resolve(__dir, '../website/js')

// Env lokal laden (In GitHub Action kommen sie aus Secrets)
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
    } catch { /* nicht gefunden, weiter */ }
  }
}

if (!process.env.SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  loadEnvLocal()
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌  SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY nicht gefunden.')
  console.error('    Lege eine .env.local in portfolio-admin/ oder BETAPortfolioBach/ an.')
  process.exit(1)
}

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
}

async function fetchRoadmap() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/roadmap?select=*&order=scope.asc,project_slug.asc,sort_order.asc,id.asc`,
    { headers: HEADERS }
  )
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Supabase roadmap Fehler ${res.status}: ${body}`)
  }
  return res.json()
}

async function fetchChangelog() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/changelog?select=*&published=eq.true&order=date.desc,version.desc`,
    { headers: HEADERS }
  )
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Supabase changelog Fehler ${res.status}: ${body}`)
  }
  return res.json()
}

// ─── Roadmap-aktivierte Projektseiten erkennen ────────────────────────────────

/**
 * Scannt projects/*.html nach <div id="roadmap-project-<slug>"> Containern.
 * Gibt die Liste der Slugs zurück, die wirklich einen Roadmap-Bereich haben.
 * → Wird als settings.roadmap_enabled_slugs in Supabase gespeichert.
 * → Das Admin-Dropdown filtert genau auf diese Liste.
 */
function detectRoadmapSlugs() {
  const PROJECTS_DIR = resolve(__dir, '../projects')
  const slugs = []
  try {
    const files = readdirSync(PROJECTS_DIR).filter(f => f.endsWith('.html') && !f.startsWith('_'))
    for (const file of files) {
      const content = readFileSync(resolve(PROJECTS_DIR, file), 'utf-8')
      const match = content.match(/id="roadmap-project-([a-z0-9_-]+)"/)
      if (match) slugs.push(match[1])
    }
  } catch (err) {
    console.warn('   ⚠ HTML-Scan fehlgeschlagen:', err.message)
  }
  return [...new Set(slugs)]
}

async function syncEnabledSlugs(slugs) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/settings`, {
      method: 'POST',
      headers: {
        ...HEADERS,
        'Prefer': 'return=minimal,resolution=merge-duplicates',
      },
      body: JSON.stringify({
        key: 'roadmap_enabled_slugs',
        value: slugs,
        updated_at: new Date().toISOString(),
      }),
    })
    if (!res.ok) {
      const txt = await res.text()
      console.warn(`   ⚠ settings-Sync fehlgeschlagen: ${txt}`)
    }
  } catch (err) {
    console.warn('   ⚠ settings-Sync Error:', err.message)
  }
}

// ─────────────────────────────────────────────────────────────────────────────

function escapeJs(str) {
  if (str === null || str === undefined) return ''
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${')
}

function roadmapEntryToJs(e) {
  return `  {
    id: ${JSON.stringify(e.id)},
    scope: ${JSON.stringify(e.scope)},
    project_slug: ${JSON.stringify(e.project_slug ?? null)},
    title_de: \`${escapeJs(e.title_de)}\`,
    title_en: \`${escapeJs(e.title_en)}\`,
    title_ar: \`${escapeJs(e.title_ar)}\`,
    description_de: \`${escapeJs(e.description_de)}\`,
    description_en: \`${escapeJs(e.description_en)}\`,
    description_ar: \`${escapeJs(e.description_ar)}\`,
    phase_label_de: \`${escapeJs(e.phase_label_de)}\`,
    phase_label_en: \`${escapeJs(e.phase_label_en)}\`,
    phase_label_ar: \`${escapeJs(e.phase_label_ar)}\`,
    status: ${JSON.stringify(e.status)},
    sort_order: ${e.sort_order ?? 0}
  }`
}

function changelogEntryToJs(e) {
  return `  {
    id: ${JSON.stringify(e.id)},
    version: ${JSON.stringify(e.version)},
    date: ${JSON.stringify(e.date)},
    category: ${JSON.stringify(e.category)},
    title_de: \`${escapeJs(e.title_de)}\`,
    title_en: \`${escapeJs(e.title_en)}\`,
    title_ar: \`${escapeJs(e.title_ar)}\`,
    description_de: \`${escapeJs(e.description_de)}\`,
    description_en: \`${escapeJs(e.description_en)}\`,
    description_ar: \`${escapeJs(e.description_ar)}\`
  }`
}

async function main() {
  console.log('📥  Lade Roadmap-Einträge aus Supabase…')
  const roadmap = await fetchRoadmap()
  console.log(`   ${roadmap.length} Roadmap-Einträge geladen`)

  console.log('📥  Lade Changelog-Einträge aus Supabase…')
  const changelog = await fetchChangelog()
  console.log(`   ${changelog.length} Changelog-Einträge geladen`)

  const roadmapJs = roadmap.map(roadmapEntryToJs).join(',\n')
  const changelogJs = changelog.map(changelogEntryToJs).join(',\n')

  // Scope-Statistik
  const portfolioCount = roadmap.filter(e => e.scope === 'portfolio').length
  const projectSlugs = [...new Set(roadmap.filter(e => e.scope === 'project').map(e => e.project_slug))]

  const output = `// AUTO-GENERIERT aus Supabase via scripts/build-roadmap.mjs — NICHT manuell editieren!
// Letzte Aktualisierung: ${new Date().toISOString()}

const roadmapData = [
${roadmapJs}
];

const changelogData = [
${changelogJs}
];
`

  mkdirSync(JS_DIR, { recursive: true })
  writeFileSync(resolve(JS_DIR, 'roadmap-data.js'), output, 'utf-8')

  console.log('✅  js/roadmap-data.js geschrieben')
  console.log(`   Portfolio: ${portfolioCount} Einträge | Projekte: ${projectSlugs.join(', ') || '–'}`)
  console.log(`   Changelog: ${changelog.length} Releases`)

  // Auto-Sync: welche Projektseiten haben einen Roadmap-Bereich?
  console.log('\n🔍  Scanne Projektseiten nach Roadmap-Containern…')
  const enabledSlugs = detectRoadmapSlugs()
  console.log(`   Roadmap-aktiviert: ${enabledSlugs.join(', ') || '–'}`)
  await syncEnabledSlugs(enabledSlugs)
  console.log('   ✓ settings.roadmap_enabled_slugs → Supabase aktualisiert')
  console.log('\n💡  Neues Projekt aktivieren: roadmap-project-<slug> Container in die Projektseite')
  console.log('   einbauen → nächster Build → erscheint automatisch im Admin-Dropdown.')
}

main().catch(e => {
  console.error('❌  Fehler:', e.message)
  process.exit(1)
})
