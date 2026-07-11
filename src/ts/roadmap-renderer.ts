/**
 * ============================================================================
 * DATEI: src/ts/roadmap-renderer.ts
 * BESCHREIBUNG:
 * Rendert Roadmap-Einträge dynamisch auf:
 *   - /roadmap.html (globale Portfolio-Roadmap + Changelog)
 *   - Projekt-Subseiten (StudyNexus, CV, etc.) — via project_slug Filterung
 *
 * Liest Sprache direkt aus localStorage. Re-rendert bei Sprachwechsel.
 * Datenquelle: js/roadmap-data.js (auto-generiert via Supabase)
 * ============================================================================
 */

// ─── Status-Konfiguration ────────────────────────────────────────────────────

const STATUS_CONFIG = {
  de: {
    planned: 'Geplant',
    'in-progress': 'In Arbeit',
    completed: 'Fertig ✓',
  },
  en: {
    planned: 'Planned',
    'in-progress': 'In Progress',
    completed: 'Done ✓',
  },
  ar: {
    planned: 'مخطط',
    'in-progress': 'قيد التنفيذ',
    completed: 'مكتمل ✓',
  },
} as const

const CATEGORY_LABELS = {
  de: { feature: 'Feature', fix: 'Fix', refactor: 'Refactor', security: 'Security' },
  en: { feature: 'Feature', fix: 'Fix', refactor: 'Refactor', security: 'Security' },
  ar: { feature: 'ميزة', fix: 'إصلاح', refactor: 'إعادة بناء', security: 'أمان' },
} as const

// ─── Hilfsfunktionen ─────────────────────────────────────────────────────────

function getRoadmapLang(): 'de' | 'en' | 'ar' {
  try {
    const l = window.__PAGE_LANG__
    return (l === 'en' || l === 'ar') ? l : 'de'
  } catch {
    return 'de'
  }
}

function getText(entry: RoadmapEntry, field: 'title' | 'description' | 'phase_label', lang: 'de' | 'en' | 'ar'): string {
  const key = `${field}_${lang}` as keyof RoadmapEntry
  const fallback = `${field}_de` as keyof RoadmapEntry
  return (entry[key] as string) || (entry[fallback] as string) || ''
}

function getChangelogText(entry: ChangelogEntry, field: 'title' | 'description', lang: 'de' | 'en' | 'ar'): string {
  const key = `${field}_${lang}` as keyof ChangelogEntry
  const fallback = `${field}_de` as keyof ChangelogEntry
  return (entry[key] as string) || (entry[fallback] as string) || ''
}

function markerClass(status: RoadmapStatus): string {
  if (status === 'completed') return 'done'
  if (status === 'in-progress') return 'in-progress'
  return 'planned'
}

function activateReveal(container: Element): void {
  requestAnimationFrame(() => {
    container.querySelectorAll('.reveal').forEach(el => el.classList.add('active'))
  })
}

function formatDate(isoDate: string, lang: 'de' | 'en' | 'ar'): string {
  try {
    const d = new Date(isoDate)
    const locale = lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-GB' : 'de-DE'
    return d.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return isoDate
  }
}

// ─── Roadmap-Renderer ────────────────────────────────────────────────────────

/** Rendert eine Liste von Roadmap-Einträgen als vertikale Timeline HTML */
function renderRoadmapTimeline(entries: RoadmapEntry[], lang: 'de' | 'en' | 'ar'): string {
  if (entries.length === 0) {
    const emptyText = lang === 'en' ? 'No entries yet.' : lang === 'ar' ? 'لا توجد إدخالات بعد.' : 'Noch keine Einträge.'
    return `<div class="roadmap-empty-state reveal"><p>${emptyText}</p></div>`
  }

  const nodes = entries.map((e) => {
    const title = getText(e, 'title', lang)
    const desc = getText(e, 'description', lang)
    const phaseLabel = getText(e, 'phase_label', lang)
    const statusLabel = STATUS_CONFIG[lang][e.status] || e.status

    // Phase-Label oder Status-Label als rm-tag
    const tagText = phaseLabel || statusLabel
    const tagClass = `rm-tag status-${e.status === 'completed' ? 'done' : e.status === 'in-progress' ? 'active' : 'planned'}`

    return `
        <div class="roadmap-node roadmap-node--${e.status}">
          <div class="node-marker ${markerClass(e.status)}"></div>
          <div class="roadmap-card">
            <span class="${tagClass}">${tagText}</span>
            <h3 class="rm-title">${title}</h3>
            ${desc ? `<p class="rm-desc">${desc}</p>` : ''}
          </div>
        </div>`
  }).join('')

  return `
      <div class="roadmap-wrapper reveal">
        <div class="roadmap-line"></div>
        ${nodes}
      </div>`
}

// ─── Changelog-Renderer (Teaser — flache Karten-Liste, max. n Einträge) ─────

