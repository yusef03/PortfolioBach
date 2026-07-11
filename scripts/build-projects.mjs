/**
 * build-projects.mjs
 *
 * Liest alle Projekte + GitHub-Karte aus Supabase und schreibt:
 *   js/projects-data.js
 *
 * Wird von der GitHub Action publish-projects.yml aufgerufen.
 * Danach läuft prerender.js (liest die generierte Datei und aktualisiert HTML).
 *
 * Lokal testen (aus BETAPortfolioBach/):
 *   node scripts/build-projects.mjs
 *
 * Benötigt Env-Vars:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { writeFileSync, mkdirSync, readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const JS_DIR = resolve(__dir, '../website/js')

// Lokal: .env.local aus portfolio-admin (Geschwister-Verzeichnis) automatisch laden
// In der GitHub Action kommen die Vars aus den Secrets (process.env)
function loadEnvLocal() {
  const envPaths = [
    resolve(__dir, '../.env.local'),                           // BETAPortfolioBach/.env.local (falls vorhanden)
    resolve(__dir, '../../portfolio-admin/.env.local'),        // portfolio-admin/.env.local (Standard)
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

// Env laden wenn nötig (in GitHub Action sind sie schon gesetzt)
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

async function fetchProjects() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/projects?select=*&order=sort_order.asc`,
    { headers: HEADERS }
  )
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Supabase projects Fehler ${res.status}: ${body}`)
  }
  return res.json()
}

async function fetchGithubCard() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/settings?key=eq.archive_github_card&select=value`,
    { headers: HEADERS }
  )
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Supabase settings Fehler ${res.status}: ${body}`)
  }
  const data = await res.json()
  return data?.[0]?.value ?? null
}

function escapeJs(str) {
  if (str === null || str === undefined) return ''
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${')
}

function projectToJs(p) {
  const features = (p.features || [])
    .map(f => `{ de: \`${escapeJs(f.de)}\`, en: \`${escapeJs(f.en)}\`, ar: \`${escapeJs(f.ar)}\` }`)
    .join(',\n      ')

  const badges = (p.badges || []).map(b => JSON.stringify(b)).join(', ')

  return `  {
    id: ${JSON.stringify(p.id)},
    slug: ${JSON.stringify(p.slug)},
    title: ${JSON.stringify(p.title)},
    description_de: \`${escapeJs(p.description_de)}\`,
    description_en: \`${escapeJs(p.description_en)}\`,
    description_ar: \`${escapeJs(p.description_ar)}\`,
    badges: [${badges}],
    features: [${features ? '\n      ' + features + '\n    ' : ''}],
    status: ${JSON.stringify(p.status || 'active')},
    image_url: ${JSON.stringify(p.image_url || '')},
    github_url: ${JSON.stringify(p.github_url || null)},
    demo_url: ${JSON.stringify(p.demo_url || null)},
    subpage_url: ${JSON.stringify(p.subpage_url || null)},
    timeframe: ${JSON.stringify(p.timeframe || null)},
    role: ${JSON.stringify(p.role || null)},
    is_hero: ${!!p.is_hero},
    sort_order: ${p.sort_order ?? 0}
  }`
}

function githubCardToJs(card) {
  if (!card) {
    return `{
  title_de: 'Mehr auf GitHub', title_en: 'More on GitHub', title_ar: 'المزيد على GitHub',
  text_de: 'Schau dir meine aktuellen Repositories, Experimente und Code-Snippets an.',
  text_en: 'Check out my latest repositories, experiments and code snippets.',
  text_ar: 'تصفح مستودعاتي الحديثة وتجاربي البرمجية.',
  btn_de: 'Zum Profil', btn_en: 'To Profile', btn_ar: 'إلى الملف الشخصي',
  url: 'https://github.com/yusef03'
}`
  }
  return JSON.stringify(card, null, 2)
}

async function main() {
  console.log('📥  Lade Projekte aus Supabase…')
  const projects = await fetchProjects()
  console.log(`   ${projects.length} Projekte geladen`)

  const heroCount = projects.filter(p => p.is_hero).length
  if (heroCount === 0) console.warn('⚠️   Kein Hero-Projekt gesetzt! Erster Eintrag wird als Fallback genutzt.')
  if (heroCount > 1) console.warn(`⚠️   ${heroCount} Hero-Projekte gesetzt — nur eines erlaubt!`)

  console.log('📥  Lade GitHub-Karte aus Supabase…')
  const githubCard = await fetchGithubCard()
  if (!githubCard) console.warn('⚠️   Kein archive_github_card in settings — Fallback-Werte werden genutzt.')

  const projectsJs = projects.map(projectToJs).join(',\n')
  const githubCardJs = githubCardToJs(githubCard)

  const output = `// AUTO-GENERIERT aus Supabase via scripts/build-projects.mjs — NICHT manuell editieren!
// Letzte Aktualisierung: ${new Date().toISOString()}

const projectsData = [
${projectsJs}
];

const githubCard = ${githubCardJs};
`

  mkdirSync(JS_DIR, { recursive: true })
  writeFileSync(resolve(JS_DIR, 'projects-data.js'), output, 'utf-8')

  console.log('✅  js/projects-data.js geschrieben')
  console.log(`   ${projects.length} Projekte | Hero: ${projects.find(p => p.is_hero)?.slug ?? 'kein Hero'}`)
}

main().catch(e => {
  console.error('❌  Fehler:', e.message)
  process.exit(1)
})
