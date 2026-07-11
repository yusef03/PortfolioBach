#!/usr/bin/env node
/**
 * snapshot.mjs — Phase-0-Skript: Goldene Referenz VOR dem Umbau
 *
 * Schreibt internal-docs/_umbau-snapshot.json mit:
 *  - Liste aller Web-Dateien + SHA-256-Hashes
 *  - Alle href/src-Referenzen aus HTML-Dateien
 *  - sw.js-Cache-Pfade
 *  - i18n-Key-Anzahl
 *  - git HEAD
 *
 * Aufruf: node scripts/verify/snapshot.mjs
 * Aufruf nach Umbau (neuer Basispfad): node scripts/verify/snapshot.mjs --root=website
 */

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');

// --root=website erlaubt Snapshot nach dem Umbau (für parity.mjs)
const rootArg = process.argv.find(a => a.startsWith('--root='));
const WEB_ROOT = rootArg ? join(REPO_ROOT, rootArg.slice(7)) : REPO_ROOT;
const LABEL = rootArg ? rootArg.slice(7) : 'root';

// Web-Assets: diese Ordner/Dateien zählen als "Web-Content"
const WEB_DIRS  = ['css', 'js', 'images', 'fonts', 'lang', 'projects', 'thoughts', 'docs'];
const WEB_FILES = [
  'index.html', '404.html', 'changelog.html', 'datenschutz.html',
  'impressum.html', 'maintenance.html', 'roadmap.html', 'thanks.html',
  'googlebd7900ffe59aa1d6.html',
  'sw.js', 'manifest.json', 'robots.txt', 'sitemap.xml',
  'media-manifest.json', 'CNAME', '.nojekyll',
];

// Alle Dateierweiterungen die für den Hash-Parity-Check relevant sind
const HASH_EXTS = new Set([
  '.html', '.css', '.js', '.ts', '.mjs',
  '.json', '.xml', '.txt', '.md',
  '.png', '.jpg', '.jpeg', '.svg', '.webp', '.ico', '.gif',
  '.woff', '.woff2', '.ttf', '.otf',
  '.pdf',
]);

function sha256(filePath) {
  const content = readFileSync(filePath);
  return createHash('sha256').update(content).digest('hex').slice(0, 16);
}

function walkDir(dir, results = []) {
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.nojekyll') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full, results);
    } else {
      results.push(full);
    }
  }
  return results;
}

// --- Alle Web-Dateien sammeln ---
const files = {};

for (const f of WEB_FILES) {
  const full = join(WEB_ROOT, f);
  if (existsSync(full)) {
    const rel = relative(WEB_ROOT, full);
    files[rel] = sha256(full);
  }
}

for (const d of WEB_DIRS) {
  const full = join(WEB_ROOT, d);
  for (const fp of walkDir(full)) {
    const ext = extname(fp);
    if (HASH_EXTS.has(ext)) {
      const rel = relative(WEB_ROOT, fp);
      files[rel] = sha256(fp);
    }
  }
}

// --- href/src aus allen HTML-Dateien extrahieren ---
const htmlRefs = {};
const HTML_REF_RE = /(?:href|src|data-src|action|content)=["']([^"'#?]+)["']/g;

function collectHtmlRefs(htmlPath) {
  const content = readFileSync(htmlPath, 'utf8');
  const refs = new Set();
  let m;
  while ((m = HTML_REF_RE.exec(content)) !== null) {
    const val = m[1].trim();
    // Nur relative Pfade die auf Dateien zeigen (keine http/data/mailto)
    if (!val.startsWith('http') && !val.startsWith('data:') && !val.startsWith('mailto:') && val !== '#') {
      refs.add(val);
    }
  }
  return [...refs];
}

// Alle HTML sammeln
function collectHtmlFiles(dir) {
  if (!existsSync(dir)) return [];
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      results.push(...collectHtmlFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

const htmlFiles = [];
for (const f of WEB_FILES.filter(f => f.endsWith('.html'))) {
  const full = join(WEB_ROOT, f);
  if (existsSync(full)) htmlFiles.push(full);
}
for (const d of ['projects', 'thoughts']) {
  htmlFiles.push(...collectHtmlFiles(join(WEB_ROOT, d)));
}

for (const hp of htmlFiles) {
  const rel = relative(WEB_ROOT, hp);
  htmlRefs[rel] = collectHtmlRefs(hp);
}

// --- sw.js Cache-Pfade extrahieren ---
const swPath = join(WEB_ROOT, 'sw.js');
let swCachePaths = [];
if (existsSync(swPath)) {
  const swContent = readFileSync(swPath, 'utf8');
  // Pattern: '/css/main.css' oder "/js/script.js" in Arrays
  const SW_RE = /'([^']+)'|"([^"]+)"/g;
  let m;
  while ((m = SW_RE.exec(swContent)) !== null) {
    const val = (m[1] || m[2]).trim();
    if (val.startsWith('/') && val.length > 1 && !val.includes('${')) {
      swCachePaths.push(val);
    }
  }
  swCachePaths = [...new Set(swCachePaths)];
}

// --- i18n Key-Anzahl ---
let i18nKeyCount = 0;
const langPath = join(WEB_ROOT, 'lang', 'de.json');
if (existsSync(langPath)) {
  const lang = JSON.parse(readFileSync(langPath, 'utf8'));
  i18nKeyCount = Object.keys(lang).length;
}

// --- git HEAD ---
let gitHead = 'unknown';
try {
  gitHead = execSync('git rev-parse HEAD', { cwd: REPO_ROOT }).toString().trim();
} catch {}

// --- Snapshot schreiben ---
const snapshot = {
  meta: {
    created: new Date().toISOString(),
    label: LABEL,
    webRoot: WEB_ROOT,
    gitHead,
    fileCount: Object.keys(files).length,
    htmlCount: Object.keys(htmlRefs).length,
    i18nKeyCount,
    swCacheCount: swCachePaths.length,
  },
  files,
  htmlRefs,
  swCachePaths,
};

const outPath = join(REPO_ROOT, 'internal-docs', '_umbau-snapshot.json');
writeFileSync(outPath, JSON.stringify(snapshot, null, 2));

console.log(`✅ Snapshot gespeichert: ${relative(REPO_ROOT, outPath)}`);
console.log(`   Web-Dateien: ${snapshot.meta.fileCount}`);
console.log(`   HTML-Dateien: ${snapshot.meta.htmlCount}`);
console.log(`   i18n Keys: ${snapshot.meta.i18nKeyCount}`);
console.log(`   SW-Cache-Pfade: ${snapshot.meta.swCacheCount}`);
console.log(`   git HEAD: ${gitHead.slice(0, 8)}`);
