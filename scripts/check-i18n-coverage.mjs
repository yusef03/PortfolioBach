/**
 * check-i18n-coverage.mjs — i18n-Guard
 *
 * Findet sichtbaren, hartkodierten Text in HTML-Seiten, der KEIN data-i18n trägt
 * und daher beim Sprachwechsel (EN/AR) auf Deutsch hängenbleibt.
 *
 * Zweck: verhindert, dass neue Seiten/Abschnitte ohne Übersetzung ins Repo kommen.
 *
 * Nutzung:
 *   node scripts/check-i18n-coverage.mjs            # Report (Exit 0)
 *   node scripts/check-i18n-coverage.mjs --strict   # Exit 1 wenn Funde (für CI/Hooks)
 *
 * Was wird IGNORIERT (bewusst, kein i18n nötig):
 *   - <script>, <style>, <code>, <pre>, <svg>  (Code/Technik)
 *   - Elemente mit data-i18n / data-i18n-placeholder (oder ein Vorfahr damit)
 *   - dynamisch gerenderte Bereiche (PRERENDER-Marker, bekannte Renderer-Container)
 *   - reine Tech-Begriffe / Eigennamen (Whitelist)
 *   - reine Zahlen, Symbole, Code-artige Tokens
 *
 * ACHTUNG: Heuristik, kein Parser-Ersatz. Lieber ein paar False Positives
 * (Tech-Begriffe) als echte deutsche Sätze zu übersehen.
 */

import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir  = dirname(fileURLToPath(import.meta.url))
const ROOT   = resolve(__dir, '..')
const WEBROOT = resolve(ROOT, 'website')

const STRICT = process.argv.includes('--strict')

// ── Seiten die geprüft werden (Impressum + Datenschutz = rechtlich, DE-only) ──
const PAGES = [
  'index.html', 'roadmap.html', '404.html', 'thanks.html',
  'projects/archive.html',
  'projects/studynexus.html', 'projects/phishing-defender.html',
  'projects/portfolio-meta.html', 'projects/html-cv.html',
  'projects/community-software.html',
  'thoughts/index.html',
]

// ── Sichtbare Text-Tags (deren Inhalt übersetzt werden sollte) ────────────────
const TEXT_TAGS = new Set([
  'h1','h2','h3','h4','h5','h6','p','span','a','button','li','label',
  'option','strong','em','figcaption','blockquote','td','th','small',
])

// Tags deren Inhalt NIE i18n braucht
const SKIP_TAGS = new Set(['script','style','noscript','svg','path','code','pre'])

// ── Container, deren Inhalt zur Laufzeit dynamisch (sprachbewusst) gerendert wird ──
// Diese werden via Renderer (project-renderer / roadmap-renderer / thoughts-renderer)
// bei 'languagechange' neu aufgebaut — der statische Inhalt ist nur SEO-Prerender.
const DYNAMIC_CONTAINER_IDS = [
  'hero-container', 'projects-container', 'archive-container',  // project-renderer
  'roadmap-global-zone', 'changelog-zone',                       // roadmap-renderer
  'thoughts-teaser-grid', 'thoughts-grid',                       // thoughts-renderer
]

// PRERENDER-Marker-Bereiche überspringen (zwischen START/END)
// Regex erlaubt Bindestriche: z.B. PRERENDER_ROADMAP_HTML-CV_START
const PRERENDER_RE = /<!--\s*PRERENDER_[A-Z0-9_-]+_START\s*-->[\s\S]*?<!--\s*PRERENDER_[A-Z0-9_-]+_END\s*-->/g

// ── Whitelist: Tech-Begriffe / Eigennamen die auf EN bleiben dürfen ───────────
const TECH_WHITELIST = [
  /^[A-Z][a-z]+\.?(js|ts|py|sh|exe|jar|json|yml|html|css|md)$/i, // Datei.endung
  /^(java|lua|javascript|typescript|python|html5?|css3?|sql|linux|git|docker|redis|postgresql|postgres|node|react|next\.?js|fastapi|vercel|supabase|github|vs code|claude|llms?|jwt|csrf|cors|orm|api|adr|ects|gpa|hsh|mvc|rag|pwa|seo|dns|ui|ux|kpi|ttl|fk|pk|sws|po|bin|kanban|redis|uvicorn|asgi|pydantic|bcrypt|passlib|alembic|recharts|tanstack|sqlalchemy|@dnd-kit|httponly|samesite|edge runtime|java swing|swing worker)$/i,
  /^v?\d+(\.\d+)*([.\-][a-z0-9]+)*$/i,  // Versionen v1.2.0, 4.1.3
  /^v\d+.*\.(jar|exe)$/i,               // v2.1.0 • Universal .jar etc.
  /^native\s*\.(exe|jar)$/i,            // "Native .exe"
  /^\d+%\s*(pure\s*)?java\.?$/i,        // "100% Pure Java."
  /^UC\s*\d+$/i,                        // UC 04
  /^DOC-ID:/i,                          // DOC-ID: 8842-X
  /^HTML\d+\s*\/\s*CSS\d+$/i,           // HTML5 / CSS3
  /^🔍/u,                               // 🔍 CV, 🔍 Letter (gallery labels)
  /^--(.*)/,                            // Lua/SQL code comments
  /^'.+'/,                              // Quoted code strings
  /^"[A-Za-z]+"/,                       // "Success", "hero-container" etc.
  /^[🚀⚡✓✗→←↑↓·•📁📄📂⚙️🔍🔒🗺️]+$/u,  // Symbole/Emojis
]

