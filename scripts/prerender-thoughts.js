/**
 * prerender-thoughts.js
 *
 * Pre-Rendering für SEO: Injiziert statisches Thoughts-HTML in:
 *   - index.html          (Teaser, 3 neueste Posts, #thoughts-teaser-grid)
 *   - thoughts/index.html (alle Posts, #thoughts-grid)
 *
 * Liest aus js/thoughts-data.js (auto-generiert von build-thoughts.mjs).
 * Neues Format: title_en/de/ar, excerpt_en/de/ar, has_de, has_ar
 *
 * ACHTUNG: Filter-/Sortier-Logik MUSS identisch zu src/ts/thoughts-renderer.ts
 *          bleiben — sonst entsteht der "verschwindet beim Laden"-Bug.
 *
 * Wird von GitHub Action publish-thoughts.yml nach build-thoughts.mjs aufgerufen.
 * Lokal testen (aus BETAPortfolioBach/):
 *   node scripts/prerender-thoughts.js
 */

const fs   = require('fs');
const path = require('path');

const rootDir       = path.resolve(__dirname, '..');
const webRoot       = path.join(rootDir, 'website');
const dataPath      = path.join(webRoot, 'js', 'thoughts-data.js');
const indexPage     = path.join(webRoot, 'index.html');
const overviewPage  = path.join(webRoot, 'thoughts', 'index.html');

console.log('Starte Thoughts Pre-Rendering...');

// ── 1. Daten einlesen ──────────────────────────────────────────────────────

if (!fs.existsSync(dataPath)) {
  console.warn('⚠️  js/thoughts-data.js nicht gefunden — Pre-Rendering übersprungen.');
  process.exit(0);
}

const dataCode = fs.readFileSync(dataPath, 'utf-8');
const getData  = new Function(dataCode + '\n return typeof thoughtsData !== "undefined" ? thoughtsData : [];');
const allPosts = getData();

if (!Array.isArray(allPosts)) {
  console.warn('⚠️  thoughtsData ist kein Array — Pre-Rendering übersprungen.');
  process.exit(0);
}

console.log(`  ${allPosts.length} Posts geladen.`);

// ── 2. Hilfsfunktionen ─────────────────────────────────────────────────────

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDateDE(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

// Für Prerender: DE bevorzugen wenn vorhanden, sonst EN
function resolveTitle(post) {
  return post.title_de || post.title_en || '';
}

function resolveExcerpt(post) {
  return post.excerpt_de || post.excerpt_en || '';
}

const LABELS_DE = {
  readMore:     'Weiterlesen →',
  minRead:      'Min. Lesezeit',
  fallbackNote: 'Nur auf EN verfügbar',
};

/**
 * Baut Karten-HTML für einen Post.
 * ACHTUNG: Muss strukturell identisch zu renderCard() in thoughts-renderer.ts sein.
 * Pre-Rendering fügt `active` zur .reveal-Klasse hinzu (sofort sichtbar ohne JS).
 */
function renderCard(post, basePath) {
  const title   = resolveTitle(post);
  const excerpt = resolveExcerpt(post);
  const date    = formatDateDE(post.published_at);
  const postUrl = basePath + post.slug + '.html';

  // Fallback-Badge: wenn kein DE-Titel vorhanden, zeige EN-Badge
  const isFallback = !post.title_de && Boolean(post.title_en);
  const fallbackBadge = isFallback
    ? `<span class="thought-card-lang-badge" title="${LABELS_DE.fallbackNote}">EN</span>`
    : '';

  const coverHtml = post.cover_image_url
    ? `<div class="thought-card-cover"><img src="${post.cover_image_url}" alt="${escapeHtml(title)}" loading="lazy" /></div>`
    : `<div class="thought-card-cover thought-card-cover--gradient"></div>`;

  const firstTag = (post.tags && post.tags.length > 0) ? post.tags[0] : '';
  const tagHtml  = firstTag
    ? `<span class="thought-card-tag">${escapeHtml(firstTag)}</span>`
    : '';

  const readingHtml = post.reading_minutes
    ? `<span class="thought-card-sep">·</span><span class="thought-card-reading">${post.reading_minutes} ${LABELS_DE.minRead}</span>`
    : '';

  return `
    <a href="${postUrl}" class="thought-card reveal active">
      ${coverHtml}
      <div class="thought-card-body">
        <div class="thought-card-meta">
          ${tagHtml}
          ${fallbackBadge}
          <span class="thought-card-date">${date}</span>
          ${readingHtml}
        </div>
        <h3 class="thought-card-title">${escapeHtml(title)}</h3>
        <p class="thought-card-excerpt">${escapeHtml(excerpt)}</p>
        <span class="thought-card-read">${LABELS_DE.readMore}</span>
      </div>
    </a>`;
}

/**
 * Ersetzt HTML zwischen zwei Marker-Kommentaren.
 */
function injectBetweenMarkers(html, startMarker, endMarker, injection) {
  const startIdx = html.indexOf(startMarker);
  const endIdx   = html.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    console.warn(`  ⚠️  Marker "${startMarker}" oder "${endMarker}" nicht gefunden — Abschnitt übersprungen.`);
    return html;
  }

  return html.slice(0, startIdx + startMarker.length)
    + '\n'
    + injection
    + '\n        '
    + html.slice(endIdx);
}

// ── 3. index.html — Teaser (3 neueste Posts) ────────────────────────────────

const teaserPosts = allPosts.slice(0, 3);
console.log(`  Teaser (index.html): ${teaserPosts.length} Posts.`);

if (!fs.existsSync(indexPage)) {
  console.warn('⚠️  index.html nicht gefunden — Teaser-Injection übersprungen.');
} else {
  let indexHtml = fs.readFileSync(indexPage, 'utf-8');

  let teaserHtml;
  if (teaserPosts.length === 0) {
    teaserHtml = `          <div class="thoughts-empty-teaser reveal active"><p>Noch keine Gedanken.</p></div>`;
  } else {
    teaserHtml = teaserPosts.map(p => renderCard(p, 'thoughts/')).join('');
  }

  indexHtml = injectBetweenMarkers(
    indexHtml,
    '<!-- PRERENDER_THOUGHTS_TEASER_START -->',
    '<!-- PRERENDER_THOUGHTS_TEASER_END -->',
    teaserHtml,
  );

  fs.writeFileSync(indexPage, indexHtml, 'utf-8');
  console.log('  ✅ index.html aktualisiert.');
}

// ── 4. thoughts/index.html — ALLE Posts ────────────────────────────────────

console.log(`  Übersicht (thoughts/index.html): ${allPosts.length} Posts.`);

if (!fs.existsSync(overviewPage)) {
  console.warn('⚠️  thoughts/index.html nicht gefunden — Listen-Injection übersprungen.');
} else {
  let overviewHtml = fs.readFileSync(overviewPage, 'utf-8');

  let listHtml;
  if (allPosts.length === 0) {
    listHtml = `          <div class="thoughts-empty-state reveal active"><p data-i18n="thoughts_empty">Noch keine Gedanken — kommt bald.</p></div>`;
  } else {
    listHtml = allPosts.map(p => renderCard(p, '')).join('');
  }

  overviewHtml = injectBetweenMarkers(
    overviewHtml,
    '<!-- PRERENDER_THOUGHTS_LIST_START -->',
    '<!-- PRERENDER_THOUGHTS_LIST_END -->',
    listHtml,
  );

  fs.writeFileSync(overviewPage, overviewHtml, 'utf-8');
  console.log('  ✅ thoughts/index.html aktualisiert.');
}

console.log('Thoughts Pre-Rendering abgeschlossen.');
