/**
 * build-thoughts.mjs — Multi-Sprachen-Version
 *
 * Ein Post = ein Row in DB (title_en/de/ar, content_en/de/ar)
 * Schritt 1: Fetch alle published Posts aus Supabase
 * Schritt 2: reading_minutes + excerpt-Fallbacks generieren
 * Schritt 3: js/thoughts-data.js schreiben (Metadaten aller Sprachen)
 * Schritt 4: Markdown → HTML (pro Sprache)
 * Schritt 5: thoughts/<slug>.html generieren (ALLE Sprachen eingebettet, Client-seitig umschaltbar)
 * Schritt 6: Orphan-Cleanup
 *
 * Lokal (aus BETAPortfolioBach/):
 *   node scripts/build-thoughts.mjs
 *
 * Benötigt: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 */

import { writeFileSync, readFileSync, mkdirSync, existsSync, unlinkSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { marked }          from 'marked'
import sanitizeHtml        from 'sanitize-html'

const __dir        = dirname(fileURLToPath(import.meta.url))
const ROOT         = resolve(__dir, '..')
const JS_DIR       = resolve(ROOT, 'website/js')
const THOUGHTS_DIR = resolve(ROOT, 'website/thoughts')
const TEMPLATE     = resolve(THOUGHTS_DIR, '_post-template.html')
const MANIFEST     = resolve(THOUGHTS_DIR, '.generated.json')

// ─── Env laden ────────────────────────────────────────────────────────────────

function loadEnvLocal() {
  const paths = [
    resolve(ROOT, '.env.local'),
    resolve(ROOT, '..', 'portfolio-admin', '.env.local'),
  ]
  for (const p of paths) {
    try {
      const content = readFileSync(p, 'utf-8')
      for (const line of content.split('\n')) {
        const t = line.trim()
        if (!t || t.startsWith('#')) continue
        const eq = t.indexOf('=')
        if (eq < 0) continue
        const key = t.slice(0, eq).trim()
        const val = t.slice(eq + 1).trim()
        if (key && !process.env[key]) process.env[key] = val
      }
      console.log(`   .env geladen: ${p}`)
      return
    } catch { /* nicht gefunden, weiter */ }
  }
}

if (!process.env.SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL) loadEnvLocal()

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌  SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY fehlen.')
  process.exit(1)
}

const HEADERS = {
  apikey:        SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
}

// ─── Supabase Fetch ───────────────────────────────────────────────────────────

async function fetchPublishedThoughts() {
  const url = `${SUPABASE_URL}/rest/v1/thoughts?select=*&status=eq.published&order=published_at.desc,id.asc`
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Supabase thoughts Fehler ${res.status}: ${body}`)
  }
  return res.json()
}

// ─── Text-Hilfsfunktionen ─────────────────────────────────────────────────────

function calcReadingMinutes(content) {
  if (!content) return 1
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

function stripMarkdown(content) {
  if (!content) return ''
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/!\[[^\]]*\]\([^\)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^\)]*\)/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/>\s*/g, '')
    .replace(/[-_*]{3,}/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function autoExcerpt(content, maxLen = 160) {
  const text = stripMarkdown(content)
  if (!text) return ''
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).replace(/\s\S*$/, '').trim() + '…'
}

// ─── HTML-Escaping ────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeJs(str) {
  return String(str ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${')
}

// ─── Markdown → HTML ──────────────────────────────────────────────────────────

const SANITIZE_OPTIONS = {
  allowedTags: [
    'h1','h2','h3','h4','h5','h6',
    'p','br','ul','ol','li',
    'blockquote','pre','code',
    'strong','em','b','i','u','s','del',
    'a','img','figure','figcaption',
    'table','thead','tbody','tr','th','td',
    'hr','div','span',
  ],
  allowedAttributes: {
    'a':           ['href','target','rel','title'],
    'img':         ['src','alt','title','loading','decoding','width','height','class','style'],
    'figure':      ['class'],
    'figcaption':  [],
    'code':        ['class'],
    'pre':         ['class'],
    'th':          ['align'],
    'td':          ['align'],
    '*':           ['id','class'],
  },
  allowedSchemes: ['http','https','mailto'],
}

function imgToFigure(html) {
  return html.replace(/<img([^>]*)>/gi, (_match, attrs) => {
    const titleMatch = attrs.match(/title="([^"]*)"/)
    const caption = titleMatch ? titleMatch[1] : ''
    let newAttrs = attrs
    if (!newAttrs.includes('loading='))  newAttrs += ' loading="lazy"'
    if (!newAttrs.includes('decoding=')) newAttrs += ' decoding="async"'
    if (newAttrs.includes('class=')) {
      newAttrs = newAttrs.replace(/class="([^"]*)"/, 'class="$1 zoomable-img"')
    } else {
      newAttrs += ' class="zoomable-img"'
    }
    const fig = caption ? `\n  <figcaption>${escapeHtml(caption)}</figcaption>` : ''
    return `<figure class="thought-figure reveal">\n  <img${newAttrs}>${fig}\n</figure>`
  })
}

function markdownToHtml(content) {
  if (!content) return ''
  const raw      = marked.parse(content, { gfm: true, breaks: false })
  const clean    = sanitizeHtml(raw, SANITIZE_OPTIONS)
  const withFigs = imgToFigure(clean)
  return withFigs
}

// ─── Datum formatieren ────────────────────────────────────────────────────────

function formatDate(isoDate, lang) {
  try {
    const d      = new Date(isoDate)
    const locale = lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-GB' : 'de-DE'
    return d.toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })
  } catch {
    return isoDate ?? ''
  }
}

// ─── js/thoughts-data.js schreiben ───────────────────────────────────────────

function writeThoughtsDataJs(posts) {
  const entries = posts.map(p => {
    const hasDe = Boolean(p.title_de)
    const hasAr = Boolean(p.title_ar)
    return `  {
    slug: ${JSON.stringify(p.slug)},
    title_en: \`${escapeJs(p.title_en)}\`,
    title_de: ${p.title_de ? `\`${escapeJs(p.title_de)}\`` : 'null'},
    title_ar: ${p.title_ar ? `\`${escapeJs(p.title_ar)}\`` : 'null'},
    excerpt_en: \`${escapeJs(p.excerpt_en ?? '')}\`,
    excerpt_de: ${p.excerpt_de ? `\`${escapeJs(p.excerpt_de)}\`` : 'null'},
    excerpt_ar: ${p.excerpt_ar ? `\`${escapeJs(p.excerpt_ar)}\`` : 'null'},
    cover_image_url: ${JSON.stringify(p.cover_image_url ?? null)},
    tags: ${JSON.stringify(p.tags ?? [])},
    reading_minutes: ${p.reading_minutes ?? 1},
    published_at: ${JSON.stringify(p.published_at ?? null)},
    has_de: ${hasDe},
    has_ar: ${hasAr}
  }`
  }).join(',\n')

  const output = `// AUTO-GENERIERT via scripts/build-thoughts.mjs — NICHT manuell editieren!
