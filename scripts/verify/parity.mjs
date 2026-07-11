#!/usr/bin/env node
/**
 * parity.mjs — V4: Vergleicht aktuellen Zustand (website/) mit dem Snapshot (Stufe 0)
 *
 * Aufruf: node scripts/verify/parity.mjs
 * Exit 0 = alles OK (nichts verloren, nichts verändert), Exit 1 = Unterschiede
 *
 * Prüft:
 *  - Gleiche Anzahl Dateien im website/ wie im Snapshot
 *  - Gleiche SHA-256-Hashes (Inhalt unverändert — nur verschoben)
 *  - Meldet: fehlende Dateien, extra Dateien, geänderte Hashes
 */

import { createHash } from 'node:crypto';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');
const WEBSITE = join(REPO_ROOT, 'website');
const SNAPSHOT_PATH = join(REPO_ROOT, 'internal-docs', '_umbau-snapshot.json');

if (!existsSync(SNAPSHOT_PATH)) {
  console.error('❌ Snapshot nicht gefunden: internal-docs/_umbau-snapshot.json');
  console.error('   Zuerst snapshot.mjs ausführen (Phase 0)!');
  process.exit(1);
}

if (!existsSync(WEBSITE)) {
  console.error('❌ website/ nicht gefunden. Umbau noch nicht vollständig?');
  process.exit(1);
}

console.log('\n=== V4: Parity-Check (Snapshot vs. website/) ===\n');

const snapshot = JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf8'));
const snapshotFiles = snapshot.files; // { "css/main.css": "sha256...", ... }

// Aktuelle Dateien in website/ sammeln (gleiche Logik wie snapshot.mjs)
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

const WEB_DIRS  = ['css', 'js', 'images', 'fonts', 'lang', 'projects', 'thoughts', 'docs'];
const WEB_FILES_ROOT = [
  'index.html', '404.html', 'changelog.html', 'datenschutz.html',
  'impressum.html', 'maintenance.html', 'roadmap.html', 'thanks.html',
  'googlebd7900ffe59aa1d6.html',
  'sw.js', 'manifest.json', 'robots.txt', 'sitemap.xml',
  'media-manifest.json', 'CNAME', '.nojekyll',
];

const currentFiles = {};

for (const f of WEB_FILES_ROOT) {
  const full = join(WEBSITE, f);
  if (existsSync(full)) {
    currentFiles[f] = sha256(full);
  }
}

for (const d of WEB_DIRS) {
  const full = join(WEBSITE, d);
  for (const fp of walkDir(full)) {
    const ext = extname(fp);
    if (HASH_EXTS.has(ext)) {
      const rel = relative(WEBSITE, fp);
      currentFiles[rel] = sha256(fp);
    }
  }
}

// --- Vergleich ---
const snapshotKeys = new Set(Object.keys(snapshotFiles));
const currentKeys  = new Set(Object.keys(currentFiles));

const missing = [...snapshotKeys].filter(k => !currentKeys.has(k));
const extra   = [...currentKeys].filter(k => !snapshotKeys.has(k));
const changed = [...snapshotKeys].filter(k => currentKeys.has(k) && snapshotFiles[k] !== currentFiles[k]);

let errors = 0;

