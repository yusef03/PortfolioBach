#!/usr/bin/env node
/**
 * links.mjs — V2: Prüft alle href/src-Referenzen in HTML → Zieldatei existiert physisch
 *
 * Aufruf: node scripts/verify/links.mjs
 * Exit 0 = alles OK (0 tote Links), Exit 1 = tote Links gefunden
 *
 * Prüft:
 *  - Alle .html-Dateien in website/ (inkl. projects/, thoughts/)
 *  - Alle href/src/url() in manifest.json
 *  - Alle url() in CSS-Dateien
 *  - Zieldatei muss physisch in website/ existieren
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');
const WEBSITE = join(REPO_ROOT, 'website');

let errors = 0;
let checked = 0;
const deadLinks = [];

if (!existsSync(WEBSITE)) {
  console.error('❌ website/ nicht gefunden. Umbau noch nicht vollständig?');
  process.exit(1);
}

// --- Hilfsfunktionen ---
function walkFiles(dir, ext) {
  if (!existsSync(dir)) return [];
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      results.push(...walkFiles(full, ext));
    } else if (entry.isFile() && (ext ? entry.name.endsWith(ext) : true)) {
      results.push(full);
    }
  }
  return results;
}

// Referenz auflösen: von `fromFile` aus, Pfad `ref` → absolute Zieldatei
function resolveRef(fromFile, ref) {
  // Ignorieren: external, data:, mailto:, tel:, javascript:, #anchor (auch URL-encodiert
  // %23 — z.B. SVG-Filter-Referenzen in Data-URIs), JS-Variablen, Template-Strings
  if (!ref || ref.startsWith('http') || ref.startsWith('//') ||
      ref.startsWith('data:') || ref.startsWith('mailto:') ||
      ref.startsWith('tel:') || ref.startsWith('javascript:') ||
      ref.startsWith('#') || ref.startsWith('%23') ||
      ref.includes('${') || ref.includes('{{') ||
      ref === '/' || ref === '') {
    return null;
  }
  // Absolute Pfade (z.B. /css/main.css in sw.js) → relativ zu website/
  if (ref.startsWith('/')) {
    return join(WEBSITE, ref);
  }
  // Relative Pfade vom HTML-File aus
  return resolve(dirname(fromFile), ref);
}

function checkRef(fromFile, ref, context) {
  const target = resolveRef(fromFile, ref);
  if (!target) return; // ignoriert

  checked++;

  // Muss innerhalb website/ liegen (keine Traversal nach oben)
  if (!target.startsWith(WEBSITE)) {
    // Bot-Dateien oder interne Pfade — ok
    return;
  }

  if (!existsSync(target)) {
    const fromRel = relative(WEBSITE, fromFile);
    const targetRel = relative(WEBSITE, target);
    deadLinks.push({ file: fromRel, ref, context });
    console.error(`  ❌ TOT: ${fromRel} → ${ref} (erwartet: website/${targetRel})`);
    errors++;
  }
}

// --- HTML-Dateien prüfen ---
const HTML_ATTR_RE = /(?:href|src|data-src|action)=["']([^"'#?]+)["']/g;
const CSS_URL_RE = /url\(["']?([^"')#?]+)["']?\)/g;

console.log('\n=== V2: Link-Check ===\n');

const allHtmlFiles = walkFiles(WEBSITE, '.html');
// Template-Dateien überspringen (Platzhalter, keine echten Seiten)
const htmlFiles = allHtmlFiles.filter(f => {
  const name = f.split('/').pop();
  return name !== '_template.html' && name !== '_post-template.html';
});
console.log(`HTML-Dateien: ${htmlFiles.length} (${allHtmlFiles.length - htmlFiles.length} Templates übersprungen)`);

for (const hp of htmlFiles) {
  const content = readFileSync(hp, 'utf8');
  let m;
  // href/src Attribute
  while ((m = HTML_ATTR_RE.exec(content)) !== null) {
    checkRef(hp, m[1].trim(), 'html-attr');
  }
  // CSS url() in <style> Blöcken
  while ((m = CSS_URL_RE.exec(content)) !== null) {
    checkRef(hp, m[1].trim(), 'inline-css');
  }
}

// --- CSS-Dateien prüfen ---
const cssFiles = walkFiles(join(WEBSITE, 'css'), '.css');
console.log(`CSS-Dateien: ${cssFiles.length}`);

for (const cp of cssFiles) {
  const content = readFileSync(cp, 'utf8');
  let m;
  while ((m = CSS_URL_RE.exec(content)) !== null) {
    checkRef(cp, m[1].trim(), 'css-url');
  }
}

// --- manifest.json ---
const manifestPath = join(WEBSITE, 'manifest.json');
if (existsSync(manifestPath)) {
  const mf = JSON.parse(readFileSync(manifestPath, 'utf8'));
  // icons
  if (mf.icons) {
    for (const icon of mf.icons) {
      if (icon.src) checkRef(manifestPath, icon.src, 'manifest-icon');
    }
  }
  console.log('manifest.json: geprüft');
}

// --- Ergebnis ---
console.log(`\nGeprüfte Referenzen: ${checked}`);
console.log('================================');
if (errors === 0) {
  console.log('✅ V2 GRÜN — Alle Links gültig (0 tote Links)');
} else {
  console.log(`❌ V2 ROT — ${errors} tote Links gefunden`);
  process.exit(1);
}