// Muster die IMMER als Code/Tech gelten, auch mit Leerzeichen
const CODE_ALWAYS = [
  /^--/,                   // SQL/Lua Kommentare: -- Handling...
  /^\/\//,                 // JS/TS Kommentare: // Core Function...
  /^'\S.*'$/,              // Single-quoted Strings: 'core:updatePlayerState'
  /^"\S[^"]*"$/,           // Double-quoted Strings: "Success"
  /^`/,                    // Template Literals
  /^\[/,                   // Array-Zugriffe: [@state]
  /^\d+%\s+/,              // "100% Pure Java."
  /^UC\s+\d+/i,            // UC 04
  /^DOC-ID:/i,             // DOC-ID: 8842-X
  /^\d+\.\d+.*\.(jar|exe)/i,    // "v2.1.0 • Universal .jar"
  /^v\d+.*\.(jar|exe)/i,        // "v2.1.0 • Universal .jar" (mit v-Prefix)
  /\w+\s+•\s+.*\.(jar|exe)/i,  // "Universal • .jar" style
  /^native\s+\./i,              // "Native .exe"
  /^🔍/u,                       // Gallery-Labels: 🔍 CV
  // Tech-Badges mit Leerzeichen die keine Sätze sind
  /^(java swing|core logic|html\d+\s*\/\s*css\d*|build v|pure java)/i,
  // Docker/Service Labels: "Next.js 14 · App Router", "FastAPI · Uvicorn · ASGI" etc.
  /^(next\.?js|fastapi|postgresql|redis|pydantic|openapi|samesite|python \d)/i,
  // HTTP Methoden / API-Endpunkte
  /^(GET|POST|PUT|DELETE|PATCH|HEAD)\s+\//i,
  // API-Aktionen in ALL_CAPS
  /^(ARCHIVE|RESET|DELETE|BLOCK|BAN|APPROVE)\s+/i,
  // Layer Labels: "Layer 1 — get_admin_user"
  /^Layer \d/i,
  // Tech Counts/Stats: "22 Interfaces", "11 Hooks", "0 TS-", "+2 mehr", "· 26 Module"
  /^[\+·]?\d+\s*(mehr|interfaces|hooks|ts-|module)/i,
  // Section Numbers: "01 — Analytics", "02 — User Management"
  /^\d{2}\s+—\s+/,
  // Tech feature labels: "debounced Search", "filter: entity/action", "health check", "auto-refresh"
  /^(debounced|filter:|health check|auto-refresh|db admin|json-import|soft delete)/i,
  // DB Felder: "name, kuerzel, stadt", "abschluss, gesamt_ects" etc.
  /^[a-z_]+,\s+[a-z_]/,
  // Kanban/Priority Labels
  /^(to do|in progress|exam ready|low|med|high|done)(\s*[·×]\s*|$)/i,
  /^low\s*·\s*med/i,
  // TTL/Latency Values
  /^\d+min ttl|^zero db/i,
  // "atob() + Base64url", "SameSite=Lax", "Health ✓"
  /^atob\(\)|^samesite=/i,
  /^health\s+[✓✗]/u,
  /^pytest /i,
  // "+2 mehr" style truncation badges
  /^\+\d+\s*(mehr|more|أكثر)/,
  // Health-Status Badges
  /^health\s*/i,
  // @library-name references
  /^@[a-z]/i,
  // Component names with generics: AdminDataTable<T>
  /AdminDataTable/i,
  // Abkürzung + Zahlen wie "· 26 Module" → durch data-i18n behandelt
  // Verbleibende index.html-Tech-Labels (hero-Abschnitt, Tech-Stack-Icons)
  /^(ai developer|vs code|react\s*\/|claude\s*\/)/i,
  // Arrow-Entities
  /^(&rarr;|→|←|↑|↓|►|◄)$/,
  // Semantische Git-Commit-Präfixe (refactor:, feat:, fix:, merge:, chore:)
  /^(refactor|feat|fix|merge|chore|docs|test|style|ci):/i,
  // Ordner-Baum-Zeichen
  /^[│├└─\s📁📄📂]+/u,
  // Tech-Werte in Diagrammen/Karten
  /^(ttl:|~\d|type|host|prio|value|cname|cname$)/i,
  // Klammer-Deskriptoren in Diagrammen: (Glassmorphism), (Context JSON) etc.
  /^\([A-Za-z\s]+\)$/,
  // CSS-Werte: translate3d(0,0,0), will-change etc.
  /^translate[^)]*\)|^will-change|^transform$/i,
  // Folder-tree mit nbsp-Einrückung
  /^(&nbsp;|\s)+[├└]/,
  /^\s{2,}[├└]/,
  // Nested-i18n-Labels: Elemente wie <strong>Früher:</strong> die INNEN
  // in bereits übersetzten <li data-i18n> Eltern liegen. Heuristik: Text endet mit ':'
  /^[A-ZÄÖÜa-zäöü][^:]{1,25}:$/,
]

function isWhitelisted(text) {
  const t = text.trim()
  if (t.length < 2) return true
  // kein lateinischer/arabischer Buchstabe → kein echter Satz
  if (!/[A-Za-zÀ-ÿ؀-ۿ]/.test(t)) return true
  // Code-Muster (auch mit Leerzeichen)
  for (const re of CODE_ALWAYS) if (re.test(t)) return true
  // reiner Tech-Token (ein "Wort", evtl. mit . / - _)
  if (/^[\w.\-/@:]+$/.test(t)) {
    for (const re of TECH_WHITELIST) if (re.test(t)) return true
    // Einzeltoken ohne Leerzeichen und ohne Umlaut → meist Code/Tech
    if (!/\s/.test(t) && !/[äöüßÀ-ÿ؀-ۿ]/.test(t)) return true
  }
  return false
}

// ── Mini-HTML-Scanner (kein DOM, regex-basiert, robust genug für den Guard) ───
function scanPage(html) {
  // dynamische + prerender Bereiche entfernen
  let cleaned = html.replace(PRERENDER_RE, '')
  for (const id of DYNAMIC_CONTAINER_IDS) {
    // grob: Inhalt eines Containers mit dieser id entfernen (greedy bis schließendes Tag-Heuristik)
    const re = new RegExp(`(id=["']${id}["'][^>]*>)[\\s\\S]*?(<\\/)`, 'g')
    cleaned = cleaned.replace(re, '$1$2')
  }

  const findings = []
  // SKIP-Tag-Blöcke entfernen
  for (const tag of SKIP_TAGS) {
    const re = new RegExp(`<${tag}[\\s\\S]*?<\\/${tag}>`, 'gi')
    cleaned = cleaned.replace(re, '')
  }

  // grobe Tokenisierung: finde >TEXT< Segmente
  const segRe = /<([a-z0-9]+)([^>]*)>([^<]+)</gi
  let m
  while ((m = segRe.exec(cleaned)) !== null) {
    const tag   = m[1].toLowerCase()
    const attrs = m[2]
    const text  = m[3].trim()
    if (!TEXT_TAGS.has(tag)) continue
    if (/data-i18n/.test(attrs)) continue
    if (!text) continue
    if (isWhitelisted(text)) continue
    findings.push({ tag, text: text.slice(0, 80) })
  }
  return findings
}