// Letzte Aktualisierung: ${new Date().toISOString()}
// Enthält NUR Metadaten (kein Content). Sortierung: published_at desc.

const thoughtsData = [
${entries}
];
`
  mkdirSync(JS_DIR, { recursive: true })
  writeFileSync(resolve(JS_DIR, 'thoughts-data.js'), output, 'utf-8')
  console.log(`✅  js/thoughts-data.js geschrieben (${posts.length} Posts)`)
}

// ─── Sprach-Blöcke für Post-Seite generieren ─────────────────────────────────

function buildLangBlocks(post) {
  const langs = ['en']
  if (post.title_de && post.content_de) langs.push('de')
  if (post.title_ar && post.content_ar) langs.push('ar')

  return langs.map(lang => {
    const title   = lang === 'en' ? post.title_en : lang === 'de' ? post.title_de : post.title_ar
    const content = lang === 'en' ? post.content_en : lang === 'de' ? post.content_de : post.content_ar
    const html    = markdownToHtml(content)
    const date    = formatDate(post.published_at ?? new Date().toISOString(), lang)
    const dirAttr = lang === 'ar' ? ' dir="rtl"' : ''

    const readingLabel = lang === 'ar' ? 'د. قراءة' : lang === 'en' ? 'min read' : 'Min. Lesezeit'
    const readingHtml  = post.reading_minutes
      ? `<span class="thought-meta-sep">·</span>
          <span class="thought-meta-reading">
            ${post.reading_minutes} <span data-i18n="thoughts_reading_min">${readingLabel}</span>
          </span>`
      : ''

    return `<div class="thought-lang-block" data-lang="${lang}"${dirAttr} hidden>
      <h1 class="thought-post-title">${escapeHtml(title)}</h1>
      <div class="thought-post-meta">
        <time datetime="${post.published_at ?? ''}" class="thought-meta-date">${date}</time>
        ${readingHtml}
      </div>
      <div class="thought-post-content reveal active">
        ${html}
      </div>
    </div>`
  }).join('\n')
}

// ─── Einzelne Post-Seite generieren ──────────────────────────────────────────

function buildPostPage(post, template) {
  // Für SEO: DE bevorzugen wenn vorhanden, sonst EN
  const seoTitle   = post.title_de   || post.title_en
  const seoExcerpt = post.excerpt_de || post.excerpt_en || autoExcerpt(post.content_en)
  const ogImage    = post.cover_image_url ?? 'https://yusefbach.de/images/ui/logo.png'
  const publishedIso = post.published_at ?? new Date().toISOString()

  const coverBlock = post.cover_image_url
    ? `<div class="thought-post-cover"><img src="${post.cover_image_url}" alt="${escapeHtml(seoTitle)}" class="thought-cover-img" loading="eager" /></div>`
    : '<div class="thought-post-cover thought-post-cover--gradient"></div>'

  const tagsHtml = Array.isArray(post.tags) && post.tags.length
    ? post.tags.map(t => `<span class="thought-tag">${escapeHtml(t)}</span>`).join('')
    : ''

  const langBlocks = buildLangBlocks(post)

  // Welche Sprachen sind verfügbar (für Sprach-Switch Script)
  const availableLangs = ['en']
  if (post.title_de && post.content_de) availableLangs.push('de')
  if (post.title_ar && post.content_ar) availableLangs.push('ar')
  const availableLangsJson = JSON.stringify(availableLangs)

  return template
    .replace(/\{\{TITLE\}\}/g,              escapeHtml(seoTitle))
    .replace(/\{\{TITLE_JSON\}\}/g,         JSON.stringify(seoTitle))
    .replace(/\{\{SLUG\}\}/g,               encodeURIComponent(post.slug))
    .replace(/\{\{EXCERPT\}\}/g,            escapeHtml(seoExcerpt))
    .replace(/\{\{OG_IMAGE\}\}/g,           ogImage)
    .replace(/\{\{PUBLISHED_AT_ISO\}\}/g,   publishedIso)
    .replace(/\{\{COVER_BLOCK\}\}/g,        coverBlock)
    .replace(/\{\{TAGS_HTML\}\}/g,          tagsHtml)
    .replace(/\{\{LANG_BLOCKS\}\}/g,        langBlocks)
    .replace(/\{\{AVAILABLE_LANGS\}\}/g,    availableLangsJson)
}

// ─── Orphan Cleanup ───────────────────────────────────────────────────────────

function loadManifest() {
  try { return JSON.parse(readFileSync(MANIFEST, 'utf-8')) } catch { return [] }
}

function saveManifest(slugs) {
  writeFileSync(MANIFEST, JSON.stringify(slugs, null, 2), 'utf-8')
}

function cleanupOrphans(currentSlugs) {
  const prev = loadManifest()
  const current = new Set(currentSlugs)
  let removed = 0
  for (const slug of prev) {
    if (current.has(slug)) continue
    const filePath = resolve(THOUGHTS_DIR, `${slug}.html`)
    if (existsSync(filePath)) {
      unlinkSync(filePath)
      console.log(`   🗑  Verwaiste Seite entfernt: thoughts/${slug}.html`)
      removed++
    }
  }
  if (removed === 0) console.log('   ✓  Keine verwaisten Seiten')
  return removed
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('📥  Lade published Thoughts aus Supabase…')
  const posts = await fetchPublishedThoughts()
  console.log(`   ${posts.length} Posts geladen`)

  if (!existsSync(TEMPLATE)) {
    console.error(`❌  Template nicht gefunden: ${TEMPLATE}`)
    process.exit(1)
  }
  const template = readFileSync(TEMPLATE, 'utf-8')

  // Schritt 2: reading_minutes + excerpt-Fallbacks ergänzen
  for (const p of posts) {
    if (!p.reading_minutes) p.reading_minutes = calcReadingMinutes(p.content_en)
    if (!p.excerpt_en) p.excerpt_en = autoExcerpt(p.content_en)
    if (p.content_de && !p.excerpt_de) p.excerpt_de = autoExcerpt(p.content_de)
    if (p.content_ar && !p.excerpt_ar) p.excerpt_ar = autoExcerpt(p.content_ar)
  }

  // Schritt 3: js/thoughts-data.js (nur Metadaten)
  writeThoughtsDataJs(posts)

  // Schritt 4+5: Seiten generieren
  mkdirSync(THOUGHTS_DIR, { recursive: true })
  const generatedSlugs = []

  for (const post of posts) {
    const html    = buildPostPage(post, template)
    const outPath = resolve(THOUGHTS_DIR, `${post.slug}.html`)
    writeFileSync(outPath, html, 'utf-8')
    generatedSlugs.push(post.slug)

    const langs = ['EN', post.title_de ? 'DE' : '', post.title_ar ? 'AR' : ''].filter(Boolean)
    console.log(`   📄  thoughts/${post.slug}.html [${langs.join('+')}]`)
  }

  // Schritt 6: Orphan-Cleanup
  console.log('\n🧹  Orphan-Cleanup…')
  cleanupOrphans(generatedSlugs)
  saveManifest(generatedSlugs)
  console.log(`   ✓  .generated.json aktualisiert (${generatedSlugs.length} Slugs)`)

  console.log(`\n✅  build-thoughts abgeschlossen — ${posts.length} Post(s) generiert`)
}

main().catch(e => {
  console.error('❌  Fehler:', e.message)
  process.exit(1)
})
