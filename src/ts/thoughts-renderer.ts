/**
 * ============================================================================
 * DATEI: src/ts/thoughts-renderer.ts
 *
 * Rendert Thoughts-Posts dynamisch auf:
 *   - index.html          (#thoughts-teaser-grid  → 3 neueste Posts)
 *   - thoughts/index.html (#thoughts-grid         → alle Posts + Tag-Filter)
 *
 * Sprach-Logik:
 *   - Ein Post = ein Thema in EN/DE/AR (ein Row in DB)
 *   - EN ist Pflicht, DE+AR optional
 *   - Fehlende Übersetzung → EN anzeigen + Fallback-Badge
 *   - KEIN Sprach-Filter mehr
 *
 * ACHTUNG: Jede Änderung der renderCard-Funktion MUSS auch in
 *          prerender-thoughts.js gespiegelt werden.
 *
 * Datenquelle: js/thoughts-data.js (auto-generiert via build-thoughts.mjs)
 * ============================================================================
 */

// ─── Sprach-Hilfsfunktionen ───────────────────────────────────────────────────

function getThoughtsLang(): 'de' | 'en' | 'ar' {
  try {
    const l = window.__PAGE_LANG__
    return l === 'en' || l === 'ar' ? l : 'de'
  } catch {
    return 'de'
  }
}

// i18n-Labels für Client-seitige Strings
const UI_LABELS = {
  de: {
    readMore:     'Weiterlesen →',
    minRead:      'Min. Lesezeit',
    filterAll:    'Alle',
    empty:        'Noch keine Gedanken.',
    emptyFilter:  'Keine Beiträge für diesen Filter.',
    allBtn:       'Alle Gedanken ansehen →',
    fallbackNote: 'Nur auf EN verfügbar',
  },
  en: {
    readMore:     'Read more →',
    minRead:      'min read',
    filterAll:    'All',
    empty:        'No thoughts yet.',
    emptyFilter:  'No posts for this filter.',
    allBtn:       'See all thoughts →',
    fallbackNote: 'Only in EN',
  },
  ar: {
    readMore:     'اقرأ المزيد →',
    minRead:      'د. قراءة',
    filterAll:    'الكل',
    empty:        'لا توجد أفكار بعد.',
    emptyFilter:  'لا توجد مقالات لهذا الفلتر.',
    allBtn:       'عرض جميع الأفكار →',
    fallbackNote: 'متاح فقط بالإنجليزية',
  },
} as const

// ─── Hilfsfunktionen ─────────────────────────────────────────────────────────

