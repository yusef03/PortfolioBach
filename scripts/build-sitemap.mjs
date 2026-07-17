/**
 * build-sitemap.mjs
 *
 * Generiert sitemap.xml und robots.txt für das Portfolio.
 * Liest veröffentlichte Thoughts aus js/thoughts-data.js
 * und scannt projects/ nach öffentlichen HTML-Seiten.
 *
 * Lokal testen (aus BETAPortfolioBach/):
 *   node scripts/build-sitemap.mjs
 */

import fs   from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir   = path.resolve(__dirname, '..')
const webRoot   = path.join(rootDir, 'website')
const require   = createRequire(import.meta.url)

const BASE_URL = 'https://yusefbach.de'
const TODAY    = new Date().toISOString().split('T')[0]  // YYYY-MM-DD

// ── 1. Statische Seiten ────────────────────────────────────────────────────

const STATIC_PAGES = [
  { loc: '/',                priority: '1.0', changefreq: 'weekly'  },
  { loc: '/roadmap.html',    priority: '0.7', changefreq: 'weekly'  },
  { loc: '/changelog.html', priority: '0.6', changefreq: 'weekly'  },
  { loc: '/thoughts/',       priority: '0.9', changefreq: 'weekly'  },
  { loc: '/impressum.html',  priority: '0.3', changefreq: 'yearly'  },
  { loc: '/datenschutz.html',priority: '0.3', changefreq: 'yearly'  },
]

// ── 2. Projekt-Subseiten (aus projects/*.html, ohne Template/Archiv) ──────

const EXCLUDE_PROJECT_FILES = new Set(['_template.html'])

function getProjectPages() {
  const projectsDir = path.join(webRoot, 'projects')
  if (!fs.existsSync(projectsDir)) return []

  return fs.readdirSync(projectsDir)
    .filter(f => f.endsWith('.html') && !EXCLUDE_PROJECT_FILES.has(f))
    .map(f => ({
      loc:        `/projects/${f}`,
      priority:   '0.8',
      changefreq: 'monthly',
    }))
}

// ── 3. Thoughts-Posts (aus js/thoughts-data.js) ───────────────────────────

function getThoughtPages() {
  const dataPath = path.join(webRoot, 'js', 'thoughts-data.js')
  if (!fs.existsSync(dataPath)) return []

  const code = fs.readFileSync(dataPath, 'utf-8')
  const fn   = new Function(code + '\n return typeof thoughtsData !== "undefined" ? thoughtsData : [];')
  const posts = fn()

  if (!Array.isArray(posts)) return []

  return posts.map(p => ({
    loc:        `/thoughts/${p.slug}.html`,
    lastmod:    p.published_at ? p.published_at.split('T')[0] : TODAY,
    priority:   '0.8',
    changefreq: 'monthly',
  }))
}

// ── 4. XML zusammenbauen ──────────────────────────────────────────────────

// DE-only Seiten (rechtlich) — kein Sprach-Spiegel, kein hreflang.
const DE_ONLY = new Set(['/impressum.html', '/datenschutz.html'])

function altLoc(loc, lang) {
  return loc === '/' ? `/${lang}/` : `/${lang}${loc}`
}

// hreflang-Alternates (de/en/ar/x-default) für gespiegelte Seiten
function hreflangLines(loc) {
  if (DE_ONLY.has(loc)) return []
  return [
    `    <xhtml:link rel="alternate" hreflang="de" href="${BASE_URL}${loc}"/>`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${altLoc(loc, 'en')}"/>`,
    `    <xhtml:link rel="alternate" hreflang="ar" href="${BASE_URL}${altLoc(loc, 'ar')}"/>`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${loc}"/>`,
  ]
}

function buildUrlEntry({ loc, lastmod, priority, changefreq }) {
  const parts = [`    <loc>${BASE_URL}${loc}</loc>`, ...hreflangLines(loc)]
  if (lastmod)    parts.push(`    <lastmod>${lastmod}</lastmod>`)
  if (changefreq) parts.push(`    <changefreq>${changefreq}</changefreq>`)
  if (priority)   parts.push(`    <priority>${priority}</priority>`)
  parts.push(...imageLines(loc))
  return `  <url>\n${parts.join('\n')}\n  </url>`
}

const projectPages = getProjectPages()
const thoughtPages = getThoughtPages()

const allPages = [
  ...STATIC_PAGES.map(p => ({ ...p, lastmod: TODAY })),
  ...projectPages.map(p => ({ ...p, lastmod: TODAY })),
  ...thoughtPages,
]

// ── 4b. Image-Sitemap-Eintrag für die Startseite ──────────────────────────
// Google Images gewichtet ein explizit deklariertes <image:image> stärker
// als ein beliebiges <img> im HTML — auf der Startseite konkurrieren die
// beiden Profilfotos sonst mit 28 generischen Tech-Stack-Icons um Sichtbarkeit.
const HOME_IMAGES = [
  { loc: '/images/ui/hero-profile.jpg', caption: 'Yusef Bach — AI Developer & B.Sc. Student' },
  { loc: '/images/ui/about-profile.jpg', caption: 'Yusef Bach bei der Arbeit' },
]

function xmlEscape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function imageLines(loc) {
  if (loc !== '/') return []
  return HOME_IMAGES.flatMap(img => [
    `    <image:image>`,
    `      <image:loc>${BASE_URL}${img.loc}</image:loc>`,
    `      <image:caption>${xmlEscape(img.caption)}</image:caption>`,
    `    </image:image>`,
  ])
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages.map(buildUrlEntry).join('\n')}
</urlset>
`

// ── 5. Dateien schreiben ──────────────────────────────────────────────────

const sitemapPath = path.join(webRoot, 'sitemap.xml')
fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8')
console.log(`✅ sitemap.xml geschrieben (${allPages.length} URLs, ${thoughtPages.length} Thoughts-Posts)`)

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`
const robotsPath = path.join(webRoot, 'robots.txt')
fs.writeFileSync(robotsPath, robotsTxt, 'utf-8')
console.log('✅ robots.txt geschrieben')