// ── Main ──────────────────────────────────────────────────────────────────────
let total = 0
const report = []

for (const page of PAGES) {
  const path = resolve(WEBROOT, page)
  if (!existsSync(path)) { report.push(`  ⚠️  ${page} — nicht gefunden`); continue }
  const html = readFileSync(path, 'utf-8')
  const findings = scanPage(html)
  if (findings.length) {
    total += findings.length
    report.push(`\n  ❌ ${page} — ${findings.length} ohne data-i18n:`)
    const seen = new Set()
    for (const f of findings) {
      const key = `${f.tag}|${f.text}`
      if (seen.has(key)) continue
      seen.add(key)
      report.push(`       <${f.tag}> ${JSON.stringify(f.text)}`)
    }
  }
}

console.log('🌐  i18n-Coverage-Check')
if (total === 0) {
  console.log('  ✅ Alle geprüften Seiten sind sauber (kein hartkodierter Text).')
} else {
  console.log(report.join('\n'))
  console.log(`\n  Summe: ${total} potenziell hartkodierte Texte.`)
  console.log('  → data-i18n="key" ergänzen + Key in lang/{de,en,ar}.json eintragen.')
  console.log('  (Tech-Begriffe/Eigennamen sind via Whitelist ausgenommen; bei False Positives Whitelist erweitern.)')
}

if (STRICT && total > 0) process.exit(1)
