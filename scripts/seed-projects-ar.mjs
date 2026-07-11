/**
 * seed-projects-ar.mjs
 *
 * Füllt die fehlenden arabischen Projekt-Texte (description_ar + features[].ar)
 * in der Supabase-Tabelle "projects". Idempotent: PATCH pro slug.
 *
 * Danach:  node scripts/build-projects.mjs   (schreibt website/js/projects-data.js)
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))

function loadEnvLocal() {
  for (const p of [resolve(__dir, '../.env.local'), resolve(__dir, '../../portfolio-admin/.env.local')]) {
    try {
      for (const line of readFileSync(p, 'utf-8').split('\n')) {
        const t = line.trim(); if (!t || t.startsWith('#')) continue
        const i = t.indexOf('='); if (i === -1) continue
        const k = t.slice(0, i).trim(), v = t.slice(i + 1).trim()
        if (k && !process.env[k]) process.env[k] = v
      }
      return
    } catch { }
  }
}
if (!process.env.SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL) loadEnvLocal()

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('❌  SUPABASE env fehlt.'); process.exit(1) }

const HEADERS = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' }

async function sbPatch(path, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'PATCH', headers: { ...HEADERS, Prefer: 'return=minimal' }, body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`PATCH ${path}: ${res.status} ${await res.text()}`)
}

const PROJECTS = [
  {
    slug: 'studynexus',
    description_ar: "منصة SaaS مُحفَّزة بعناصر اللعب حصريًا لطلاب جامعة هانوفر للعلوم التطبيقية. مستودع Full-Stack متكامل: Next.js 14 App Router و FastAPI و PostgreSQL و Redis و Docker — مع لوحة Kanban، وشبكة جدولة بدقّة 15 دقيقة، وخطة دراسية مرئية، وتتبُّع فعلي للمعدّل التراكمي (GPA).",
    features: [
      { de: "Full-Stack Monorepo: Next.js 14 + FastAPI + PostgreSQL", en: "Full-Stack Monorepo: Next.js 14 + FastAPI + PostgreSQL", ar: "مستودع Full-Stack موحّد: Next.js 14 + FastAPI + PostgreSQL" },
      { de: "Kanban, Schedule Board & visueller Studienplan", en: "Kanban, Schedule Board & Visual Study Plan", ar: "لوحة Kanban وجدول المواعيد وخطة دراسية مرئية" },
      { de: "JWT Auth, CSRF-Schutz, Docker Compose, DE/EN i18n", en: "JWT Auth, CSRF Protection, Docker Compose, DE/EN i18n", ar: "مصادقة JWT وحماية CSRF و Docker Compose ودعم لغتين (ألماني/إنجليزي)" },
    ],
  },
  {
    slug: 'phishing-defender',
    description_ar: "لعبة تعليمية تفاعلية ('Serious Game') في مجال الأمن السيبراني. الهدف تعليم الأطفال والمراهقين كيفية التعرّف على رسائل التصيّد الاحتيالي (Phishing).",
    features: [
      { de: "<strong>Pure Java:</strong> Keine Game-Engine. UI, Animationen (30 FPS Buffer) und Logik sind komplett selbst in Swing implementiert.", en: "<strong>Pure Java:</strong> No game engine. UI, animations (30 FPS buffer), and logic are fully implemented in Swing.", ar: "<strong>جافا خالصة:</strong> بدون محرّك ألعاب. الواجهة والرسوم المتحركة (مخزّن مؤقت 30 إطارًا/ثانية) والمنطق مُنفَّذة بالكامل يدويًا في Swing." },
      { de: "<strong>Architektur:</strong> Saubere Trennung durch Manager-Klassen (Sound, Settings, Achievements).", en: "<strong>Architecture:</strong> Clean separation via Manager classes (Sound, Settings, Achievements).", ar: "<strong>المعمارية:</strong> فصل نظيف عبر فئات إدارة (الصوت، الإعدادات، الإنجازات)." },
      { de: "<strong>Features:</strong> Highscore-System, Speichern (JSON), Admin-Modus und interaktives 'Cyber-HQ'.", en: "<strong>Features:</strong> Highscore system, Save (JSON), Admin Mode, and interactive 'Cyber-HQ'.", ar: "<strong>الميزات:</strong> نظام أعلى النقاط، حفظ (JSON)، وضع المدير، ومقرّ سيبراني تفاعلي ('Cyber-HQ')." },
    ],
  },
  {
    slug: 'html-cv',
    description_ar: "تطوير محرّك عرض (Rendering Engine) مُحسَّن للطباعة لمستندات التقديم. تصميم A4 بدقّة البكسل مباشرة داخل المتصفّح.",
    features: [
      { de: "<strong>Print CSS:</strong> Pixelgenaue A4-Skalierung via @page Rules.", en: "<strong>Print CSS:</strong> Pixel-perfect A4 scaling via @page rules.", ar: "<strong>Print CSS:</strong> قياس A4 بدقّة البكسل عبر قواعد @page." },
      { de: "<strong>Privacy-First:</strong> Datentrennung via .gitignore Strategie.", en: "<strong>Privacy-First:</strong> Data separation via .gitignore strategy.", ar: "<strong>الخصوصية أولًا:</strong> فصل البيانات عبر استراتيجية .gitignore." },
      { de: "<strong>No-Framework:</strong> 100% Vanilla HTML5 & CSS3 Architecture.", en: "<strong>No-Framework:</strong> 100% Vanilla HTML5 & CSS3 Architecture.", ar: "<strong>بدون إطار عمل:</strong> معمارية 100% Vanilla HTML5 و CSS3." },
    ],
  },
  {
    slug: 'community-software',
    description_ar: "التركيز على تطوير ميزات اللعب وواجهات المستخدم باستخدام Lua و JavaScript، إلى جانب إدارة وتحسين قواعد بيانات SQL لحركة مرور مرتفعة من المستخدمين.",
    features: [
      { de: "<strong>Gameplay & UI:</strong> Entwicklung von Gameplay-Systemen & UI-Komponenten mit (Lua/JS).", en: "<strong>Gameplay & UI:</strong> Development of gameplay systems & UI components (Lua/JS).", ar: "<strong>اللعب والواجهات:</strong> تطوير أنظمة اللعب ومكوّنات الواجهة (Lua/JS)." },
      { de: "<strong>SQL-Architektur:</strong> Architektur & Optimierung relationaler SQL-Datenbanken für Live-Betrieb.", en: "<strong>SQL Architecture:</strong> Architecture & optimization of relational SQL databases for live operation.", ar: "<strong>معمارية SQL:</strong> تصميم وتحسين قواعد بيانات SQL العلائقية للتشغيل الحيّ." },
      { de: "<strong>DevOps & Support:</strong> Striktes Release-Management über Git und Troubleshooting (2nd-Level).", en: "<strong>DevOps & Support:</strong> Strict release management via Git and technical troubleshooting (2nd-Level).", ar: "<strong>DevOps والدعم:</strong> إدارة إصدارات صارمة عبر Git واستكشاف الأعطال (الدعم من المستوى الثاني)." },
    ],
  },
  {
    slug: 'portfolio-meta',
    description_ar: "توثيق المحفظة ذاتها. من HTML ثابت إلى محرّك عرض ديناميكي. تحليل معمّق في معمارية البرمجيات وتوجيه DNS والأداء.",
    features: [],
  },
]

async function main() {
  console.log('→ Seed arabische Projekt-Texte\n')
  for (const p of PROJECTS) {
    const body = { description_ar: p.description_ar }
    if (p.features.length) body.features = p.features
    await sbPatch(`projects?slug=eq.${encodeURIComponent(p.slug)}`, body)
    console.log(`   ✓ ${p.slug}`)
  }
  console.log('\n✅  Fertig. Jetzt:  node scripts/build-projects.mjs')
}
main().catch(e => { console.error('❌ ', e.message); process.exit(1) })
