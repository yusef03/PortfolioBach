/**
 * prerender-roadmap.js
 *
 * Pre-Rendering für SEO: Injiziert statisches Roadmap-HTML (DE) in:
 *   - roadmap.html          (globale Roadmap + Changelog, scope = portfolio)
 *   - projects/*.html       (Projekt-Subseiten mit roadmap-project-<slug> Containern)
 *
 * Liest aus js/roadmap-data.js (auto-generiert von build-roadmap.mjs).
 * Scannen der Projekt-HTML-Dateien nach <!-- PRERENDER_ROADMAP_<SLUG>_START --> Markern
 * erfolgt automatisch — keine manuelle Pflege der Dateiliste nötig.
 *
 * Wird von GitHub Action publish-roadmap.yml nach build-roadmap.mjs aufgerufen.
 * Lokal testen (aus BETAPortfolioBach/):
 *   node scripts/prerender-roadmap.js
 */

const fs   = require('fs');
const path = require('path');

const rootDir     = path.resolve(__dirname, '..');
const webRoot     = path.join(rootDir, 'website');
const dataPath    = path.join(webRoot, 'js', 'roadmap-data.js');
const roadmapPage = path.join(webRoot, 'roadmap.html');
const projectsDir = path.join(webRoot, 'projects');

console.log('Starte Roadmap Pre-Rendering...');

// ── 1. Daten einlesen ──────────────────────────────────────────────────────

if (!fs.existsSync(dataPath)) {
  console.warn('⚠️  js/roadmap-data.js nicht gefunden — Pre-Rendering übersprungen.');
  process.exit(0);
}

const dataCode = fs.readFileSync(dataPath, 'utf-8');
const wrappedCode = `${dataCode}\n return { roadmapData, changelogData };`;
const getData = new Function(wrappedCode);
const { roadmapData, changelogData } = getData();

if (!roadmapData || !Array.isArray(roadmapData)) {
  console.warn('⚠️  roadmapData ist leer oder kein Array — Pre-Rendering übersprungen.');
  process.exit(0);
}

// ── 2. Status-Konfiguration (DE — Pre-Rendering immer in DE) ───────────────

const STATUS_DE = {
  'planned':     'Geplant',
  'in-progress': 'In Arbeit',
  'completed':   'Fertig ✓',
};

const CATEGORY_DE = {
  feature:  'Feature',
  fix:      'Fix',
  refactor: 'Refactor',
  security: 'Security',
};

// ── 3. Hilfsfunktionen ────────────────────────────────────────────────────

function markerClass(status) {
  if (status === 'completed')  return 'done';
  if (status === 'in-progress') return 'in-progress';
  return 'planned';
}

function tagClass(status) {
  if (status === 'completed')  return 'rm-tag status-done';
  if (status === 'in-progress') return 'rm-tag status-active';
  return 'rm-tag status-planned';
}

function formatDate(isoDate) {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (_) {
    return isoDate;
  }
}

// ── 4. Roadmap-Timeline HTML ──────────────────────────────────────────────

function renderRoadmapTimeline(entries) {
  if (!entries || entries.length === 0) {
    return `<div class="roadmap-empty-state reveal active"><p>Noch keine Einträge.</p></div>`;
  }

  const nodes = entries.map(e => {
    const title       = e.title_de || '';
    const desc        = e.description_de || '';
    const phaseLabel  = e.phase_label_de || '';
    const statusLabel = STATUS_DE[e.status] || e.status;
    const tagText     = phaseLabel || statusLabel;

    return `
        <div class="roadmap-node">
          <div class="node-marker ${markerClass(e.status)}"></div>
          <div class="roadmap-card">
            <span class="${tagClass(e.status)}">${tagText}</span>
            <h3 class="rm-title">${title}</h3>
            ${desc ? `<p class="rm-desc">${desc}</p>` : ''}
          </div>
        </div>`;
  }).join('');

  return `
      <div class="roadmap-wrapper reveal active">
        <div class="roadmap-line"></div>
        ${nodes}
      </div>`;
}

