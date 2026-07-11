"use strict";
/**
 * ============================================================================
 * github-activity.ts → js/github-activity.js
 *
 * Rendert das GitHub-Activity-Widget auf der Startseite:
 *   - Contribution-Heatmap (Portfolio-Lila, 5 Stufen) mit Hover-Tooltips
 *   - Repo-Statistiken (Count-up-Animation)
 *   - Top-Sprachen-Leiste (gestapelter Balken + Legende)
 *
 * Datenquelle: js/github-activity-data.js (global `githubActivity`,
 * auto-generiert via scripts/build-github-activity.mjs).
 * Liest Sprache aus localStorage, re-rendert bei `languagechange`.
 * ============================================================================
 */
// ─── Geometrie (muss zu css/github-activity.css passen) ───────────────────────
const CELL_STEP = 15; // 11px Zelle + 4px gap
const WEEKDAY_COL = 30; // 22px Spalte + 8px gap
const L = {
    de: {
        less: 'Weniger', more: 'Mehr',
        repos: 'Öffentliche Repos', stars: 'Stars', followers: 'Follower', since: 'Coding seit',
        languages: 'Top-Sprachen',
        contributions: n => `<b>${n}</b> Beiträge im letzten Jahr`,
        tooltip: (n, date) => `${n} ${n === 1 ? 'Beitrag' : 'Beiträge'} · ${date}`,
        empty: 'Aktivitätsdaten werden geladen…',
    },
    en: {
        less: 'Less', more: 'More',
        repos: 'Public repos', stars: 'Stars', followers: 'Followers', since: 'Coding since',
        languages: 'Top languages',
        contributions: n => `<b>${n}</b> contributions in the last year`,
        tooltip: (n, date) => `${n} ${n === 1 ? 'contribution' : 'contributions'} · ${date}`,
        empty: 'Loading activity data…',
    },
    ar: {
        less: 'أقل', more: 'أكثر',
        repos: 'مستودعات عامة', stars: 'نجوم', followers: 'متابعون', since: 'يبرمج منذ',
        languages: 'أهم اللغات',
        contributions: n => `<b>${n}</b> مساهمة في العام الماضي`,
        tooltip: (n, date) => `${n} مساهمة · ${date}`,
        empty: 'يتم تحميل بيانات النشاط…',
    },
};
// ─── Kuratierte On-Brand-Sprachpalette (Lila-Familie + Neutral für "Other") ───
const LANG_COLORS = ['#9d4edd', '#c77dff', '#7b2cbf', '#b388eb', '#5a189a'];
const LANG_OTHER = 'rgba(255,255,255,0.18)';
// ─── Inline-Icons (lucide-Stil) ───────────────────────────────────────────────
const ICONS = {
    repos: '<svg class="gh-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/></svg>',
    stars: '<svg class="gh-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    followers: '<svg class="gh-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    since: '<svg class="gh-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
};
// ─── Helfer ───────────────────────────────────────────────────────────────────
function ghLang() {
    try {
        const l = window.__PAGE_LANG__;
        return (l === 'en' || l === 'ar') ? l : 'de';
    }
    catch (_a) {
        return 'de';
    }
}
function ghLocale(lang) {
    return lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-GB' : 'de-DE';
}
function fmtNumber(n, lang) {
    return n.toLocaleString(ghLocale(lang));
}
function fmtFullDate(iso, lang) {
    try {
        return new Date(iso).toLocaleDateString(ghLocale(lang), { day: 'numeric', month: 'long', year: 'numeric' });
    }
    catch (_a) {
        return iso;
    }
}
function fmtMonth(iso, lang) {
    try {
        return new Date(iso).toLocaleDateString(ghLocale(lang), { month: 'short' });
    }
    catch (_a) {
        return '';
    }
}
// ─── Heatmap-HTML ─────────────────────────────────────────────────────────────
function renderContrib(data, lang) {
    const t = L[lang];
    const cal = data.calendar;
    // Monats-Labels (absolut positioniert über den Wochen-Spalten)
    const months = cal.monthLabels.map(m => {
        const left = WEEKDAY_COL + m.weekIndex * CELL_STEP;
        return `<span class="gh-month-label" style="left:${left}px">${fmtMonth(m.date, lang)}</span>`;
    }).join('');
    // Wochentag-Labels (Mo/Mi/Fr — Index 1,3,5)
    const wd = ghLocale(lang);
    const weekdayName = (idx) => {
        // 2024-01-07 ist ein Sonntag → +idx Tage
        const d = new Date(Date.UTC(2024, 0, 7 + idx));
        return d.toLocaleDateString(wd, { weekday: 'short' }).slice(0, 2);
    };
    const weekdays = [0, 1, 2, 3, 4, 5, 6].map(i => `<span class="gh-weekday">${(i === 1 || i === 3 || i === 5) ? weekdayName(i) : ''}</span>`).join('');
    // Wochen-Spalten
    const grid = cal.weeks.map((week, wi) => `<div class="gh-week">${week.map(day => {
        if (!day.date)
            return `<span class="gh-day pad"></span>`;
        return `<span class="gh-day l${day.level} gh-reveal" data-c="${day.count}" data-d="${day.date}" style="transition-delay:${wi * 12}ms"></span>`;
    }).join('')}</div>`).join('');
    // Legende
    const legendCells = [0, 1, 2, 3, 4].map(l => `<span class="gh-day l${l}"></span>`).join('');
    return `
    <div class="gh-contrib-head">
      <span class="gh-contrib-total">${t.contributions(fmtNumber(data.totalContributions, lang))}</span>
    </div>
    <div class="gh-graph-scroll">
      <div class="gh-graph">
        <div class="gh-months">${months}</div>
        <div class="gh-graph-body">
          <div class="gh-weekdays">${weekdays}</div>
          <div class="gh-grid">${grid}</div>
        </div>
      </div>
    </div>
    <div class="gh-legend">
      <span>${t.less}</span>
      <span class="gh-legend-cells">${legendCells}</span>
      <span>${t.more}</span>
    </div>`;
}
// ─── Stats-HTML ───────────────────────────────────────────────────────────────
function renderStats(data, lang) {
    const t = L[lang];
    const s = data.stats;
    const tiles = [];
    const tile = (icon, value, label, animate) => `<div class="gh-stat">
       ${ICONS[icon]}
       <span class="gh-stat-value"${animate ? ` data-count="${value}"` : ''}>${animate ? '0' : value}</span>
       <span class="gh-stat-label">${label}</span>
     </div>`;
    tiles.push(tile('repos', s.publicRepos, t.repos, true));
    tiles.push(tile('stars', s.totalStars, t.stars, true));
    if (s.followers > 0)
        tiles.push(tile('followers', s.followers, t.followers, true));
    tiles.push(tile('since', s.codingSince, t.since, false));
    return `<div class="gh-stats">${tiles.join('')}</div>`;
}
// ─── Sprachen-HTML ────────────────────────────────────────────────────────────
function renderLangs(data, lang) {
    if (!data.languages || data.languages.length === 0)
        return '';
    const t = L[lang];
    const colorOf = (name, i) => name === 'Other' ? LANG_OTHER : LANG_COLORS[i % LANG_COLORS.length];
    const segs = data.languages.map((l, i) => `<span class="gh-lang-seg" style="width:${l.percent}%;background:${colorOf(l.name, i)}" title="${l.name} ${l.percent}%"></span>`).join('');
    const legend = data.languages.map((l, i) => `<span class="gh-lang-item">
       <span class="gh-lang-dot" style="background:${colorOf(l.name, i)}"></span>
       ${l.name} <span class="gh-lang-pct">${l.percent}%</span>
     </span>`).join('');
    return `
    <div class="gh-langs">
      <div class="gh-langs-title">${t.languages}</div>
      <div class="gh-lang-bar">${segs}</div>
      <div class="gh-lang-legend">${legend}</div>
    </div>`;
}
// ─── Tooltip ──────────────────────────────────────────────────────────────────
let tooltipEl = null;
function ensureTooltip() {
    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.className = 'gh-tooltip';
        document.body.appendChild(tooltipEl);
    }
    return tooltipEl;
}
function attachTooltips(root, lang) {
    const tip = ensureTooltip();
    root.querySelectorAll('.gh-day:not(.pad)[data-d]').forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            const count = Number(cell.dataset.c || '0');
            const date = fmtFullDate(cell.dataset.d || '', lang);
            tip.innerHTML = L[lang].tooltip(count, date);
            tip.classList.add('show');
        });
        cell.addEventListener('mousemove', e => {
            tip.style.left = e.clientX + 'px';
            tip.style.top = (e.clientY - 14) + 'px';
        });
        cell.addEventListener('mouseleave', () => tip.classList.remove('show'));
    });
}
// ─── Reveal (gestaffelt, spaltenweise) + Count-up ─────────────────────────────
function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function ghActivateReveal(root) {
    const cells = root.querySelectorAll('.gh-day.gh-reveal');
    if (prefersReducedMotion()) {
        cells.forEach(c => c.classList.add('in'));
        return;
    }
    requestAnimationFrame(() => cells.forEach(c => c.classList.add('in')));
}
function countUp(root, lang) {
    const targets = root.querySelectorAll('.gh-stat-value[data-count]');
    targets.forEach(el => {
        const target = Number(el.dataset.count || '0');
        if (prefersReducedMotion() || target === 0) {
            el.textContent = fmtNumber(target, lang);
            return;
        }
        const duration = 1100;
        const start = performance.now();
        const step = (now) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
            el.textContent = fmtNumber(Math.round(target * eased), lang);
            if (p < 1)
                requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    });
}
// ─── Haupt-Render ─────────────────────────────────────────────────────────────
let revealObserver = null;
function renderWidget() {
    const root = document.getElementById('gh-widget');
    if (!root)
        return;
    if (typeof githubActivity === 'undefined' || !githubActivity) {
        root.innerHTML = `<div class="gh-empty">${L[ghLang()].empty}</div>`;
        return;
    }
    const lang = ghLang();
    const data = githubActivity;
    root.innerHTML =
        renderContrib(data, lang) +
            `<div class="gh-divider"></div>` +
            renderStats(data, lang) +
            renderLangs(data, lang);
    attachTooltips(root, lang);
    // Reveal + Count-up beim Scroll-in-View (einmalig)
    if (revealObserver)
        revealObserver.disconnect();
    revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                ghActivateReveal(root);
                countUp(root, lang);
                obs.disconnect();
            }
        });
    }, { threshold: 0.15 });
    revealObserver.observe(root);
}
// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', renderWidget);
window.addEventListener('languagechange', renderWidget);