function renderChangelogList(entries: ChangelogEntry[], lang: 'de' | 'en' | 'ar', limit?: number): string {
  const slice = limit ? entries.slice(0, limit) : entries
  if (slice.length === 0) {
    const emptyText = lang === 'en' ? 'No releases yet.' : lang === 'ar' ? 'لا توجد إصدارات بعد.' : 'Noch keine Releases.'
    return `<div class="changelog-empty-state reveal"><p>${emptyText}</p></div>`
  }

  const cards = slice.map((e) => {
    const title = getChangelogText(e, 'title', lang)
    const desc = getChangelogText(e, 'description', lang)
    return `
      <div class="changelog-card ${e.category} reveal">
        <div class="changelog-card-meta">
          <span class="changelog-version">${e.version}</span>
          <span class="changelog-date">${formatDate(e.date, lang)}</span>
          <span class="changelog-category ${e.category}">${CATEGORY_LABELS[lang][e.category] || e.category}</span>
        </div>
        <h3 class="changelog-title">${title}</h3>
        ${desc ? `<p class="changelog-desc">${desc}</p>` : ''}
      </div>`
  }).join('')

  return `<div class="changelog-list">${cards}</div>`
}

// ─── Changelog-Renderer (Seite — Jahres-Gruppierung + Timeline-Dots) ─────────

