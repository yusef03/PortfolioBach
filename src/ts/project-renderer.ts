/**
 * ============================================================================
 * DATEI: src/ts/project-renderer.ts
 * BESCHREIBUNG:
 * Kern-Logik für das dynamische Rendering der Projektinhalte.
 * Liest Sprache direkt aus localStorage (kein data-i18n für Projekt-Texte).
 * Re-rendert bei Sprachwechsel via 'languagechange' Event.
 * Datenquelle: js/projects-data.js (auto-generiert via Supabase)
 * ============================================================================
 */

// --- Status-Label-Map (dreisprachig) -----------------------------------------

const STATUS_LABELS: Record<string, Record<string, string>> = {
  de: { active: 'Aktiv', 'in-progress': 'In Entwicklung', completed: 'Abgeschlossen' },
  en: { active: 'Active', 'in-progress': 'In Progress', completed: 'Completed' },
  ar: { active: 'نشط', 'in-progress': 'قيد التطوير', completed: 'مكتمل' },
};

// --- Hilfsfunktionen ---------------------------------------------------------

function getLang(): string {
  try {
    return window.__PAGE_LANG__ || 'de';
  } catch {
    return 'de';
  }
}

function getDescription(p: Project, lang: string): string {
  if (lang === 'en') return p.description_en || p.description_de;
  if (lang === 'ar') return p.description_ar || p.description_de;
  return p.description_de;
}

function getFeatureText(f: ProjectFeature, lang: string): string {
  if (lang === 'en') return f.en || f.de;
  if (lang === 'ar') return f.ar || f.de;
  return f.de;
}

function getStatusLabel(status: ProjectStatus, lang: string): string {
  return STATUS_LABELS[lang]?.[status] || STATUS_LABELS['de'][status] || status;
}

function getStatusClass(status: ProjectStatus): string {
  return `status-${status}`;
}

/** Baut den img/picture-Tag. WebP-Trick nur für lokale Pfade (nicht für Supabase-URLs). */
function renderImageTag(imageUrl: string, cssClass: string, alt: string): string {
  if (!imageUrl) {
    return `<img src="" alt="${alt}"${cssClass ? ` class="${cssClass}"` : ''} loading="lazy">`;
  }

  // Supabase-URL oder externe URL: kein WebP-Trick, kein <picture>
  if (imageUrl.startsWith('http')) {
    return `<img src="${imageUrl}" alt="${alt}"${cssClass ? ` class="${cssClass}"` : ''} loading="lazy">`;
  }

  // Lokaler Pfad: absolut auflösen — funktioniert auf /, /projects/, /en/, /ar/ gleich
  // (früherer ../-Trick brach unter /en/ + /ar/).
  const abs = '/' + imageUrl.replace(/^(\.\.\/)+/, '').replace(/^\/+/, '');
  const webpSrc = abs.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  return `<picture>
               <source srcset="${webpSrc}" type="image/webp">
               <img src="${abs}" alt="${alt}"${cssClass ? ` class="${cssClass}"` : ''} loading="lazy">
           </picture>`;
}

/** Nach Re-Render beim Sprachwechsel: reveal-Elemente sofort einblenden (User sieht sie schon). */
function activateRevealElements(container: Element): void {
  requestAnimationFrame(() => {
    container.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('active');
    });
  });
}

// --- Render-Hauptfunktion ----------------------------------------------------

function renderAll(isLanguageSwitch: boolean): void {
  if (typeof projectsData === 'undefined') return;

  const lang = getLang();
  const heroContainer = document.getElementById('hero-project-container');
  const archiveContainer = document.getElementById('archive-grid-container');

  // Hero: erstes Projekt mit is_hero=true, Fallback auf index 0
  const heroItem = projectsData.find((p) => p.is_hero) ?? projectsData[0];
  // Archiv: alle Nicht-Hero-Projekte (schon nach sort_order sortiert vom Build-Script)
  const archiveItems = projectsData.filter((p) => !p.is_hero);

  // Hero rendern
  if (heroContainer && heroItem) {
    heroContainer.innerHTML = renderHeroTemplate(heroItem, lang);
    if (isLanguageSwitch) activateRevealElements(heroContainer);
  }

  // Archiv rendern
  if (archiveContainer) {
    // Bildpfade werden in renderImageTag absolut aufgelöst — keine Subfolder-Anpassung nötig
    let gridHTML = '';

    archiveItems.forEach((item) => {
      gridHTML += renderArchiveTemplate(item, lang);
    });

    gridHTML += renderGithubCardTemplate(lang);
    archiveContainer.innerHTML = gridHTML;
    if (isLanguageSwitch) activateRevealElements(archiveContainer);
  }
}

// --- Templates ---------------------------------------------------------------