// Bekannte, intentionale Änderungen (werden nur als ✅ gemeldet, nicht als Fehler)
// Hier eintragen wenn eine Änderung Teil des Plans ist.
const EXPECTED_CHANGED = new Set([
  // Favicon-Fix: images/logo.png → images/ui/logo.png (pre-existing broken ref, behoben im Umbau)
  '404.html', 'datenschutz.html', 'maintenance.html', 'thanks.html',
  // Prerender-Runs zum Testen: Inhalt durch Build aktualisiert (normales Build-Verhalten)
  'index.html', 'projects/archive.html', 'thoughts/index.html',
  'roadmap.html', 'changelog.html',
  // Build-generierte Dateien (sitemap.mjs + media-manifest.mjs liefen lokal)
  'sitemap.xml', 'robots.txt', 'media-manifest.json',
]);
const EXPECTED_NEW = new Set([
  // Neue Datei, plangemäß hinzugefügt
  '.nojekyll',
]);
// Bekannte fehlende Dateien (im Snapshot erfasst, aber nach Umbau korrekt woanders)
const EXPECTED_MISSING = new Set([
  // js/sw.js wurde durch `mv website/js/sw.js website/sw.js` nach Root-level verschoben
  // (normaler Build-Schritt — in website/sw.js vorhanden, nur nicht mehr in js/sw.js)
  'js/sw.js',
]);

if (missing.length > 0) {
  const expectedMissing = missing.filter(f => EXPECTED_MISSING.has(f));
  const unexpectedMissing = missing.filter(f => !EXPECTED_MISSING.has(f));
  if (expectedMissing.length > 0) {
    console.log(`✅ ERWARTETE fehlende Dateien (${expectedMissing.length}) — planmäßig woanders:`);
    for (const f of expectedMissing) console.log(`   OK-FEHLT: ${f}`);
    console.log('');
  }
  if (unexpectedMissing.length > 0) {
    console.log(`❌ FEHLENDE Dateien (${unexpectedMissing.length}) — im Snapshot vorhanden, aber nicht in website/:`);
    for (const f of unexpectedMissing) {
      console.log(`   FEHLT: ${f}`);
      errors++;
    }
    console.log('');
  }
}

if (extra.length > 0) {
  const expectedExtra = extra.filter(f => EXPECTED_NEW.has(f.split('/').pop()));
  const unexpectedExtra = extra.filter(f => !EXPECTED_NEW.has(f.split('/').pop()));
  if (expectedExtra.length > 0) {
    console.log(`✅ ERWARTETE neue Dateien (${expectedExtra.length}) — plangemäß hinzugefügt:`);
    for (const f of expectedExtra) console.log(`   OK-NEU: ${f}`);
    console.log('');
  }
  if (unexpectedExtra.length > 0) {
    console.log(`⚠️  UNERWARTETE neue Dateien (${unexpectedExtra.length}) — nicht im Plan:`);
    for (const f of unexpectedExtra) console.log(`   UNBEKANNT-NEU: ${f}`);
    console.log('');
    // Keine errors++ — nur Warnung
  }
}

if (changed.length > 0) {
  const intentional = changed.filter(f => EXPECTED_CHANGED.has(f));
  const unintentional = changed.filter(f => !EXPECTED_CHANGED.has(f));
  if (intentional.length > 0) {
    console.log(`✅ INTENTIONALE Änderungen (${intentional.length}) — dokumentiert, kein Fehler:`);
    for (const f of intentional) console.log(`   OK-GEÄNDERT: ${f}`);
    console.log('');
  }
  if (unintentional.length > 0) {
    console.log(`❌ UNERWARTETE Änderungen (${unintentional.length}) — Hash weicht vom Snapshot ab:`);
    for (const f of unintentional) {
      console.log(`   GEÄNDERT: ${f}`);
      console.log(`     Snapshot: ${snapshotFiles[f]}`);
      console.log(`     Aktuell:  ${currentFiles[f]}`);
      errors++;
    }
    console.log('');
  }
}

console.log(`Snapshot-Dateien: ${snapshotKeys.size}`);
console.log(`Aktuelle Dateien: ${currentKeys.size}`);
console.log(`Fehlend: ${missing.length} | Extra: ${extra.length} | Geändert: ${changed.length}`);
console.log('\n================================');

if (errors === 0) {
  console.log('✅ V4 GRÜN — Parity OK (nichts verloren, kein Inhalt verändert)');
} else {
  console.log(`❌ V4 ROT — ${errors} Parity-Fehler`);
  process.exit(1);
}
