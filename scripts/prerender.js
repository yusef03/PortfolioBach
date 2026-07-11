/**
 * prerender.js
 *
 * Pre-Rendering für SEO: Injiziert statisches HTML (DE) in index.html und archive.html.
 * Liest aus js/projects-data.js (auto-generiert von build-projects.mjs).
 *
 * Wird von GitHub Action publish-projects.yml nach build-projects.mjs aufgerufen.
 * Lokal testen (aus BETAPortfolioBach/):
 *   node scripts/prerender.js
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const webRoot = path.join(rootDir, 'website');
const dataPath = path.join(webRoot, 'js', 'projects-data.js');
const indexPath = path.join(webRoot, 'index.html');
const archivePath = path.join(webRoot, 'projects', 'archive.html');

console.log('Starte Pre-Rendering für SEO...');

// 1. Daten einlesen — wrapped function trick (keine ES-Module, kein import)
const dataCode = fs.readFileSync(dataPath, 'utf-8');
const wrappedCode = `
  ${dataCode}
  return { projectsData, githubCard };
`;
const getData = new Function(wrappedCode);
const { projectsData, githubCard } = getData();

// 2. Status-Labels (DE — für Pre-Rendering immer DE, JS rendert dann sprachabhängig)
const STATUS_DE = {
  active: 'Aktiv',
  'in-progress': 'In Entwicklung',
  completed: 'Abgeschlossen',
};

// 3. Bild-Tag generieren (WebP-Trick nur für lokale Pfade)
function renderImageTag(imageUrl, cssClass, alt, prefix) {
  if (!imageUrl) return `<img src="" alt="${alt}"${cssClass ? ` class="${cssClass}"` : ''} loading="lazy">`;
  const src = prefix && !imageUrl.startsWith('http') ? prefix + imageUrl : imageUrl;
  if (imageUrl.startsWith('http')) {
    return `<img src="${src}" alt="${alt}"${cssClass ? ` class="${cssClass}"` : ''} loading="lazy">`;
  }
  const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  return `<picture>
                     <source srcset="${webpSrc}" type="image/webp">
                     <img src="${src}" alt="${alt}"${cssClass ? ` class="${cssClass}"` : ''} loading="lazy">
                 </picture>`;
}

// 4. Templates
function renderHeroTemplate(p) {
  const badges = p.badges.map(b => `<span class="tech-badge">${b}</span>`).join('');
  const features = p.features && p.features.length > 0
    ? p.features.map(f => `<li>${f.de || ''}</li>`).join('')
    : '';
  const statusLabel = STATUS_DE[p.status] || p.status;
  const statusClass = `status-${p.status}`;
  const subpageLink = p.subpage_url || '';
  const codeLink = p.github_url || '';

  return `
    <div class="project-info reveal active">
        <div class="hero-project-layout">
            <div class="hero-image-wrapper">
                 ${renderImageTag(p.image_url, 'hero-project-img', p.title, '')}
            </div>
            <div class="hero-text-wrapper">
                <h3>${p.title}</h3>
                <div class="tech-stack-row">${badges}</div>
                <p class="project-description">${p.description_de || ''}</p>
                ${features ? `<ul class="project-features">${features}</ul>` : ''}
                <div class="project-buttons">
                    ${subpageLink ? `<a href="${subpageLink}" class="cta-button">Zum Projekt</a>` : ''}
                    ${codeLink ? `<a href="${codeLink}" target="_blank" class="cta-button cta-button-outline">Code ansehen</a>` : ''}
                </div>
            </div>
        </div>
    </div>`;
}

function renderArchiveTemplate(p) {
  const relativeLink = p.subpage_url ? p.subpage_url.split('/').pop() : '#';
  const statusLabel = STATUS_DE[p.status] || p.status;
  const statusClass = `status-${p.status}`;

  return `
    <div class="archive-card reveal active">
        <div class="archive-img-container">
            ${renderImageTag(p.image_url, '', 'Project Preview', '../')}
            <div class="overlay">
                <a href="${relativeLink}" class="view-btn">View Case</a>
            </div>
        </div>
        <div class="card-content">
            <div class="card-header">
                <h4>${p.title}</h4>
                <span class="status-badge ${statusClass}">${statusLabel}</span>
            </div>
            <p class="card-desc">${p.description_de || ''}</p>
            <div class="card-tags">
                ${p.badges.map(b => `<span>${b}</span>`).join('')}
            </div>
        </div>
    </div>`;
}

function renderGithubCardHtml(card) {
  const title = card ? card.title_de : 'Mehr auf GitHub';
  const text = card ? card.text_de : 'Schau dir meine aktuellen Repositories, Experimente und Code-Snippets an.';
  const btn = card ? card.btn_de : 'Zum Profil';
  const url = card ? card.url : 'https://github.com/yusef03';

  return `
    <div class="archive-card github-card reveal active">
        <div class="github-content">
            <div class="github-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="currentColor" width="50" height="50">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.655-3.795-1.275-3.795-1.275-.54-1.38-1.335-1.755-1.335-1.755-1.095-.75.075-.735.075-.735 1.215.09 1.845 1.245 1.845 1.245 1.08 1.86 2.805 1.32 3.495 1.005.105-.78.42-1.32.765-1.62-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.52 1.23-3.42-.12-.3-.54-1.62.12-3.375 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 2.04.135 3 .405 2.28-1.56 3.285-1.23 3.285-1.23.66 1.755.24 3.075.12 3.375.765.9 1.23 2.115 1.23 3.42 0 4.605-2.805 5.61-5.475 5.91.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
            </div>
            <h3>${title}</h3>
            <p>${text}</p>
            <a href="${url}" target="_blank" class="cta-button cta-button-outline">
                ${btn} &rarr;
            </a>
        </div>
    </div>`;
}

// 5. Generieren
const heroItem = projectsData.find(p => p.is_hero) || projectsData[0];
const archiveItems = projectsData.filter(p => !p.is_hero);

const heroHtml = heroItem ? renderHeroTemplate(heroItem) : '';
let archiveHtml = archiveItems.map(renderArchiveTemplate).join('');
archiveHtml += renderGithubCardHtml(githubCard);

// 6. In index.html injizieren
let indexContent = fs.readFileSync(indexPath, 'utf-8');
indexContent = indexContent.replace(
  /<!-- PRERENDER_HERO_START -->[\s\S]*?<!-- PRERENDER_HERO_END -->/,
  `<!-- PRERENDER_HERO_START -->\n${heroHtml}\n<!-- PRERENDER_HERO_END -->`
);
fs.writeFileSync(indexPath, indexContent, 'utf-8');
console.log('✅ Hero-Projekt in index.html injiziert');

// 7. In archive.html injizieren
let archiveContent = fs.readFileSync(archivePath, 'utf-8');
archiveContent = archiveContent.replace(
  /<!-- PRERENDER_ARCHIVE_START -->[\s\S]*?<!-- PRERENDER_ARCHIVE_END -->/,
  `<!-- PRERENDER_ARCHIVE_START -->\n${archiveHtml}\n<!-- PRERENDER_ARCHIVE_END -->`
);
fs.writeFileSync(archivePath, archiveContent, 'utf-8');
console.log('✅ Archiv-Grid in archive.html injiziert');

console.log('Pre-Rendering erfolgreich abgeschlossen.');