// ── 5. Changelog-Liste HTML ───────────────────────────────────────────────

function renderChangelogList(entries) {
  if (!entries || entries.length === 0) {
    return `<div class="roadmap-empty-state reveal active"><p>Noch keine Releases.</p></div>`;
  }

  const cards = entries.map(e => {
    const title = e.title_de || '';
    const desc  = e.description_de || '';
    return `
      <div class="changelog-card reveal active">
        <div class="changelog-card-meta">
          <span class="changelog-version">${e.version}</span>
          <span class="changelog-date">${formatDate(e.date)}</span>
          <span class="changelog-category ${e.category}">${CATEGORY_DE[e.category] || e.category}</span>
        </div>
        <h3 class="changelog-title">${title}</h3>
        ${desc ? `<p class="changelog-desc">${desc}</p>` : ''}
      </div>`;
  }).join('');

  return `<div class="changelog-list">${cards}</div>`;
}

// ── 5b. Changelog-Seite HTML (Jahres-Gruppierung, DE) ────────────────────

function renderChangelogPageDE(entries) {
  if (!entries || entries.length === 0) {
    return `<div class="changelog-empty-state"><p>Noch keine Releases.</p></div>`;
  }

  // Nach Jahr gruppieren (neueste oben)
  const byYear = new Map();
  for (const e of entries) {
    const year = new Date(e.date).getFullYear();
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year).push(e);
  }
  const years = [...byYear.keys()].sort((a, b) => b - a);

  return years.map(year => {
    const yearEntries = byYear.get(year);
    const entryItems = yearEntries.map(e => {
      const title = e.title_de || '';
      const desc  = e.description_de || '';
      return `
          <div class="changelog-timeline-entry reveal active" data-category="${e.category}">
            <div class="changelog-timeline-dot"></div>
            <div class="changelog-card ${e.category} reveal active">
              <div class="changelog-card-meta">
                <span class="changelog-version">${e.version}</span>
                <span class="changelog-date">${formatDate(e.date)}</span>
                <span class="changelog-category ${e.category}">${CATEGORY_DE[e.category] || e.category}</span>
              </div>
              <h3 class="changelog-title">${title}</h3>
              ${desc ? `<p class="changelog-desc">${desc}</p>` : ''}
            </div>
          </div>`;
    }).join('');

    return `
      <div class="changelog-year-group" data-year="${year}">
        <div class="changelog-year-header">
          <span class="changelog-year-label">${year}</span>
          <div class="changelog-year-line"></div>
        </div>
        <div class="changelog-timeline">
          <div class="changelog-timeline-line"></div>
          ${entryItems}
        </div>
      </div>`;
  }).join('');
}

// ── 6. Globale Roadmap-Seite (roadmap.html) ──────────────────────────────

function injectGlobalPage() {
  if (!fs.existsSync(roadmapPage)) {
    console.warn('⚠️  roadmap.html nicht gefunden — übersprungen.');
    return;
  }

  let content = fs.readFileSync(roadmapPage, 'utf-8');

  // Roadmap-Zone: scope=portfolio, ALLE Stati (completed + in-progress + planned).
  // MUSS identisch zu roadmap-renderer.ts sein — sonst Prerender (SEO) ≠ Client-Render.
  // Reihenfolge: abgeschlossene Errungenschaften → aktiv → geplant.
  // Completed-Einträge werden NICHT herausgefiltert — sie zeigen die Erfolgshistorie.
  const portfolioEntries = roadmapData.filter(e => e.scope === 'portfolio');
  const inProgress = portfolioEntries.filter(e => e.status === 'in-progress');
  const planned    = portfolioEntries.filter(e => e.status === 'planned');
  const completed  = portfolioEntries.filter(e => e.status === 'completed');
  const roadmapEntries = [...completed, ...inProgress, ...planned];

  const roadmapZoneHtml = `<div id="roadmap-global-zone">\n${renderRoadmapTimeline(roadmapEntries)}\n        </div>`;
  content = content.replace(
    /<!-- PRERENDER_ROADMAP_START -->[\s\S]*?<!-- PRERENDER_ROADMAP_END -->/,
    `<!-- PRERENDER_ROADMAP_START -->\n        ${roadmapZoneHtml}\n        <!-- PRERENDER_ROADMAP_END -->`
  );

  // Changelog-Zone
  const changelogEntries = Array.isArray(changelogData) ? changelogData : [];
  const changelogZoneHtml = `<div id="changelog-global-zone">\n${renderChangelogList(changelogEntries)}\n        </div>`;
  content = content.replace(
    /<!-- PRERENDER_CHANGELOG_START -->[\s\S]*?<!-- PRERENDER_CHANGELOG_END -->/,
    `<!-- PRERENDER_CHANGELOG_START -->\n        ${changelogZoneHtml}\n        <!-- PRERENDER_CHANGELOG_END -->`
  );

  fs.writeFileSync(roadmapPage, content, 'utf-8');
  console.log('✅ Roadmap + Changelog in roadmap.html injiziert');
}

