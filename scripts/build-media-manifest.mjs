/**
 * build-media-manifest.mjs
 * Generiert media-manifest.json mit allen Assets aus images/ und docs/,
 * inkl. Kategorie, Typ, Größe, WebP-Pairing, "wo benutzt" (Repo-Grep) und Orphan-Flag.
 * Wird von der GitHub Action bei Asset-Änderungen automatisch aufgerufen.
 * Lokal: node scripts/build-media-manifest.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs'
import { join, relative, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dir, '..')
const WEBSITE = join(ROOT, 'website')

const SKIP_FILENAMES = new Set(['.DS_Store', '.gitkeep', 'Thumbs.db'])
const SKIP_DIRS = new Set(['.git', '.claude', 'node_modules', '.github'])
const SEARCH_EXTENSIONS = new Set(['.html', '.css', '.ts', '.js', '.mjs', '.json'])
const SKIP_SEARCH_FILES = new Set(['media-manifest.json', 'build-media-manifest.mjs'])

// ── Kategorie & Typ ───────────────────────────────────────────────────────────

function getCategory(relPath) {
  if (relPath.startsWith('images/ui/'))        return 'ui'
  if (relPath.startsWith('images/techstack/')) return 'techstack'
  if (relPath.startsWith('images/projects/')) {
    const parts = relPath.split('/')
    return `projects-${parts[2] ?? 'unknown'}`
  }
  if (relPath.startsWith('docs/')) return 'docs'
  return 'other'
}

function getType(ext) {
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) return 'image'
  if (ext === '.svg')                                           return 'vector'
  if (['.mp4', '.webm', '.mov', '.avi'].includes(ext))         return 'video'
  if (['.pdf', '.doc', '.docx'].includes(ext))                 return 'document'
  return 'other'
}

// ── Dateisystem-Walker ────────────────────────────────────────────────────────

function walkDir(dir) {
  const results = []
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return results
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    if (SKIP_DIRS.has(entry.name))  continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...walkDir(full))
    } else if (!SKIP_FILENAMES.has(entry.name)) {
      results.push(full)
    }
  }
  return results
}

// ── Quelldateien für Grep sammeln ─────────────────────────────────────────────

function collectSearchCorpus() {
  const corpus = []
  const files = walkDir(ROOT)
  for (const file of files) {
    const ext  = extname(file).toLowerCase()
    const name = basename(file)
    if (!SEARCH_EXTENSIONS.has(ext))  continue
    if (SKIP_SEARCH_FILES.has(name))  continue
    // Größe-Limit: Dateien >500 KB überspringen (generated bundles o.ä.)
    try {
      const size = statSync(file).size
      if (size > 500_000) continue
      const content = readFileSync(file, 'utf-8')
      corpus.push({ file: relative(ROOT, file).replace(/\\/g, '/'), content })
    } catch { /* skip unlesbare Dateien */ }
  }
  return corpus
}

// ── Manifest bauen ────────────────────────────────────────────────────────────

function buildManifest() {
  console.log('🔍 Sammle Assets aus images/ und docs/…')

  // 1. Alle Asset-Dateien einlesen
  const assetDirs = ['images', 'docs']
  const rawAssets = []
  for (const dir of assetDirs) {
    const dirPath = join(WEBSITE, dir)
    if (!existsSync(dirPath)) continue
    for (const file of walkDir(dirPath)) {
      const ext     = extname(file).toLowerCase()
      const relPath = relative(WEBSITE, file).replace(/\\/g, '/')
      if (!ext) continue
      rawAssets.push({ file, relPath, ext })
    }
  }

  // 2. WebP-Pfade für Pairing-Erkennung
  const webpSet = new Set(
    rawAssets.filter(a => a.ext === '.webp').map(a => a.relPath)
  )

  // 3. Quelldateien für Grep laden
  console.log('📂 Lade Quelldateien für Referenz-Suche…')
  const corpus = collectSearchCorpus()
  console.log(`   ${corpus.length} Quelldateien geladen`)

  // 4. Manifest-Einträge bauen
  const assets = []
  let skippedWebp = 0

  for (const { file, relPath, ext } of rawAssets) {
    // .webp-Dateien werden über has_webp am Raster-Original abgebildet
    if (ext === '.webp') { skippedWebp++; continue }

    const stat     = statSync(file)
    const type     = getType(ext)
    const category = getCategory(relPath)

    // WebP-Partner prüfen (nur für Rasterbilder)
    const isRaster = ['.png', '.jpg', '.jpeg'].includes(ext)
    const webpPath = isRaster ? relPath.replace(/\.(png|jpg|jpeg)$/i, '.webp') : null
    const has_webp = isRaster ? webpSet.has(webpPath) : undefined

    // Suchbegriffe: voller relativer Pfad + ../-Variante (für Subseiten) + ggf. WebP
    const searchTerms = [
      relPath,
      `../${relPath}`,
    ]
    if (has_webp && webpPath) {
      searchTerms.push(webpPath, `../${webpPath}`)
    }

    // Suche im Corpus
    const used_in = []
    for (const { file: srcFile, content } of corpus) {
      if (searchTerms.some(term => content.includes(term))) {
        if (!used_in.includes(srcFile)) used_in.push(srcFile)
      }
    }

    assets.push({
      path:       relPath,
      category,
      type,
      size_bytes: stat.size,
      ...(has_webp !== undefined ? { has_webp } : {}),
      used_in,
      is_orphan:  used_in.length === 0,
    })
  }

  // 5. Sortieren: Kategorie, dann Pfad
  assets.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category)
    return a.path.localeCompare(b.path)
  })

  // 6. Summary
  const totalBytes = assets.reduce((s, a) => s + a.size_bytes, 0)
  const summary = {
    count:       assets.length,
    total_bytes: totalBytes,
    total_mb:    parseFloat((totalBytes / 1024 / 1024).toFixed(2)),
    orphans:     assets.filter(a => a.is_orphan).length,
    categories:  [...new Set(assets.map(a => a.category))].sort(),
    skipped_webp: skippedWebp,
  }

  const manifest = {
    generated_at: new Date().toISOString(),
    summary,
    assets,
  }

  // 7. Schreiben
  const outPath = join(WEBSITE, 'media-manifest.json')
  writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n')

  console.log('\n✅ media-manifest.json generiert:')
  console.log(`   📁 ${summary.count} Assets (${skippedWebp} .webp-Partner übersprungen)`)
  console.log(`   ⚠️  ${summary.orphans} Orphans (nicht referenziert)`)
  console.log(`   💾 Gesamt: ${summary.total_mb} MB`)
  console.log(`   🏷️  Kategorien: ${summary.categories.join(', ')}`)
}

buildManifest()