function renderHeroTemplate(p: Project, lang: string): string {
  const badges = p.badges.map((b) => `<span class="tech-badge">${b}</span>`).join('');

  const features =
    p.features && p.features.length > 0
      ? p.features.map((f) => `<li>${getFeatureText(f, lang)}</li>`).join('')
      : '';

  const description = getDescription(p, lang);
  const subpageLink = p.subpage_url || '';
  const codeLink = p.github_url || '';

  const viewLabel = lang === 'en' ? 'View Case' : lang === 'ar' ? 'عرض المشروع' : 'Zum Projekt';
  const codeLabel = lang === 'en' ? 'View Code' : lang === 'ar' ? 'عرض الكود' : 'Code ansehen';

  return `
    <div class="project-info reveal">
        <div class="hero-project-layout">
            <div class="hero-image-wrapper">
                 ${renderImageTag(p.image_url, 'hero-project-img', p.title)}
            </div>
            <div class="hero-text-wrapper">
                <h3>${p.title}</h3>
                <div class="tech-stack-row">${badges}</div>
                <p class="project-description">${description}</p>
                ${features ? `<ul class="project-features">${features}</ul>` : ''}
                <div class="project-buttons">
                    ${subpageLink ? `<a href="${subpageLink}" class="cta-button">${viewLabel}</a>` : ''}
                    ${codeLink ? `<a href="${codeLink}" target="_blank" class="cta-button cta-button-outline">${codeLabel}</a>` : ''}
                </div>
            </div>
        </div>
    </div>`;
}

function renderArchiveTemplate(p: Project, lang: string): string {
  // Dateiname aus subpage_url für relative Verlinkung im Archiv
  const relativeLink = p.subpage_url ? p.subpage_url.split('/').pop() || '#' : '#';
  const description = getDescription(p, lang);
  const statusLabel = getStatusLabel(p.status, lang);
  const statusClass = getStatusClass(p.status);

  return `
    <div class="archive-card reveal">
        <div class="archive-img-container">
            ${renderImageTag(p.image_url, '', 'Project Preview')}
            <div class="overlay">
                <a href="${relativeLink}" class="view-btn">View Case</a>
            </div>
        </div>
        <div class="card-content">
            <div class="card-header">
                <h4>${p.title}</h4>
                <span class="status-badge ${statusClass}">${statusLabel}</span>
            </div>
            <p class="card-desc">${description}</p>
            <div class="card-tags">
                ${p.badges.map((b) => `<span>${b}</span>`).join('')}
            </div>
        </div>
    </div>`;
}

function renderGithubCardTemplate(lang: string): string {
  // Fallback falls githubCard nicht gesetzt (z.B. lokale Entwicklung ohne generierte Datei)
  if (typeof githubCard === 'undefined') {
    return `
    <div class="archive-card github-card reveal">
        <div class="github-content">
            <div class="github-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="currentColor" width="50" height="50">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.655-3.795-1.275-3.795-1.275-.54-1.38-1.335-1.755-1.335-1.755-1.095-.75.075-.735.075-.735 1.215.09 1.845 1.245 1.845 1.245 1.08 1.86 2.805 1.32 3.495 1.005.105-.78.42-1.32.765-1.62-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.52 1.23-3.42-.12-.3-.54-1.62.12-3.375 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 2.04.135 3 .405 2.28-1.56 3.285-1.23 3.285-1.23.66 1.755.24 3.075.12 3.375.765.9 1.23 2.115 1.23 3.42 0 4.605-2.805 5.61-5.475 5.91.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
            </div>
            <h3>Mehr auf GitHub</h3>
            <p>Schau dir meine aktuellen Repositories, Experimente und Code-Snippets an.</p>
            <a href="https://github.com/yusef03" target="_blank" class="cta-button cta-button-outline">
                Zum Profil &rarr;
            </a>
        </div>
    </div>`;
  }

  const title = lang === 'en' ? githubCard.title_en : lang === 'ar' ? githubCard.title_ar : githubCard.title_de;
  const text  = lang === 'en' ? githubCard.text_en  : lang === 'ar' ? githubCard.text_ar  : githubCard.text_de;
  const btn   = lang === 'en' ? githubCard.btn_en   : lang === 'ar' ? githubCard.btn_ar   : githubCard.btn_de;

  return `
    <div class="archive-card github-card reveal">
        <div class="github-content">
            <div class="github-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="currentColor" width="50" height="50">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.655-3.795-1.275-3.795-1.275-.54-1.38-1.335-1.755-1.335-1.755-1.095-.75.075-.735.075-.735 1.215.09 1.845 1.245 1.845 1.245 1.08 1.86 2.805 1.32 3.495 1.005.105-.78.42-1.32.765-1.62-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.52 1.23-3.42-.12-.3-.54-1.62.12-3.375 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 2.04.135 3 .405 2.28-1.56 3.285-1.23 3.285-1.23.66 1.755.24 3.075.12 3.375.765.9 1.23 2.115 1.23 3.42 0 4.605-2.805 5.61-5.475 5.91.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
            </div>
            <h3>${title}</h3>
            <p>${text}</p>
            <a href="${githubCard.url}" target="_blank" class="cta-button cta-button-outline">
                ${btn} &rarr;
            </a>
        </div>
    </div>`;
}

// --- Initialisierung ---------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  if (typeof projectsData === 'undefined') return;
  renderAll(false);
});

// Sprachwechsel: Karten in der aktuellen Sprache neu rendern
window.addEventListener('languagechange', () => {
  renderAll(true);
});
