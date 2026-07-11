/**
 * seed-changelog-v3.mjs
 *
 * Legt den öffentlichen Changelog-Eintrag für das v3.0.0-Relaunch-Release an
 * (Tabelle "changelog" in Supabase) — dreisprachig DE/EN/AR.
 *
 * IDEMPOTENT: existiert v3.0.0 bereits, wird der Eintrag aktualisiert (PATCH),
 * sonst neu angelegt (POST). Mehrfaches Ausführen erzeugt KEINE Duplikate.
 *
 * Datum + published-Flag sind als Platzhalter gesetzt und können jederzeit
 * im Admin Panel (/dashboard/changelog) angepasst werden.
 *
 * Lokal ausführen:
 *   node scripts/seed-changelog-v3.mjs
 *
 * Danach (damit der Eintrag auf /changelog erscheint):
 *   node scripts/build-roadmap.mjs
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))

function loadEnvLocal() {
  const envPaths = [
    resolve(__dir, '../.env.local'),
    resolve(__dir, '../../portfolio-admin/.env.local'),
  ]
  for (const envPath of envPaths) {
    try {
      const content = readFileSync(envPath, 'utf-8')
      for (const line of content.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const eqIndex = trimmed.indexOf('=')
        if (eqIndex === -1) continue
        const key = trimmed.slice(0, eqIndex).trim()
        const val = trimmed.slice(eqIndex + 1).trim()
        if (key && !process.env[key]) process.env[key] = val
      }
      console.log(`   .env geladen: ${envPath}`)
      return
    } catch { }
  }
}

if (!process.env.SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  loadEnvLocal()
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌  SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY fehlen.')
  process.exit(1)
}

const BASE_HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
}

async function sbGet(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: BASE_HEADERS })
  if (!res.ok) throw new Error(`GET ${path}: ${res.status} ${await res.text()}`)
  return res.json()
}

async function sbPost(path, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'POST',
    headers: { ...BASE_HEADERS, Prefer: 'return=minimal' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`POST ${path}: ${res.status} ${await res.text()}`)
}

async function sbPatch(path, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'PATCH',
    headers: { ...BASE_HEADERS, Prefer: 'return=minimal' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`PATCH ${path}: ${res.status} ${await res.text()}`)
}

// ─── v3.0.0 Eintrag ───────────────────────────────────────────────────────────

const DESC_DE = 'Der größte Sprung seit dem Start: Aus einer statischen Seite wird ein vollständig selbst verwaltetes System — dreisprachig, KI-gestützt, in jeder Ebene abgesichert, und weiterhin ohne ein einziges Frontend-Framework.<br><br>• <strong>Dreisprachigkeit mit echtem SEO</strong> — DE · EN · AR mit vollständigem Rechts-nach-links-Layout für Arabisch. Jede Sprache wird jetzt zusätzlich statisch vorgerendert (eigene URLs, hreflang) — Google indexiert jede Sprache separat, nicht nur Deutsch.<br><br>• <strong>KI-Twin „Ask Yusef · Neural Console"</strong> — mein Chat-Widget wurde komplett neu gestaltet: ein atmender AI-Ring-Button, Auto-Hide beim Scrollen, ein Vollbild-Sheet mit Wisch-Geste auf Mobile, Cmd/Ctrl+K zum Öffnen und kontextbewusste Frage-Vorschläge je nach Seite.<br><br>• <strong>Admin Panel „SPACE"</strong> — ein Apple-artiges Verwaltungswerkzeug mit ⌘K-Command-Palette, acht Bereichen (Projekte, Roadmap, Changelog, Blog, Übersetzungen, Medien, KI-Wissen, Wartungsmodus), einem Live-System-Health-Dashboard und vollständigem Aktivitätsprotokoll.<br><br>• <strong>Security-Fortress</strong> — vier unabhängige Sicherheitsebenen im Admin Panel: Zugangs-Whitelist, ein PIN als zweiter Faktor, Rate-Limiting gegen Missbrauch und Security-Header — bevor das Panel die echte Live-Seite verwaltet.<br><br>• <strong>Neue öffentliche Bereiche</strong> — ein mehrsprachiger Blog (Thoughts), dieser öffentliche Changelog (jetzt mit klickbaren Detail-Karten), eine dynamische Roadmap und ein Live-GitHub-Aktivitäts-Widget.<br><br>• <strong>Design-Neustart „Calm Cinema"</strong> — die Startseite als durchgehende Leinwand statt einzelner Blöcke, eine maus-folgende Aurora im Hero, cinematische Scroll-Übergänge, self-hosted Schriften und fluide Typografie.<br><br>• <strong>Barrierefreiheit & PWA</strong> — Skip-Links, vollständige Tastaturbedienbarkeit, kein Layout-Sprung beim Laden, installierbar und offline-fähig.<br><br>• <strong>Und jede Menge Feinschliff</strong> — von Grund auf auf Mobile getestet, Dutzende kleine Fehler behoben, jede Sprache und jeder Modus (Hell/Dunkel) doppelt geprüft.'

const DESC_EN = 'The biggest leap since launch: a static page grows into a fully self-managed system — trilingual, AI-powered, hardened at every layer, and still without a single frontend framework.<br><br>• <strong>Trilingual with real SEO</strong> — DE · EN · AR with full right-to-left layout for Arabic. Every language is now statically pre-rendered (its own URLs, hreflang) — Google indexes each language separately, not just German.<br><br>• <strong>AI twin “Ask Yusef · Neural Console”</strong> — my chat widget got a full redesign: a breathing AI-ring button, auto-hide on scroll, a full-screen swipeable sheet on mobile, Cmd/Ctrl+K to open, and context-aware question suggestions per page.<br><br>• <strong>Admin panel “SPACE”</strong> — an Apple-inspired management tool with a ⌘K command palette, eight content areas (projects, roadmap, changelog, blog, translations, media, AI knowledge, maintenance mode), a live system-health dashboard, and a full activity log.<br><br>• <strong>Security fortress</strong> — four independent security layers protect the admin panel: access whitelist, a PIN as second factor, rate-limiting, and security headers — before it manages the real live site.<br><br>• <strong>New public sections</strong> — a multilingual blog (Thoughts), this public changelog (now with clickable detail cards), a dynamic roadmap, and a live GitHub activity widget.<br><br>• <strong>Design reset “Calm Cinema”</strong> — the homepage as one continuous canvas instead of separate blocks, a mouse-following aurora in the hero, cinematic scroll transitions, self-hosted fonts, and fluid typography.<br><br>• <strong>Accessibility & PWA</strong> — skip links, full keyboard operability, zero layout shift on load, installable and offline-capable.<br><br>• <strong>And a ton of polish</strong> — tested from the ground up on mobile, dozens of small bugs fixed, every language and theme (light/dark) checked twice.'

const DESC_AR = 'أكبر قفزة منذ الإطلاق: تتحوّل صفحة ثابتة إلى نظام قابل للإدارة بالكامل — ثلاثي اللغات، مدعوم بالذكاء الاصطناعي، محصَّن على كل مستوى، وما يزال دون أي إطار عمل أمامي.<br><br>• <strong>ثلاث لغات مع تحسين حقيقي لمحركات البحث</strong> — DE · EN · AR مع تخطيط كامل من اليمين إلى اليسار للعربية. أصبحت كل لغة الآن مُصيَّرة مسبقًا بشكل ثابت (روابط خاصة بها، وhreflang) — تفهرس Google كل لغة على حدة، لا الألمانية فقط.<br><br>• <strong>التوأم الذكي «اسأل يوسف · Neural Console»</strong> — أُعيد تصميم أداة الدردشة بالكامل: زر بحلقة ذكاء اصطناعي «تتنفّس»، إخفاء تلقائي عند التمرير، لوحة ملء الشاشة قابلة للسحب على الجوال، فتحها عبر Cmd/Ctrl+K، واقتراحات أسئلة واعية بسياق الصفحة.<br><br>• <strong>لوحة التحكّم «SPACE»</strong> — أداة إدارة بأسلوب Apple مع لوحة أوامر ⌘K، وثمانية أقسام (المشاريع، خارطة الطريق، سجلّ التغييرات، المدوّنة، الترجمات، الوسائط، معرفة الذكاء الاصطناعي، وضع الصيانة)، ولوحة صحة نظام حيّة، وسجلّ نشاط كامل.<br><br>• <strong>حصن الأمان</strong> — أربع طبقات أمان مستقلة تحمي لوحة التحكّم: قائمة وصول بيضاء، رمز PIN كعامل تحقّق ثانٍ، تقييد معدّل الطلبات، ورؤوس أمان — قبل أن تدير اللوحة الموقع الحقيقي.<br><br>• <strong>أقسام عامة جديدة</strong> — مدوّنة متعددة اللغات (Thoughts)، وسجلّ التغييرات العام هذا (أصبح الآن قابلًا للنقر مع بطاقات تفاصيل)، وخارطة طريق ديناميكية، وأداة حيّة لنشاط GitHub.<br><br>• <strong>إعادة تصميم «Calm Cinema»</strong> — الصفحة الرئيسية كلوحة واحدة متصلة بدلًا من كتل منفصلة، وهالة ضوئية تتبع مؤشر الفأرة في القسم الرئيسي، وانتقالات تمرير سينمائية، وخطوط مستضافة ذاتيًا، وطباعة مرنة.<br><br>• <strong>إمكانية الوصول وتطبيق ويب تقدّمي</strong> — روابط تخطٍّ، تحكّم كامل بلوحة المفاتيح، صفر انزياح في التخطيط عند التحميل، قابل للتثبيت ويعمل دون اتصال.<br><br>• <strong>وقدر كبير من الصقل</strong> — تم اختباره من الصفر على الجوال، وإصلاح عشرات الأخطاء الصغيرة، وفحص كل لغة وكل نمط (فاتح/داكن) مرّتين.'

const ENTRY = {
  version: 'v3.0.0',
  date: '2026-06-07', // Platzhalter — im Admin Panel auf das echte Go-Live-Datum setzen
  category: 'feature',
  title_de: 'Der große Relaunch — ein vollständig verwaltbares Portfolio-System',
  title_en: 'The Big Relaunch — A Fully Self-Managed Portfolio System',
  title_ar: 'إعادة الإطلاق الكبرى — نظام محفظة قابل للإدارة بالكامل',
  description_de: DESC_DE,
  description_en: DESC_EN,
  description_ar: DESC_AR,
  published: true,
}

async function main() {
  console.log('→ Seed Changelog v3.0.0\n')

  const existing = await sbGet(`changelog?version=eq.${encodeURIComponent(ENTRY.version)}&select=id,version`)

  if (existing.length) {
    await sbPatch(`changelog?version=eq.${encodeURIComponent(ENTRY.version)}`, ENTRY)
    console.log(`   ✓ Aktualisiert: ${ENTRY.version} (id=${existing[0].id})`)
  } else {
    await sbPost('changelog', ENTRY)
    console.log(`   ✓ Angelegt: ${ENTRY.version}`)
  }

  console.log('\n✅  Fertig. Jetzt bauen:  node scripts/build-roadmap.mjs')
}

main().catch((err) => {
  console.error('❌  Fehler:', err.message)
  process.exit(1)
})