// ── 7. Changelog-Seite (changelog.html) ──────────────────────────────────

function injectChangelogPage() {
  const changelogPage = path.join(webRoot, 'changelog.html');
  if (!fs.existsSync(changelogPage)) {
    console.warn('⚠️  changelog.html nicht gefunden — übersprungen.');
    return;
  }

  const entries = Array.isArray(changelogData) ? changelogData : [];
  const zoneHtml = `<div id="changelog-page-zone">\n${renderChangelogPageDE(entries)}\n        </div>`;

  let content = fs.readFileSync(changelogPage, 'utf-8');
  content = content.replace(
    /<!-- PRERENDER_CHANGELOG_PAGE_START -->[\s\S]*?<!-- PRERENDER_CHANGELOG_PAGE_END -->/,
    `<!-- PRERENDER_CHANGELOG_PAGE_START -->\n        ${zoneHtml}\n        <!-- PRERENDER_CHANGELOG_PAGE_END -->`
  );
  fs.writeFileSync(changelogPage, content, 'utf-8');
  console.log(`✅ Changelog-Seite (${entries.length} Releases) in changelog.html injiziert`);
}

// ── 8. Projekt-Subseiten (auto-scan) ─────────────────────────────────────

function injectProjectPages() {
  if (!fs.existsSync(projectsDir)) return;

  const htmlFiles = fs.readdirSync(projectsDir).filter(f => f.endsWith('.html'));

  let count = 0;
  for (const file of htmlFiles) {
    const filePath = path.join(projectsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Suche nach allen PRERENDER_ROADMAP_<SLUG>_START Markern (nicht der globale ohne SLUG)
    const markerPattern = /<!-- PRERENDER_ROADMAP_([A-Z0-9_-]+)_START -->[\s\S]*?<!-- PRERENDER_ROADMAP_\1_END -->/g;
    let matched = false;

    content = content.replace(markerPattern, (match, slugUpper) => {
      // Slug zurück in Kleinbuchstaben (HTML-IDs sind lowercase)
      const slug = slugUpper.toLowerCase();
      const projectEntries = roadmapData.filter(
        e => e.scope === 'project' && e.project_slug === slug
      );

      const containerHtml = `<div id="roadmap-project-${slug}">\n${renderRoadmapTimeline(projectEntries)}\n          </div>`;
      matched = true;
      return `<!-- PRERENDER_ROADMAP_${slugUpper}_START -->\n        ${containerHtml}\n        <!-- PRERENDER_ROADMAP_${slugUpper}_END -->`;
    });

    if (matched) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✅ Roadmap in projects/${file} injiziert`);
      count++;
    }
  }

  if (count === 0) {
    console.log('ℹ️  Keine Projekt-Subseiten mit Roadmap-Markern gefunden.');
  }
}

// ── 9. Ausführen ──────────────────────────────────────────────────────────

injectGlobalPage();
injectChangelogPage();
injectProjectPages();

console.log('Roadmap Pre-Rendering erfolgreich abgeschlossen.');
