#!/usr/bin/env node
/**
 * sw-cache.mjs — V3: Prüft alle Pfade in website/sw.js → Datei existiert in website/
 *
 * Aufruf: node scripts/verify/sw-cache.mjs
 * Exit 0 = alles OK, Exit 1 = Fehler
 *
 * Liest alle String-Literale aus sw.js die mit '/' beginnen → prüft ob die
 * Zieldatei in website/ existiert. Schlägt an bei toten Offline-Cache-Einträgen.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');
const WEBSITE = join(REPO_ROOT, 'website');
const SW_PATH = join(WEBSITE, 'sw.js');

if (!existsSync(WEBSITE)) {
  console.error('❌ website/ nicht gefunden. Umbau noch nicht vollständig?');
  process.exit(1);
}

if (!existsSync(SW_PATH)) {
  console.error('❌ website/sw.js nicht gefunden.');
  process.exit(1);
}

console.log('\n=== V3: Service-Worker-Cache-Check ===\n');

const swContent = readFileSync(SW_PATH, 'utf8');

// Alle String-Literale extrahieren die mit / beginnen (absolute URL-Pfade)
const SW_STR_RE = /'(\/[^']+)'|"(\/[^"]+)"/g;
const cachePaths = [];
let m;
while ((m = SW_STR_RE.exec(swContent)) !== null) {
  const val = (m[1] || m[2]).trim();
  // Template-Strings und Kommentare überspringen
  if (val.includes('${') || val.includes('//')) continue;
  // Versionsnummern/Config-Strings überspringen
  if (!val.match(/\.(html|css|js|json|png|jpg|svg|webp|woff|woff2|ttf|pdf|ico)($|\?)/)) {
    // Kann trotzdem ein Ordner-Pfad sein, nur überprüfen wenn es wie ein Datei-Pfad aussieht
    if (!val.endsWith('/')) {
      cachePaths.push(val);
    }
    continue;
  }
  cachePaths.push(val);
}

const uniquePaths = [...new Set(cachePaths)];
console.log(`Cache-Einträge gefunden: ${uniquePaths.length}`);
console.log('');

let errors = 0;
let ok = 0;

for (const p of uniquePaths) {
  // Absoluter Pfad → relativ zu website/ (so wie der Browser es sieht)
  const target = join(WEBSITE, p);
  if (existsSync(target)) {
    ok++;
    console.log(`  ✅ ${p}`);
  } else {
    errors++;
    console.error(`  ❌ TOT: ${p} (nicht in website${p})`);
  }
}

console.log('\n================================');
if (errors === 0) {
  console.log(`✅ V3 GRÜN — Alle ${ok} SW-Cache-Pfade gültig`);
} else {
  console.log(`❌ V3 ROT — ${errors} tote SW-Cache-Pfade gefunden`);
  process.exit(1);
}