function thoughtsFmtDate(iso: string, lang: 'de' | 'en' | 'ar'): string {
  try {
    const d      = new Date(iso)
    const locale = lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-GB' : 'de-DE'
    return d.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ─── Lokalisierung auflösen ───────────────────────────────────────────────────

function getLocalizedTitle(post: ThoughtMeta, lang: 'de' | 'en' | 'ar'): string | null {
  if (lang === 'de') return post.title_de
  if (lang === 'ar') return post.title_ar
  return post.title_en
}

function getLocalizedExcerpt(post: ThoughtMeta, lang: 'de' | 'en' | 'ar'): string | null {
  if (lang === 'de') return post.excerpt_de
  if (lang === 'ar') return post.excerpt_ar
  return post.excerpt_en
}

interface ResolvedPost {
  title: string
  excerpt: string
  usedLang: 'de' | 'en' | 'ar'
}

function resolvePost(post: ThoughtMeta, lang: 'de' | 'en' | 'ar'): ResolvedPost {
  const localTitle   = getLocalizedTitle(post, lang)
  const localExcerpt = getLocalizedExcerpt(post, lang)

  const title    = localTitle   ?? post.title_en
  const excerpt  = localExcerpt ?? post.excerpt_en ?? ''
  const usedLang = localTitle   ? lang : 'en'

  return { title, excerpt, usedLang }
}

// ─── Karten-HTML ──────────────────────────────────────────────────────────────

function renderCard(post: ThoughtMeta, lang: 'de' | 'en' | 'ar', basePath: string): string {
  const labels   = UI_LABELS[lang]
  const resolved = resolvePost(post, lang)
  const date     = post.published_at ? thoughtsFmtDate(post.published_at, resolved.usedLang) : ''
  const postUrl  = `${basePath}${post.slug}.html`

  const coverHtml = post.cover_image_url
    ? `<div class="thought-card-cover"><img src="${post.cover_image_url}" alt="${escapeHtml(resolved.title)}" loading="lazy" /></div>`
    : `<div class="thought-card-cover thought-card-cover--gradient"></div>`

  const firstTag = post.tags?.[0] ?? ''
  const tagHtml  = firstTag
    ? `<span class="thought-card-tag">${escapeHtml(firstTag)}</span>`
    : ''

  // Fallback-Badge: wird angezeigt wenn Post in gewünschter Sprache nicht vorhanden
  const fallbackBadge = resolved.usedLang !== lang
    ? `<span class="thought-card-lang-badge" title="${escapeHtml(labels.fallbackNote)}">${resolved.usedLang.toUpperCase()}</span>`
    : ''

  const readingHtml = post.reading_minutes
    ? `<span class="thought-card-sep">·</span><span class="thought-card-reading">${post.reading_minutes} ${labels.minRead}</span>`
    : ''

  return `
    <a href="${postUrl}" class="thought-card reveal">
      ${coverHtml}
      <div class="thought-card-body">
        <div class="thought-card-meta">
          ${tagHtml}
          ${fallbackBadge}
          <span class="thought-card-date">${date}</span>
          ${readingHtml}
        </div>
        <h3 class="thought-card-title">${escapeHtml(resolved.title)}</h3>
        <p class="thought-card-excerpt">${escapeHtml(resolved.excerpt)}</p>
        <span class="thought-card-read">${labels.readMore}</span>
      </div>
    </a>`
}

function thoughtsReveal(container: Element): void {
  requestAnimationFrame(() => {
    container.querySelectorAll('.reveal').forEach(el => el.classList.add('active'))
  })
}

// ─── Teaser (index.html) ─────────────────────────────────────────────────────
// Teaser: 3 neueste Posts (kein Sprach-Filter, Titel in Site-Sprache)

function renderTeaser(isLangSwitch: boolean): void {
  const container = document.getElementById('thoughts-teaser-grid')
  if (!container) return

  const data: ThoughtMeta[] = typeof thoughtsData !== 'undefined' ? thoughtsData : []
  const lang    = getThoughtsLang()
  const labels  = UI_LABELS[lang]
  const basePath = 'thoughts/'

  const visible = data.slice(0, 3)

  if (visible.length === 0) {
    container.innerHTML = `<div class="thoughts-empty-teaser reveal"><p>${labels.empty}</p></div>`
  } else {
    container.innerHTML = visible.map(p => renderCard(p, lang, basePath)).join('')
  }

  // Immer aktivieren: neu eingefügte .reveal-Karten werden vom globalen
  // IntersectionObserver (script.js) NICHT erfasst → sonst bleiben sie opacity:0.
  // (isLangSwitch wird nicht mehr gebraucht, bewusst beibehalten für API-Kompat.)
  void isLangSwitch
  thoughtsReveal(container)
}

// ─── Liste + Tag-Filter (thoughts/index.html) ─────────────────────────────────

let activeTag = 'ALL'

function filterPosts(posts: ThoughtMeta[]): ThoughtMeta[] {
  if (activeTag === 'ALL') return posts
  return posts.filter(p => (p.tags ?? []).includes(activeTag))
}

function renderList(isLangSwitch: boolean): void {
  const grid      = document.getElementById('thoughts-grid')
  const filterBar = document.getElementById('thoughts-tag-filter')
  if (!grid) return

  const data: ThoughtMeta[] = typeof thoughtsData !== 'undefined' ? thoughtsData : []
  const lang    = getThoughtsLang()
  const labels  = UI_LABELS[lang]
  const basePath = ''

  if (isLangSwitch) {
    activeTag = 'ALL'
  }

  // Alle Tags aus allen Posts
  const allTags = [...new Set(data.flatMap(p => p.tags ?? []))].sort()

  // ── Filter-Chips (nur Tags, kein Sprach-Filter) ──────────────────────────
  if (filterBar) {
    let html = `<button class="thoughts-filter-chip${activeTag === 'ALL' ? ' active' : ''}" data-tag="ALL">${labels.filterAll}</button>`
    html += allTags.map(t =>
      `<button class="thoughts-filter-chip${activeTag === t ? ' active' : ''}" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</button>`
    ).join('')

    filterBar.innerHTML = html

    filterBar.querySelectorAll<HTMLButtonElement>('[data-tag]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTag = btn.dataset.tag ?? 'ALL'
        renderList(false)
      })
    })
  }

  // ── Posts rendern ────────────────────────────────────────────────────────
  const filtered = filterPosts(data)

  if (filtered.length === 0) {
    const msg = activeTag === 'ALL' ? labels.empty : labels.emptyFilter
    grid.innerHTML = `<div class="thoughts-empty-state reveal"><p>${msg}</p></div>`
  } else {
    grid.innerHTML = filtered.map(p => renderCard(p, lang, basePath)).join('')
  }

  // Immer aktivieren (auch beim Tag-Filter-Klick) — sonst bleiben die neu
  // eingefügten .reveal-Karten unsichtbar (opacity:0), weil der globale
  // IntersectionObserver nur beim ersten Laden vorhandene Elemente beobachtet.
  void isLangSwitch
  thoughtsReveal(grid)
}

// ─── Initialisierung ──────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  if (typeof thoughtsData === 'undefined') return

  const isTeaser = !!document.getElementById('thoughts-teaser-grid')
  const isList   = !!document.getElementById('thoughts-grid')

  if (isTeaser) renderTeaser(false)
  if (isList)   renderList(false)
})

window.addEventListener('languagechange', () => {
  if (typeof thoughtsData === 'undefined') return

  const isTeaser = !!document.getElementById('thoughts-teaser-grid')
  const isList   = !!document.getElementById('thoughts-grid')

  if (isTeaser) renderTeaser(true)
  if (isList)   renderList(true)
})
