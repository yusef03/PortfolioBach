/**
 * seed-thoughts-relaunch.mjs
 *
 * Legt den v3.0.0-Relaunch-Ankündigungs-Post als DRAFT in Supabase an.
 * Status bleibt 'draft' — Yusef fügt im Admin-Composer die Bilder ein
 * (Cover + Inline) und veröffentlicht selbst.
 *
 * Lokal ausführen:
 *   node scripts/seed-thoughts-relaunch.mjs
 *
 * Danach: admin.yusefbach.de/dashboard/thoughts → Post öffnen → Bilder → Publish.
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

const CONTENT_EN = `Version numbers rarely tell the real story. "v3.0.0" doesn't say much on its own — so here's what actually changed.

## Where it started

This portfolio used to be a static page. HTML, CSS, a bit of JavaScript, one language, no way to change anything without opening the code. That was fine for a while. It stopped being fine once I wanted it to actually reflect how I work.

## Three languages, properly

Adding English and Arabic was the easy part. Making Google actually *see* them was not. Client-side translation means a search engine only ever indexes whatever language happened to load first — in my case, always German. So the site now pre-renders a full static copy per language at build time: German at the root, English under \`/en/\`, Arabic under \`/ar/\`, each with correct \`hreflang\` tags pointing at the others. Arabic gets a real right-to-left layout, not a mirrored afterthought.

![Image 1 — homepage, Arabic layout, RTL](IMG_1)

## An AI twin that's actually pleasant to use

The chat widget got a full rebuild. Not because the old one was broken, but because "good enough" isn't a standard I want attached to my own name. It's a small thing — a breathing icon, a panel that gets out of your way when you scroll, a full-screen sheet on mobile you can swipe closed — but small things are where craft shows.

![Image 2 — Ask Yusef chat open, mid-conversation](IMG_2)

## The part nobody sees: the admin panel

Every piece of content on this site — projects, this very post, the changelog entry you might read next — goes through a panel I built myself. Next.js, Supabase, an Apple-inspired interface with a command palette you can drive entirely from the keyboard. It's the part of this whole system I spent the most quiet hours on, and the part almost no visitor will ever see.

![Image 3 — admin dashboard](IMG_3)

Which is exactly why it needed to be secure. This panel will soon manage my actual live site — so it's protected by four independent layers: a strict access whitelist, a PIN as a second factor after login, rate limiting, and the standard security headers a production system should have. None of that is visible from the outside. That's the point.

![Image 4 — PIN / login screen](IMG_4)

## A homepage that doesn't feel like sections stacked on top of each other

The old homepage worked, but it *looked* like sections stacked on top of each other — a hero, then a hard color change, then another hard color change. The new one is one continuous surface. A soft light field follows your cursor through the hero. Scroll reveals resolve gently instead of just appearing. It's a small shift in feeling, but it's the difference between a page and a place.

![Image 5 — homepage hero, new design](IMG_5)

## What's underneath all of it

Public blog, a public changelog with clickable detail cards, a live roadmap, a GitHub activity widget that rebuilds itself daily — all editable from that same admin panel, none of it touching a database from the browser. If the backend goes down, the site stays up. That was true before this release and it's still true now — just with a lot more behind it.

Still no framework on the public side. Still Vanilla TypeScript, still HTML and CSS I wrote myself. That part was never up for negotiation.

---

Full technical breakdown: [the changelog](/changelog.html). Code: [GitHub](https://github.com/yusef03/PortfolioBach).`

const CONTENT_DE = `Versionsnummern erzählen selten die echte Geschichte. "v3.0.0" sagt für sich genommen nicht viel — also hier, was sich wirklich verändert hat.

## Wo es anfing

Dieses Portfolio war mal eine statische Seite. HTML, CSS, etwas JavaScript, eine Sprache, keine Möglichkeit irgendetwas zu ändern, ohne den Code zu öffnen. Eine Weile war das in Ordnung. Es hörte auf, in Ordnung zu sein, als ich wollte, dass die Seite tatsächlich widerspiegelt, wie ich arbeite.

## Drei Sprachen, richtig gemacht

Englisch und Arabisch hinzuzufügen war der einfache Teil. Dafür zu sorgen, dass Google sie tatsächlich *sieht*, war es nicht. Client-seitige Übersetzung bedeutet: eine Suchmaschine indexiert immer nur die Sprache, die zuerst geladen wird — bei mir war das immer Deutsch. Die Seite rendert jetzt beim Build eine vollständige statische Kopie pro Sprache vor: Deutsch im Root, Englisch unter \`/en/\`, Arabisch unter \`/ar/\`, jede mit korrekten \`hreflang\`-Tags. Arabisch bekommt ein echtes Rechts-nach-links-Layout, keinen gespiegelten Nachgedanken.

![Bild 1 — Startseite, arabisches Layout, RTL](IMG_1)

## Ein KI-Zwilling, der tatsächlich angenehm zu benutzen ist

Das Chat-Widget wurde komplett neu gebaut. Nicht weil das alte kaputt war, sondern weil "gut genug" kein Standard ist, den ich an meinen eigenen Namen hängen will. Es sind kleine Dinge — ein atmendes Icon, ein Panel, das sich beim Scrollen dezent zurückzieht, ein Vollbild-Sheet auf Mobile, das man wegwischen kann — aber kleine Dinge sind der Ort, an dem sich Sorgfalt zeigt.

![Bild 2 — Ask Yusef Chat offen, mitten im Gespräch](IMG_2)

## Der Teil, den niemand sieht: das Admin Panel

Jeder Inhalt auf dieser Seite — Projekte, dieser Beitrag, der Changelog-Eintrag, den du als Nächstes liest — läuft durch ein Panel, das ich selbst gebaut habe. Next.js, Supabase, eine Apple-artige Oberfläche mit einer Befehlspalette, die sich komplett per Tastatur bedienen lässt. Es ist der Teil dieses ganzen Systems, in den die meisten stillen Stunden geflossen sind — und der Teil, den fast kein Besucher je sehen wird.

![Bild 3 — Admin-Dashboard](IMG_3)

Genau deshalb musste er sicher sein. Dieses Panel wird bald meine echte Live-Seite verwalten — also ist es mit vier unabhängigen Ebenen geschützt: einer strikten Zugangs-Whitelist, einem PIN als zweitem Faktor nach dem Login, Rate-Limiting und den Standard-Security-Headern, die ein produktives System haben sollte. Nichts davon ist von außen sichtbar. Das ist der Punkt.

![Bild 4 — PIN-/Login-Bildschirm](IMG_4)

## Eine Startseite, die sich nicht wie aneinandergereihte Blöcke anfühlt

Die alte Startseite hat funktioniert, aber sie *sah aus* wie aneinandergereihte Blöcke — ein Hero, dann ein harter Farbwechsel, dann noch einer. Die neue ist eine durchgehende Fläche. Ein weiches Lichtfeld folgt dem Cursor durch den Hero. Scroll-Elemente lösen sich sanft auf, statt einfach zu erscheinen. Es ist ein kleiner Unterschied im Gefühl — aber es ist der Unterschied zwischen einer Seite und einem Ort.

![Bild 5 — Startseiten-Hero, neues Design](IMG_5)

## Was darunter liegt

Öffentlicher Blog, ein öffentlicher Changelog mit anklickbaren Detail-Karten, eine Live-Roadmap, ein GitHub-Aktivitäts-Widget, das sich täglich selbst neu baut — alles über dasselbe Admin Panel pflegbar, nichts davon spricht direkt aus dem Browser mit einer Datenbank. Fällt das Backend aus, bleibt die Seite online. Das war schon vor diesem Release so und ist es immer noch — nur mit deutlich mehr dahinter.

Immer noch kein Framework auf der öffentlichen Seite. Immer noch Vanilla TypeScript, immer noch HTML und CSS, das ich selbst geschrieben habe. Das stand nie zur Debatte.

---

Vollständiger technischer Überblick: [der Changelog](/changelog.html). Code: [GitHub](https://github.com/yusef03/PortfolioBach).`

const POST = {
  slug: 'v3-managed-relaunch',
  title_en: 'The Managed Relaunch — What v3.0.0 Actually Is',
  excerpt_en: 'Three languages with real SEO, a rebuilt AI twin, a security-hardened admin panel, and a homepage that stopped feeling like stacked blocks. What actually changed in v3.0.0 — and why.',
  content_en: CONTENT_EN,
  title_de: 'Der große Relaunch — was v3.0.0 wirklich ist',
  excerpt_de: 'Drei Sprachen mit echtem SEO, ein neu gebauter KI-Zwilling, ein sicherheitsgehärtetes Admin Panel, und eine Startseite, die nicht mehr wie aneinandergereihte Blöcke wirkt. Was sich in v3.0.0 wirklich geändert hat — und warum.',
  content_de: CONTENT_DE,
  tags: ['Architektur', 'AI', 'Security', 'Engineering'],
  status: 'draft',
}

async function main() {
  console.log('→ Seed Thoughts-Post: v3-managed-relaunch (draft)\n')
  const res = await fetch(`${SUPABASE_URL}/rest/v1/thoughts?slug=eq.${POST.slug}`, { headers: HEADERS })
  const existing = await res.json()

  if (existing.length) {
    const put = await fetch(`${SUPABASE_URL}/rest/v1/thoughts?slug=eq.${POST.slug}`, {
      method: 'PATCH', headers: { ...HEADERS, Prefer: 'return=minimal' }, body: JSON.stringify(POST),
    })
    if (!put.ok) throw new Error(await put.text())
    console.log('   ✓ Aktualisiert (bereits vorhanden)')
  } else {
    const post = await fetch(`${SUPABASE_URL}/rest/v1/thoughts`, {
      method: 'POST', headers: { ...HEADERS, Prefer: 'return=minimal' }, body: JSON.stringify(POST),
    })
    if (!post.ok) throw new Error(await post.text())
    console.log('   ✓ Angelegt als Entwurf')
  }
  console.log('\n✅  Fertig. Öffne admin.yusefbach.de/dashboard/thoughts → Post → Bilder einfügen → Publish.')
}

main().catch(e => { console.error('❌ ', e.message); process.exit(1) })