function renderChangelogPage(entries: ChangelogEntry[], lang: 'de' | 'en' | 'ar'): string {
  if (entries.length === 0) {
    const emptyText = lang === 'en' ? 'No releases yet.' : lang === 'ar' ? 'لا توجد إصدارات بعد.' : 'Noch keine Releases.'
    return `<div class="changelog-empty-state"><p>${emptyText}</p></div>`
  }

  // Nach Jahr gruppieren (neueste oben)
  const byYear = new Map<number, ChangelogEntry[]>()
  for (const e of entries) {
    const year = new Date(e.date).getFullYear()
    if (!byYear.has(year)) byYear.set(year, [])
    byYear.get(year)!.push(e)
  }
  const years = [...byYear.keys()].sort((a, b) => b - a)

  const groups = years.map(year => {
    const yearEntries = byYear.get(year)!
    const entryItems = yearEntries.map(e => {
      const title = getChangelogText(e, 'title', lang)
      const desc  = getChangelogText(e, 'description', lang)
      const clickable = desc ? ' changelog-card--clickable' : ''
      const attrs = desc ? ' role="button" tabindex="0" aria-haspopup="dialog"' : ''
      const arrow = lang === 'ar' ? '‹' : '›'
      return `
          <div class="changelog-timeline-entry reveal" data-category="${e.category}">
            <div class="changelog-timeline-dot"></div>
            <div class="changelog-card${clickable} ${e.category}"${attrs}>
              <div class="changelog-card-meta">
                <span class="changelog-version">${e.version}</span>
                <span class="changelog-date">${formatDate(e.date, lang)}</span>
                <span class="changelog-category ${e.category}">${CATEGORY_LABELS[lang][e.category] || e.category}</span>
              </div>
              <h3 class="changelog-title">${title}</h3>
              ${desc ? `<span class="changelog-card-more">${CL_MORE[lang]}<span class="changelog-card-arrow" aria-hidden="true"> ${arrow}</span></span><div class="changelog-full-desc" hidden>${desc}</div>` : ''}
            </div>
          </div>`
    }).join('')

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
      </div>`
  }).join('')

  return groups
}

// ─── Changelog-Detail-Modal (High-End) ───────────────────────────────────────

const CL_MORE:  Record<'de' | 'en' | 'ar', string> = { de: 'Details ansehen', en: 'View details', ar: 'عرض التفاصيل' }
const CL_CLOSE: Record<'de' | 'en' | 'ar', string> = { de: 'Schließen', en: 'Close', ar: 'إغلاق' }

let clDelegationReady = false
let clLastTrigger: HTMLElement | null = null

function ensureChangelogModal(lang: 'de' | 'en' | 'ar'): HTMLElement {
  const existing = document.getElementById('cl-modal-backdrop')
  if (existing) return existing

  const backdrop = document.createElement('div')
  backdrop.className = 'cl-modal-backdrop'
  backdrop.id = 'cl-modal-backdrop'
  backdrop.hidden = true
  backdrop.innerHTML = `
    <div class="cl-modal" role="dialog" aria-modal="true" aria-labelledby="cl-modal-title">
      <button class="cl-modal-close" id="cl-modal-close" type="button" aria-label="${CL_CLOSE[lang]}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="cl-modal-meta">
        <span class="cl-modal-version"></span>
        <span class="cl-modal-cat changelog-category"></span>
        <span class="cl-modal-date"></span>
      </div>
      <h2 class="cl-modal-title" id="cl-modal-title"></h2>
      <div class="cl-modal-body"></div>
    </div>`
  document.body.appendChild(backdrop)

  backdrop.querySelector<HTMLElement>('#cl-modal-close')!.addEventListener('click', closeChangelogModal)
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeChangelogModal() })
  document.addEventListener('keydown', (e) => {
    if (backdrop.hidden) return
    if (e.key === 'Escape') { closeChangelogModal(); return }
    if (e.key === 'Tab') {
      const f = backdrop.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])')
      if (!f.length) return
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
  })
  return backdrop
}

function openChangelogModal(card: HTMLElement): void {
  const lang = getRoadmapLang()
  const backdrop = ensureChangelogModal(lang)
  clLastTrigger = card

  const q = (sel: string): string => card.querySelector(sel)?.textContent || ''
  const catClass = (card.className.match(/\b(feature|fix|refactor|security)\b/) || [''])[0]

  backdrop.querySelector('.cl-modal-version')!.textContent = q('.changelog-version')
  backdrop.querySelector('.cl-modal-date')!.textContent = q('.changelog-date')
  const catEl = backdrop.querySelector('.cl-modal-cat')!
  catEl.textContent = q('.changelog-category')
  catEl.className = 'cl-modal-cat changelog-category ' + catClass
  backdrop.querySelector('.cl-modal-title')!.textContent = q('.changelog-title')
  backdrop.querySelector('.cl-modal-body')!.innerHTML = card.querySelector('.changelog-full-desc')?.innerHTML || ''

  backdrop.hidden = false
  document.body.classList.add('cl-modal-open')
  requestAnimationFrame(() => backdrop.classList.add('is-open'))
  backdrop.querySelector<HTMLElement>('#cl-modal-close')?.focus()
}

function closeChangelogModal(): void {
  const backdrop = document.getElementById('cl-modal-backdrop')
  if (!backdrop || backdrop.hidden) return
  backdrop.classList.remove('is-open')
  document.body.classList.remove('cl-modal-open')
  window.setTimeout(() => { backdrop.hidden = true }, 240)
  clLastTrigger?.focus()
}

function setupChangelogDelegation(zone: HTMLElement): void {
  if (clDelegationReady) return
  clDelegationReady = true
  zone.addEventListener('click', (e) => {
    const card = (e.target as HTMLElement).closest('.changelog-card--clickable') as HTMLElement | null
    if (card) openChangelogModal(card)
  })
  zone.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    const card = (e.target as HTMLElement).closest('.changelog-card--clickable') as HTMLElement | null
    if (card) { e.preventDefault(); openChangelogModal(card) }
  })
}

// ─── Filter-Chips (client-seitig) ─────────────────────────────────────────────

type FilterCategory = 'all' | 'feature' | 'fix' | 'refactor' | 'security'
let activeFilter: FilterCategory = 'all'

function applyFilter(category: FilterCategory): void {
  activeFilter = category

  // Chips aktualisieren
  document.querySelectorAll<HTMLElement>('.changelog-chip').forEach(chip => {
    chip.classList.toggle('is-active', chip.dataset.filter === category)
  })

  // Einträge ein-/ausblenden
  document.querySelectorAll<HTMLElement>('.changelog-timeline-entry').forEach(entry => {
    const match = category === 'all' || entry.dataset.category === category
    entry.classList.toggle('is-hidden', !match)
  })

  // Leerem-Zustand pro Jahres-Gruppe zeigen
  document.querySelectorAll<HTMLElement>('.changelog-year-group').forEach(group => {
    const visible = group.querySelectorAll('.changelog-timeline-entry:not(.is-hidden)').length
    let empty = group.querySelector<HTMLElement>('.changelog-no-match')
    if (visible === 0) {
      if (!empty) {
        empty = document.createElement('p')
        empty.className = 'changelog-no-match'
        empty.style.cssText = 'font-size:.85rem;color:rgba(255,255,255,.25);padding:20px 0;'
        group.querySelector('.changelog-timeline')?.appendChild(empty)
      }
      empty.textContent = activeFilter === 'all' ? '' : 'Keine Einträge.'
    } else if (empty) {
      empty.remove()
    }
  })
}

// ─── Render: /roadmap.html ───────────────────────────────────────────────────

function renderGlobalRoadmapPage(isLangSwitch: boolean): void {
  const lang = getRoadmapLang()

  // Portfolio-Einträge: alle (in-progress + planned + completed) in sort_order-Reihenfolge
  const portfolioEntries = (typeof roadmapData !== 'undefined' ? roadmapData : [])
    .filter((e: RoadmapEntry) => e.scope === 'portfolio')

  const inProgress = portfolioEntries.filter((e: RoadmapEntry) => e.status === 'in-progress')
  const planned    = portfolioEntries.filter((e: RoadmapEntry) => e.status === 'planned')
  const completed  = portfolioEntries.filter((e: RoadmapEntry) => e.status === 'completed')

  // Reihenfolge: abgeschlossen (Errungenschaften) → aktiv → geplant
  const roadmapEntries = [...completed, ...inProgress, ...planned]

  const roadmapZone = document.getElementById('roadmap-global-zone')
  if (roadmapZone) {
    roadmapZone.innerHTML = renderRoadmapTimeline(roadmapEntries, lang)
    if (isLangSwitch) activateReveal(roadmapZone)
  }

  // Changelog-Teaser: nur die 3 neuesten Releases
  const changelogZone = document.getElementById('changelog-global-zone')
  if (changelogZone) {
    const entries: ChangelogEntry[] = typeof changelogData !== 'undefined' ? changelogData : []
    changelogZone.innerHTML = renderChangelogList(entries, lang, 3)
    if (isLangSwitch) activateReveal(changelogZone)
  }
}

// ─── Render: /changelog.html ─────────────────────────────────────────────────

function renderChangelogFullPage(isLangSwitch: boolean): void {
  const lang    = getRoadmapLang()
  const entries: ChangelogEntry[] = typeof changelogData !== 'undefined' ? changelogData : []

  const zone = document.getElementById('changelog-page-zone')
  if (!zone) return

  zone.innerHTML = renderChangelogPage(entries, lang)
  setupChangelogDelegation(zone)
  if (isLangSwitch) activateReveal(zone)

  // Filter nach Sprachwechsel erneut anwenden
  if (activeFilter !== 'all') applyFilter(activeFilter)

  // Reveal aktivieren
  requestAnimationFrame(() => {
    zone.querySelectorAll('.reveal').forEach(el => el.classList.add('active'))
  })

  // Chip-Zählungen aktualisieren (zählt alle Einträge, nicht gefilterte)
  const counts: Record<string, number> = { all: entries.length, feature: 0, fix: 0, refactor: 0, security: 0 }
  entries.forEach(e => { if (counts[e.category] !== undefined) counts[e.category]++ })
  document.querySelectorAll<HTMLElement>('.changelog-chip').forEach(chip => {
    const cat = chip.dataset.filter || 'all'
    const countEl = chip.querySelector('.changelog-chip-count')
    if (countEl && counts[cat] !== undefined) countEl.textContent = `(${counts[cat]})`
  })

  // Meta: „N Releases seit v1.0.0"
  const metaEl = document.getElementById('changelog-release-count')
  if (metaEl) metaEl.textContent = String(entries.length)
}

// ─── Render: Projekt-Subseiten ───────────────────────────────────────────────

function renderProjectRoadmap(slug: string, isLangSwitch: boolean): void {
  const lang = getRoadmapLang()
  const container = document.getElementById(`roadmap-project-${slug}`)
  if (!container) return

  const projectEntries = (typeof roadmapData !== 'undefined' ? roadmapData : [])
    .filter((e: RoadmapEntry) => e.scope === 'project' && e.project_slug === slug)

  container.innerHTML = renderRoadmapTimeline(projectEntries, lang)
  if (isLangSwitch) activateReveal(container)
}

// ─── Initialisierung ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  if (typeof roadmapData === 'undefined') return

  // /changelog.html — eigene Seite
  const changelogPage = document.getElementById('changelog-page-zone')
  if (changelogPage) {
    renderChangelogFullPage(false)

    // Filter-Chips verdrahten
    document.querySelectorAll<HTMLElement>('.changelog-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        applyFilter((chip.dataset.filter || 'all') as FilterCategory)
      })
    })
    return
  }

  // /roadmap.html — Roadmap + Teaser
  const globalPage = document.getElementById('roadmap-global-zone')
  if (globalPage) {
    renderGlobalRoadmapPage(false)
    return
  }

  // Projekt-Subseiten: Suche nach roadmap-project-<slug> Containern
  const projectContainers = document.querySelectorAll('[id^="roadmap-project-"]')
  projectContainers.forEach((el) => {
    const slug = el.id.replace('roadmap-project-', '')
    if (slug) renderProjectRoadmap(slug, false)
  })
})

// Sprachwechsel
window.addEventListener('languagechange', () => {
  if (typeof roadmapData === 'undefined') return

  const changelogPage = document.getElementById('changelog-page-zone')
  if (changelogPage) {
    renderChangelogFullPage(true)
    return
  }

  const globalPage = document.getElementById('roadmap-global-zone')
  if (globalPage) {
    renderGlobalRoadmapPage(true)
    return
  }

  const projectContainers = document.querySelectorAll('[id^="roadmap-project-"]')
  projectContainers.forEach((el) => {
    const slug = el.id.replace('roadmap-project-', '')
    if (slug) renderProjectRoadmap(slug, true)
  })
})
