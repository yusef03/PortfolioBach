/**
 * finalize-thoughts-relaunch.mjs
 *
 * Letzter Schritt für den v3-Relaunch-Thoughts-Post:
 *  - setzt cover_image_url
 *  - ersetzt die IMG_1..IMG_4-Platzhalter in EN/DE durch die echten
 *    Supabase-Storage-URLs (Bild 5 wurde entfernt, wie gewünscht)
 *  - ergänzt die komplette arabische Version (title_ar/excerpt_ar/content_ar) —
 *    fehlte bisher komplett
 *
 * Bleibt status='draft' — Yusef prüft im Admin-Composer und veröffentlicht selbst.
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

const SB_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SB_URL || !SB_KEY) { console.error('❌  SUPABASE env fehlt.'); process.exit(1) }

const POST_ID = '1066de9f-a20e-49f8-97e0-493a3b3ba77b'
const BASE = `https://msfmugoazylvbqvyidlg.supabase.co/storage/v1/object/public/thoughts-media/thoughts/${POST_ID}`

const IMG = {
  cover: `${BASE}/cover.png`,
  img1: `${BASE}/ar_rtl.png`,
  img2: `${BASE}/chatbox.png`,
  img3: `${BASE}/admindashboard.png`,
  img4: `${BASE}/adminlogin.png`,
}

// ─── EN ─────────────────────────────────────────────────────────────────────
const CONTENT_EN = `Version numbers rarely tell the real story. "v3.0.0" doesn't say much on its own — so here's what actually changed.

## Where it started

This portfolio used to be a static page. HTML, CSS, a bit of JavaScript, one language, no way to change anything without opening the code. That was fine for a while. It stopped being fine once I wanted it to actually reflect how I work.

## Three languages, properly

Adding English and Arabic was the easy part. Making Google actually *see* them was not. Client-side translation means a search engine only ever indexes whatever language happened to load first — in my case, always German. So the site now pre-renders a full static copy per language at build time: German at the root, English under \`/en/\`, Arabic under \`/ar/\`, each with correct \`hreflang\` tags pointing at the others. Arabic gets a real right-to-left layout, not a mirrored afterthought.

![Homepage, Arabic layout, RTL](${IMG.img1})

## An AI twin that's actually pleasant to use

The chat widget got a full rebuild. Not because the old one was broken, but because "good enough" isn't a standard I want attached to my own name. It's a small thing — a breathing icon, a panel that gets out of your way when you scroll, a full-screen sheet on mobile you can swipe closed — but small things are where craft shows.

![Ask Yusef chat, open](${IMG.img2})

## The part nobody sees: the admin panel

Every piece of content on this site — projects, this very post, the changelog entry you might read next — goes through a panel I built myself. Next.js, Supabase, an Apple-inspired interface with a command palette you can drive entirely from the keyboard. It's the part of this whole system I spent the most quiet hours on, and the part almost no visitor will ever see.

![Admin dashboard](${IMG.img3})

Which is exactly why it needed to be secure. This panel will soon manage my actual live site — so it's protected by four independent layers: a strict access whitelist, a PIN as a second factor after login, rate limiting, and the standard security headers a production system should have. None of that is visible from the outside. That's the point.

![PIN / second-factor screen](${IMG.img4})

## A homepage that doesn't feel like sections stacked on top of each other

The old homepage worked, but it *looked* like sections stacked on top of each other — a hero, then a hard color change, then another hard color change. The new one is one continuous surface. A soft light field follows your cursor through the hero. Scroll reveals resolve gently instead of just appearing. It's a small shift in feeling, but it's the difference between a page and a place.

## What's underneath all of it

Public blog, a public changelog with clickable detail cards, a live roadmap, a GitHub activity widget that rebuilds itself daily — all editable from that same admin panel, none of it touching a database from the browser. If the backend goes down, the site stays up. That was true before this release and it's still true now — just with a lot more behind it.

Still no framework on the public side. Still Vanilla TypeScript, still HTML and CSS I wrote myself. That part was never up for negotiation.

---

Full technical breakdown: [the changelog](/changelog.html). Code: [GitHub](https://github.com/yusef03/PortfolioBach).`

// ─── DE ─────────────────────────────────────────────────────────────────────
const CONTENT_DE = `Versionsnummern erzählen selten die echte Geschichte. "v3.0.0" sagt für sich genommen nicht viel — also hier, was sich wirklich verändert hat.

## Wo es anfing

Dieses Portfolio war mal eine statische Seite. HTML, CSS, etwas JavaScript, eine Sprache, keine Möglichkeit irgendetwas zu ändern, ohne den Code zu öffnen. Eine Weile war das in Ordnung. Es hörte auf, in Ordnung zu sein, als ich wollte, dass die Seite tatsächlich widerspiegelt, wie ich arbeite.

## Drei Sprachen, richtig gemacht

Englisch und Arabisch hinzuzufügen war der einfache Teil. Dafür zu sorgen, dass Google sie tatsächlich *sieht*, war es nicht. Client-seitige Übersetzung bedeutet: eine Suchmaschine indexiert immer nur die Sprache, die zuerst geladen wird — bei mir war das immer Deutsch. Die Seite rendert jetzt beim Build eine vollständige statische Kopie pro Sprache vor: Deutsch im Root, Englisch unter \`/en/\`, Arabisch unter \`/ar/\`, jede mit korrekten \`hreflang\`-Tags. Arabisch bekommt ein echtes Rechts-nach-links-Layout, keinen gespiegelten Nachgedanken.

![Startseite, arabisches Layout, RTL](${IMG.img1})

## Ein KI-Zwilling, der tatsächlich angenehm zu benutzen ist

Das Chat-Widget wurde komplett neu gebaut. Nicht weil das alte kaputt war, sondern weil "gut genug" kein Standard ist, den ich an meinen eigenen Namen hängen will. Es sind kleine Dinge — ein atmendes Icon, ein Panel, das sich beim Scrollen dezent zurückzieht, ein Vollbild-Sheet auf Mobile, das man wegwischen kann — aber kleine Dinge sind der Ort, an dem sich Sorgfalt zeigt.

![Ask Yusef Chat, geöffnet](${IMG.img2})

## Der Teil, den niemand sieht: das Admin Panel

Jeder Inhalt auf dieser Seite — Projekte, dieser Beitrag, der Changelog-Eintrag, den du als Nächstes liest — läuft durch ein Panel, das ich selbst gebaut habe. Next.js, Supabase, eine Apple-artige Oberfläche mit einer Befehlspalette, die sich komplett per Tastatur bedienen lässt. Es ist der Teil dieses ganzen Systems, in den die meisten stillen Stunden geflossen sind — und der Teil, den fast kein Besucher je sehen wird.

![Admin-Dashboard](${IMG.img3})

Genau deshalb musste er sicher sein. Dieses Panel wird bald meine echte Live-Seite verwalten — also ist es mit vier unabhängigen Ebenen geschützt: einer strikten Zugangs-Whitelist, einem PIN als zweitem Faktor nach dem Login, Rate-Limiting und den Standard-Security-Headern, die ein produktives System haben sollte. Nichts davon ist von außen sichtbar. Das ist der Punkt.

![PIN-/Zweitfaktor-Bildschirm](${IMG.img4})

## Eine Startseite, die sich nicht wie aneinandergereihte Blöcke anfühlt

Die alte Startseite hat funktioniert, aber sie *sah aus* wie aneinandergereihte Blöcke — ein Hero, dann ein harter Farbwechsel, dann noch einer. Die neue ist eine durchgehende Fläche. Ein weiches Lichtfeld folgt dem Cursor durch den Hero. Scroll-Elemente lösen sich sanft auf, statt einfach zu erscheinen. Es ist ein kleiner Unterschied im Gefühl — aber es ist der Unterschied zwischen einer Seite und einem Ort.

## Was darunter liegt

Öffentlicher Blog, ein öffentlicher Changelog mit anklickbaren Detail-Karten, eine Live-Roadmap, ein GitHub-Aktivitäts-Widget, das sich täglich selbst neu baut — alles über dasselbe Admin Panel pflegbar, nichts davon spricht direkt aus dem Browser mit einer Datenbank. Fällt das Backend aus, bleibt die Seite online. Das war schon vor diesem Release so und ist es immer noch — nur mit deutlich mehr dahinter.

Immer noch kein Framework auf der öffentlichen Seite. Immer noch Vanilla TypeScript, immer noch HTML und CSS, das ich selbst geschrieben habe. Das stand nie zur Debatte.

---

Vollständiger technischer Überblick: [der Changelog](/changelog.html). Code: [GitHub](https://github.com/yusef03/PortfolioBach).`

// ─── AR ─────────────────────────────────────────────────────────────────────
const CONTENT_AR = `أرقام الإصدارات نادرًا ما تحكي القصة الحقيقية. "v3.0.0" لا تقول الكثير بمفردها — إذن، إليك ما تغيّر فعلًا.

## من أين بدأ الأمر

كانت هذه المحفظة صفحة ثابتة. HTML، وCSS، وقليل من JavaScript، لغة واحدة، ولا طريقة لتغيير أي شيء دون فتح الكود. كان هذا مقبولًا لفترة. توقّف عن أن يكون مقبولًا حين أردتُ أن تعكس الصفحة فعلًا الطريقة التي أعمل بها.

## ثلاث لغات، بالشكل الصحيح

إضافة الإنجليزية والعربية كانت الجزء السهل. أما جعل Google *يرى* هذه اللغات فعلًا فلم يكن كذلك. الترجمة من جهة العميل تعني أن محرّك البحث يفهرس دائمًا اللغة التي تُحمَّل أولًا — وفي حالتي، كانت هذه دائمًا الألمانية. الآن تُصيِّر الصفحة نسخة ثابتة كاملة لكل لغة أثناء البناء: الألمانية في الجذر، الإنجليزية تحت \`/en/\`، والعربية تحت \`/ar/\`، وكل واحدة بعلامات \`hreflang\` صحيحة تشير إلى الأخريات. تحصل العربية على تخطيط حقيقي من اليمين إلى اليسار، لا فكرة لاحقة معكوسة.

![الصفحة الرئيسية، التخطيط العربي، من اليمين إلى اليسار](${IMG.img1})

## توأم ذكاء اصطناعي ممتع فعلًا في الاستخدام

أُعيد بناء أداة الدردشة بالكامل. ليس لأن القديمة كانت معطّلة، بل لأن "جيد بما يكفي" ليس معيارًا أريد ربطه باسمي. إنها أشياء صغيرة — أيقونة "تتنفّس"، لوحة تبتعد بلطف عندما تُمرِّر الصفحة، ورقة ملء شاشة على الجوال يمكن سحبها لإغلاقها — لكن الأشياء الصغيرة هي حيث تظهر الحرفية.

![دردشة Ask Yusef، مفتوحة](${IMG.img2})

## الجزء الذي لا يراه أحد: لوحة التحكّم

كل محتوى على هذا الموقع — المشاريع، هذا المقال نفسه، مدخل سجلّ التغييرات الذي قد تقرأه بعد ذلك — يمرّ عبر لوحة بنيتها بنفسي. Next.js وSupabase وواجهة بأسلوب Apple مع لوحة أوامر يمكن التحكّم بها بالكامل من لوحة المفاتيح. إنه الجزء من هذا النظام كله الذي أمضيت فيه أكثر الساعات الهادئة — والجزء الذي لن يراه أي زائر تقريبًا.

![لوحة تحكّم الإدارة](${IMG.img3})

ولهذا بالتحديد كان يجب أن يكون آمنًا. ستدير هذه اللوحة قريبًا موقعي الحقيقي المباشر — لذا فهي محمية بأربع طبقات مستقلة: قائمة وصول بيضاء صارمة، ورمز PIN كعامل تحقّق ثانٍ بعد تسجيل الدخول، وتقييد معدّل الطلبات، ورؤوس الأمان القياسية التي يجب أن يمتلكها أي نظام إنتاجي. لا شيء من هذا مرئي من الخارج. هذا بالضبط هو المقصود.

![شاشة PIN / العامل الثاني](${IMG.img4})

## صفحة رئيسية لا تبدو كأقسام مكدَّسة فوق بعضها

كانت الصفحة الرئيسية القديمة تعمل، لكنها *بدت* كأقسام مكدَّسة فوق بعضها — قسم رئيسي، ثم تغيير لوني حاد، ثم آخر. الصفحة الجديدة سطح واحد متواصل. هالة ضوئية ناعمة تتبع مؤشر الفأرة عبر القسم الرئيسي. تتكشّف عناصر التمرير برفق بدلًا من أن تظهر فجأة. إنه فرق بسيط في الشعور — لكنه الفرق بين صفحة ومكان.

## ما الذي يقف خلف كل هذا

مدوّنة عامة، سجلّ تغييرات عام ببطاقات تفاصيل قابلة للنقر، خارطة طريق حيّة، أداة نشاط GitHub تُعيد بناء نفسها يوميًا — كل ذلك قابل للتعديل من نفس لوحة التحكّم، ولا شيء منه يتواصل مباشرة مع قاعدة بيانات من المتصفّح. إذا تعطّل الخادم الخلفي، يبقى الموقع يعمل. كان هذا صحيحًا قبل هذا الإصدار، وما زال صحيحًا الآن — فقط مع الكثير خلفه.

ما زال لا يوجد إطار عمل في الواجهة العامة. ما زالت TypeScript خالصة، وما زال HTML وCSS من كتابتي أنا. هذا الجزء لم يكن أبدًا محل نقاش.

---

نظرة تقنية كاملة: [سجلّ التغييرات](/changelog.html). الكود: [GitHub](https://github.com/yusef03/PortfolioBach).`

const TITLE_AR = 'إعادة الإطلاق الكبرى — ما هو v3.0.0 فعلًا'
const EXCERPT_AR = 'ثلاث لغات بتحسين حقيقي لمحركات البحث، توأم ذكاء اصطناعي أُعيد بناؤه بالكامل، لوحة تحكّم محصّنة أمنيًا، وصفحة رئيسية لم تعد تبدو كأقسام مكدّسة. ما تغيّر فعلًا في v3.0.0 — ولماذا.'

const UPDATE = {
  cover_image_url: IMG.cover,
  content_en: CONTENT_EN,
  content_de: CONTENT_DE,
  title_ar: TITLE_AR,
  excerpt_ar: EXCERPT_AR,
  content_ar: CONTENT_AR,
}

async function main() {
  console.log('→ Finalisiere Thoughts-Post: Bilder + AR-Version\n')
  const res = await fetch(`${SB_URL}/rest/v1/thoughts?id=eq.${POST_ID}`, {
    method: 'PATCH',
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(UPDATE),
  })
  if (!res.ok) throw new Error(await res.text())
  console.log('   ✓ Post aktualisiert: cover + EN/DE mit echten Bildern, AR komplett ergänzt')
  console.log('\n✅  Fertig. Status bleibt "draft" — im Admin Panel prüfen und veröffentlichen.')
}

main().catch(e => { console.error('❌ ', e.message); process.exit(1) })
