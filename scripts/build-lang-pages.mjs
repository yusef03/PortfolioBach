/**
 * build-lang-pages.mjs — Statisches Mehrsprachen-Pre-Rendering (SEO)
 *
 * Erzeugt aus den deutschen Quell-HTML-Dateien unter website/ vollständige,
 * statisch übersetzte Spiegelungen unter website/en/ und website/ar/.
 * Ziel: Google indexiert jede Sprache separat (eigene URL, eigener Text,
 * hreflang-verknüpft). Kein Framework, kein SSR — nur Node.js + cheerio (Build-Zeit).
 *
 * Pro Seite × Sprache:
 *   - alle data-i18n / data-i18n-placeholder / data-i18n-content mit en/ar-Werten füllen
 *   - <html lang> setzen, AR zusätzlich dir="rtl"
 *   - Asset-Pfade (css/js/fonts/images/lang/manifest/favicon) → absolut "/…"
 *   - interne Seiten-Links (.html, Verzeichnisse) → in der Sprache halten ("/en/…")
 *   - hreflang-Block (de/en/ar/x-default) + canonical injizieren
 *   - __PAGE_LANG__-Snippet sicherstellen (Runtime liest daraus die Sprache)
 *
 * Aufruf:  node scripts/build-lang-pages.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, rmSync, existsSync } from 'fs'
import { resolve, dirname, join, posix } from 'path'
import { fileURLToPath } from 'url'
import * as cheerio from 'cheerio'

const __dir = dirname(fileURLToPath(import.meta.url))
const ROOT  = resolve(__dir, '..')
const WEB   = join(ROOT, 'website')
const SITE  = 'https://yusefbach.de'
const LANGS = ['en', 'ar']

// Seiten, die NICHT gespiegelt werden.
//  - Impressum/Datenschutz: rechtlich DE-Dokumente (DE-only, kein SEO-Nutzen)
//  - Utility-Seiten ohne SEO-Wert / mit Sonderrolle
//  - Templates + Google-Verify-Datei
const EXCLUDE = new Set([
  'impressum.html',
  'datenschutz.html',
  '404.html',
  'maintenance.html',
  'thanks.html',
  'projects/_template.html',
  'thoughts/_post-template.html',
  'googlebd7900ffe59aa1d6.html',
])

// Asset-Verzeichnisse/Dateien, die sprachneutral im Root liegen → absolute Pfade.
const ASSET_PREFIXES = ['css/', 'js/', 'fonts/', 'images/', 'lang/']
const ASSET_FILES    = new Set(['manifest.json'])
const ASSET_EXT      = /\.(png|jpe?g|webp|svg|ico|gif|woff2?|ttf|json|xml|pdf|mp4|webm)$/i

// ─── lang-Dateien laden ───────────────────────────────────────────────────────
function loadDict(lang) {
  const p = join(WEB, 'lang', `${lang}.json`)
  return JSON.parse(readFileSync(p, 'utf-8'))
}

// ─── Alle Quell-HTML-Dateien einsammeln (rekursiv, ohne en/ ar/) ──────────────
function collectHtml(dir, base = '') {
  const out = []
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name)
    const rel = base ? posix.join(base, name) : name
    const st  = statSync(abs)
    if (st.isDirectory()) {
      if (name === 'en' || name === 'ar') continue
      out.push(...collectHtml(abs, rel))
    } else if (name.endsWith('.html') && !EXCLUDE.has(rel)) {
      out.push(rel)
    }
  }
  return out
}

// ─── URL-Helfer ───────────────────────────────────────────────────────────────
// rel "index.html" → "/", "projects/x.html" → "/projects/x.html"
function pathForRel(rel) {
  return rel === 'index.html' ? '/' : '/' + rel
}
function urlFor(lang, rel) {
  const p = pathForRel(rel)
  if (lang === 'de') return SITE + p
  return SITE + '/' + lang + (p === '/' ? '/' : p)
}

// ─── Pfad-Klassifikation ──────────────────────────────────────────────────────
function isAsset(target) {
  if (ASSET_FILES.has(target)) return true
  if (ASSET_PREFIXES.some(pre => target.startsWith(pre))) return true
  if (ASSET_EXT.test(target)) return true
  return false
}

// Löst einen relativen Link (aus Datei mit Verzeichnis srcDir) zu einem
// web-root-relativen Pfad auf. srcDir posix, z.B. "projects".
function resolveWebRel(srcDir, href) {
  const joined = srcDir ? posix.join(srcDir, href) : href
  return posix.normalize(joined)
}

// Schreibt einen Link-Attributwert für die Zielsprache um.
// Gibt den neuen Wert zurück (oder null = unverändert lassen).
function rewriteLink(value, srcDir, lang) {
  if (!value) return null
  const v = value.trim()
  // Externe / spezielle Schemata / schon absolute Pfade / reine Anker
  if (/^(https?:|mailto:|tel:|data:|#|\/\/|\/)/i.test(v)) return null

  // Hash abtrennen
  const hashIdx = v.indexOf('#')
  const hash = hashIdx >= 0 ? v.slice(hashIdx) : ''
  const pathPart = hashIdx >= 0 ? v.slice(0, hashIdx) : v
  if (!pathPart) return null // reiner Anker (#..) — schon oben gefiltert, safety

  const target = resolveWebRel(srcDir, pathPart) // web-root-relativ

  if (isAsset(target)) {
    return '/' + target + hash                    // sprachneutrales Asset → absolut Root
  }
  // Seiten-Link (.html oder Verzeichnis) → in der Sprache halten
  const isPage = /\.html$/i.test(target) || pathPart.endsWith('/')
  if (isPage) {
    let t = target
    if (pathPart.endsWith('/') && !t.endsWith('/')) t += '/'
    return '/' + lang + '/' + t + hash
  }
  return null
}

// ─── Twitter-Cards aus OG ableiten (X / LinkedIn / WhatsApp-Vorschau) ─────────
function twitterTags(title, desc, image) {
  const t = ['<meta name="twitter:card" content="summary_large_image" />']
  if (title) t.push(`<meta name="twitter:title" content="${title}" />`)
  if (desc)  t.push(`<meta name="twitter:description" content="${desc}" />`)
  if (image) t.push(`<meta name="twitter:image" content="${image}" />`)
  return t
}
function ogFromHtml(html, prop) {
  const m = html.match(new RegExp('<meta[^>]+property="og:' + prop + '"[^>]*content="([^"]*)"', 'i'))
  return m ? m[1] : ''
}

// ─── head-Injektion: hreflang + canonical + Twitter (cheerio, für /en/ /ar/) ──
function injectHreflang($, rel, lang) {
  const head = $('head')
  // bestehende hreflang/canonical/twitter entfernen (Idempotenz, keine Duplikate)
  head.find('link[rel="alternate"][hreflang], link[rel="canonical"], meta[name^="twitter:"]').remove()

  const deUrl = urlFor('de', rel)
  const enUrl = urlFor('en', rel)
  const arUrl = urlFor('ar', rel)
  const canonical = urlFor(lang, rel)
  const tw = twitterTags(
    $('meta[property="og:title"]').attr('content'),
    $('meta[property="og:description"]').attr('content'),
    $('meta[property="og:image"]').attr('content'),
  )

  const block =
    `\n    <link rel="alternate" hreflang="de" href="${deUrl}" />` +
    `\n    <link rel="alternate" hreflang="en" href="${enUrl}" />` +
    `\n    <link rel="alternate" hreflang="ar" href="${arUrl}" />` +
    `\n    <link rel="alternate" hreflang="x-default" href="${deUrl}" />` +
    `\n    <link rel="canonical" href="${canonical}" />` +
    `\n    ${tw.join('\n    ')}\n`
  head.append(block)
}

// ─── head-Injektion: __PAGE_LANG__-Deriver (falls nicht vorhanden) ────────────
const PAGE_LANG_SNIPPET =
  `\n    <script>window.__PAGE_LANG__=(function(){var p=location.pathname;` +
  `if(/(^|\\/)en(\\/|$)/.test(p))return'en';if(/(^|\\/)ar(\\/|$)/.test(p))return'ar';return'de';})();</script>\n`

function ensurePageLang($) {
  if ($('head').html() && $('head').html().includes('__PAGE_LANG__')) return
  $('head').prepend(PAGE_LANG_SNIPPET)
}

// ─── DE-Quellseiten: hreflang/canonical + Snippet als markierten Block ─────────
// String-basiert (KEIN cheerio-Round-Trip) → die handgepflegte Quellformatierung
// bleibt 1:1 erhalten. Idempotent über Marker-Kommentare.
const MARK_START = '<!-- i18n-seo-auto:start -->'
const MARK_END   = '<!-- i18n-seo-auto:end -->'
const PAGE_LANG_INLINE = `<script>window.__PAGE_LANG__=(function(){var p=location.pathname;` +
  `if(/(^|\\/)en(\\/|$)/.test(p))return'en';if(/(^|\\/)ar(\\/|$)/.test(p))return'ar';return'de';})();</script>`

function seoLinks(rel, deOnly) {
  const canonical = `<link rel="canonical" href="${urlFor('de', rel)}" />`
  if (deOnly) return canonical // Impressum/Datenschutz: DE-only, keine Alternates
  return [
    `<link rel="alternate" hreflang="de" href="${urlFor('de', rel)}" />`,
    `<link rel="alternate" hreflang="en" href="${urlFor('en', rel)}" />`,
    `<link rel="alternate" hreflang="ar" href="${urlFor('ar', rel)}" />`,
    `<link rel="alternate" hreflang="x-default" href="${urlFor('de', rel)}" />`,
    canonical,
  ].join('\n    ')
}

function injectDeSource(rel, deOnly = false) {
  const p = join(WEB, rel)
  if (!existsSync(p)) return
  let html = readFileSync(p, 'utf-8')
  // vorhandenen Auto-Block entfernen (Idempotenz)
  html = html.replace(new RegExp('[ \\t]*' + MARK_START + '[\\s\\S]*?' + MARK_END + '\\n?', 'g'), '')
  // Duplikate vermeiden: bereits vorhandene canonical / hreflang / twitter aus der Quelle entfernen
  html = html.replace(/[ \t]*<link[^>]+rel="canonical"[^>]*>[ \t]*\n?/gi, '')
  html = html.replace(/[ \t]*<link[^>]+rel="alternate"[^>]+hreflang=[^>]*>[ \t]*\n?/gi, '')
  html = html.replace(/[ \t]*<meta[^>]+name="twitter:[^"]*"[^>]*>[ \t]*\n?/gi, '')
  // Twitter-Cards aus OG ableiten
  const tw = twitterTags(ogFromHtml(html, 'title'), ogFromHtml(html, 'description'), ogFromHtml(html, 'image'))
  const inner = [seoLinks(rel, deOnly), ...tw, PAGE_LANG_INLINE].join('\n    ')
  const block = `    ${MARK_START}\n    ${inner}\n    ${MARK_END}\n`
  if (/<\/head>/.test(html)) {
    html = html.replace(/([ \t]*)<\/head>/, block + '$1</head>')
    writeFileSync(p, html, 'utf-8')
  }
}

// ─── Übersetzen ───────────────────────────────────────────────────────────────
function applyDict($, dict) {
  $('[data-i18n]').each((_, el) => {
    const key = $(el).attr('data-i18n')
    const val = key ? dict[key] : undefined
    if (val == null) return
    if (val.includes('<')) $(el).html(val)
    else $(el).text(val)
  })
  $('[data-i18n-placeholder]').each((_, el) => {
    const key = $(el).attr('data-i18n-placeholder')
    const val = key ? dict[key] : undefined
    if (val != null) $(el).attr('placeholder', val)
  })
  // Attribut-Übersetzung (z.B. <meta ... data-i18n-content="meta_desc">)
  $('[data-i18n-content]').each((_, el) => {
    const key = $(el).attr('data-i18n-content')
    const val = key ? dict[key] : undefined
    if (val != null) $(el).attr('content', val)
  })
}

// ─── Pfade in allen href/src umschreiben ──────────────────────────────────────
// CSS url(...) — relative Pfade absolut machen (in <style> + style="…")
function rewriteCss(css, srcDir, lang) {
  return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (m, q, u) => {
    const next = rewriteLink(u, srcDir, lang)
    return next === null ? m : `url(${q}${next}${q})`
  })
}

// srcset="url1 1x, url2 2x" — jede URL einzeln umschreiben
function rewriteSrcset(val, srcDir, lang) {
  return val.split(',').map(part => {
    const seg = part.trim()
    if (!seg) return part
    const sp = seg.split(/\s+/)
    const next = rewriteLink(sp[0], srcDir, lang)
    if (next !== null) sp[0] = next
    return sp.join(' ')
  }).join(', ')
}

function rewriteAllLinks($, srcDir, lang) {
  for (const attr of ['href', 'src']) {
    $(`[${attr}]`).each((_, el) => {
      const next = rewriteLink($(el).attr(attr), srcDir, lang)
      if (next !== null) $(el).attr(attr, next)
    })
  }
  // srcset (img / <source>)
  $('[srcset]').each((_, el) => {
    $(el).attr('srcset', rewriteSrcset($(el).attr('srcset'), srcDir, lang))
  })
  // Inline-Styles: style="… url(…) …"
  $('[style]').each((_, el) => {
    $(el).attr('style', rewriteCss($(el).attr('style'), srcDir, lang))
  })
  // <style>-Blöcke: background: url(…) etc.
  $('style').each((_, el) => {
    $(el).html(rewriteCss($(el).html() || '', srcDir, lang))
  })
}

// ─── Hauptlauf ────────────────────────────────────────────────────────────────
function main() {
  console.log('→ build-lang-pages: statische EN/AR-Spiegelung\n')

  // Ziel-Ordner frisch aufsetzen (keine veralteten Dateien)
  for (const lang of LANGS) {
    const d = join(WEB, lang)
    if (existsSync(d)) rmSync(d, { recursive: true, force: true })
  }

  const dicts = Object.fromEntries(LANGS.map(l => [l, loadDict(l)]))
  const pages = collectHtml(WEB)
  let written = 0

  for (const rel of pages) {
    const srcHtml = readFileSync(join(WEB, rel), 'utf-8')
    const srcDir  = posix.dirname(rel) === '.' ? '' : posix.dirname(rel)

    for (const lang of LANGS) {
      const $ = cheerio.load(srcHtml, { decodeEntities: false })

      // 1) html lang + dir
      $('html').attr('lang', lang)
      if (lang === 'ar') $('html').attr('dir', 'rtl')
      else $('html').removeAttr('dir')

      // 2) Übersetzen
      applyDict($, dicts[lang])

      // 3) Pfade
      rewriteAllLinks($, srcDir, lang)

      // 4) SEO-head
      injectHreflang($, rel, lang)
      ensurePageLang($)

      // 5) Schreiben
      const outPath = join(WEB, lang, rel)
      mkdirSync(dirname(outPath), { recursive: true })
      writeFileSync(outPath, $.html(), 'utf-8')
      written++
    }
  }

  // DE-Quellseiten (Root): hreflang + canonical + Snippet in place (idempotent)
  for (const rel of pages) injectDeSource(rel, false)
  for (const rel of ['impressum.html', 'datenschutz.html']) injectDeSource(rel, true)

  console.log(`   ${pages.length} Quellseiten × ${LANGS.length} Sprachen = ${written} Dateien`)
  console.log(`   → website/en/ + website/ar/`)
  console.log(`   DE-Quellen: hreflang/canonical/Snippet injiziert (${pages.length} + 2 DE-only)`)
  console.log('\n✅  Fertig.')
}

main()
