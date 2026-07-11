-- ============================================================
-- Thoughts — Erste echte Posts (EN + DE + AR)
-- Erstellt: 2026-06-02
-- Ausführen: Supabase SQL-Editor → Cmd+A → Run
-- ============================================================


-- ── Post 1: Architektur vor Syntax ────────────────────────────────────────────

INSERT INTO thoughts (
  slug,
  title_en,   excerpt_en,   content_en,
  title_de,   excerpt_de,   content_de,
  title_ar,   excerpt_ar,   content_ar,
  tags, reading_minutes, status, published_at
) VALUES (
  'architektur-vor-syntax',

  -- EN -----------------------------------------------------------------------
  'Architecture Before Syntax — Why I Never Reach for the Framework First',
  'The first question on new projects is almost always: which framework? I prefer to start with a different question.',
  $EN1$
When someone starts a new project, the first question is usually: *"Which framework should we use?"* React? Next.js? Vue? The framework gets declared as the architecture before any problem has even been understood.

My approach is different. I start with questions, not tools.

## What's the actual problem?

When I built this portfolio, I could have used React. It would have been faster — components, state management, everything ready-made. Instead, I chose Vanilla TypeScript. Not out of principle, but as a deliberate decision: I wanted to understand how things work, not just how to use them.

The result? I now know exactly how an IntersectionObserver works, how Web Components are structured, how to build an i18n engine from scratch. No framework magic. Just code I fully understand.

## The foundation decides everything

With StudyNexus, my SaaS platform for students, the first question wasn't "React or Vue" either. It was: What data do we need? How does it relate? What happens when a user changes their schedule — which other parts of the system need to react?

Only once those questions are answered does the technology choice make sense. FastAPI for the async API, PostgreSQL for the relational structure, Docker Compose so development and production are identical. Every decision follows from the problem, not from the trend.

## When do I reach for a framework?

Whenever the problem demands it. The admin panel for this portfolio is built with Next.js — because Server Components, auth middleware, and API routes make sense there. That wasn't a default choice, it was a reasoned one.

The difference: I choose tools deliberately, not reflexively.

## The paradox

Those who choose the framework first only learn the framework. Those who understand the problem first learn computer science.

And in the end, a framework is just a tool. Tools change. Understanding stays.
  $EN1$,

  -- DE -----------------------------------------------------------------------
  'Architektur vor Syntax — warum ich nie zuerst nach dem Framework greife',
  'Die erste Frage bei neuen Projekten ist fast immer: welches Framework? Ich fange lieber mit einer anderen Frage an.',
  $DE1$
Wenn jemand ein neues Projekt startet, ist die erste Frage meistens: *„Welches Framework nehmen wir?"* React? Next.js? Vue? Das Framework wird zur Architektur erklärt, bevor irgendein Problem überhaupt verstanden wurde.

Mein Ansatz ist anders. Ich fange mit Fragen an, nicht mit Tools.

## Was ist das eigentliche Problem?

Als ich dieses Portfolio gebaut habe, hätte ich React nehmen können. Es wäre schneller gegangen — Komponenten, State Management, alles fertig. Stattdessen habe ich Vanilla TypeScript gewählt. Nicht aus Prinzip, sondern aus einer bewussten Entscheidung: Ich wollte verstehen, wie Dinge funktionieren, nicht nur wie man sie benutzt.

Das Ergebnis? Ich weiß heute genau, wie ein IntersectionObserver funktioniert, wie Web Components aufgebaut sind, wie eine i18n-Engine von Grund auf gebaut wird. Kein Framework-Magic. Nur Code, den ich vollständig verstehe.

## Das Fundament entscheidet alles

Bei StudyNexus, meiner SaaS-Plattform für Studierende, war die erste Frage auch nicht „React oder Vue". Sondern: Welche Daten brauchen wir? Wie hängen sie zusammen? Was passiert, wenn ein Nutzer seinen Stundenplan ändert — welche anderen Teile des Systems müssen reagieren?

Erst wenn diese Fragen beantwortet sind, ergibt die Technologiewahl Sinn. FastAPI für die async API, PostgreSQL für die relationale Struktur, Docker Compose damit Entwicklung und Produktion identisch sind. Jede Entscheidung folgt aus dem Problem, nicht aus dem Trend.

## Wann greife ich dann zum Framework?

Immer dann, wenn das Problem es verlangt. Das Admin Panel für dieses Portfolio ist in Next.js gebaut — weil Server Components, Auth Middleware und API Routes dort Sinn ergeben. Das war keine Standardwahl, das war eine begründete Wahl.

Der Unterschied: Ich wähle Tools bewusst, nicht reflexartig.

## Das Paradoxe

Wer zuerst das Framework wählt, lernt nur das Framework. Wer zuerst das Problem versteht, lernt Informatik.

Und am Ende ist ein Framework nur ein Werkzeug. Werkzeuge wechseln. Verständnis bleibt.
  $DE1$,

  -- AR -----------------------------------------------------------------------
  'البنية قبل البناء — لماذا لا أبدأ بالإطار البرمجي أولاً',
  'السؤال الأول في المشاريع الجديدة يكون دائماً: أيّ إطار برمجي؟ أفضّل البدء بسؤال مختلف.',
  $AR1$
عندما يبدأ أحدهم مشروعاً جديداً، يكون السؤال الأول عادةً: *«أيّ إطار برمجي سنستخدم؟»* React؟ Next.js؟ Vue؟ يُعلَن الإطار معماريةً للمشروع قبل أن تُفهم أي مشكلة أصلاً.

نهجي مختلف. أبدأ بالأسئلة، لا بالأدوات.

## ما هي المشكلة الحقيقية؟

حين بنيتُ هذه المحفظة، كان بإمكاني استخدام React. كان سيكون أسرع — مكونات جاهزة، إدارة حالة، كل شيء مُهيَّأ. بدلاً من ذلك، اخترت Vanilla TypeScript. ليس من باب المبدأ، بل كقرار واعٍ: أردتُ أن أفهم كيف تعمل الأشياء، لا كيف أستخدمها فحسب.

النتيجة؟ أعرف اليوم تماماً كيف يعمل IntersectionObserver، وكيف تُبنى Web Components، وكيف يُنشأ محرك i18n من الصفر. لا سحر للأطر. فقط كود أفهمه بالكامل.

## الأساس يحدد كل شيء

في StudyNexus، منصتي كخدمة للطلاب، لم يكن السؤال الأول «React أم Vue» هنا أيضاً. بل كان: ما البيانات التي نحتاجها؟ كيف ترتبط ببعضها؟ ما الذي يحدث حين يُغيِّر مستخدم جدوله الدراسي — أيّ أجزاء من النظام يجب أن تستجيب؟

فقط حين تُجاب هذه الأسئلة يصبح اختيار التقنية منطقياً. FastAPI للـ API غير المتزامن، PostgreSQL للبنية العلائقية، Docker Compose لضمان تطابق بيئتَي التطوير والإنتاج. كل قرار ينبثق من المشكلة، لا من الصيحة السائدة.

## متى أتناول إطاراً برمجياً إذن؟

في كل مرة يستدعيها المشكلة. لوحة الإدارة لهذه المحفظة مبنية بـ Next.js — لأن Server Components ومتوسط المصادقة ومسارات API منطقية هناك. لم يكن ذلك اختياراً افتراضياً، بل كان اختياراً مُسبَّباً.

الفارق: أختار الأدوات بوعي، لا بشكل انعكاسي.

## المفارقة

من يختار الإطار أولاً لا يتعلم سوى الإطار. من يفهم المشكلة أولاً يتعلم علم الحاسوب.

وفي النهاية، الإطار البرمجي مجرد أداة. الأدوات تتغير. الفهم يبقى.
  $AR1$,

  ARRAY['Mindset', 'Architektur', 'Engineering'],
  3,
  'published',
  now() - interval '3 days'
);


-- ── Post 2: Supabase Berechtigungen ───────────────────────────────────────────

INSERT INTO thoughts (
  slug,
  title_en,   excerpt_en,   content_en,
  title_de,   excerpt_de,   content_de,
  title_ar,   excerpt_ar,   content_ar,
  tags, reading_minutes, status, published_at
) VALUES (
  'supabase-berechtigungen-grants-rls',

  -- EN -----------------------------------------------------------------------
  'Supabase Permissions: The Two Layers Nobody Explains',
  'permission denied for table thoughts — hours of debugging, one fix. Supabase has two permission layers that almost nobody talks about.',
  $EN2$
I spent hours debugging a single error: `permission denied for table thoughts`. The error message was clear. The cause was not.

The problem: Supabase doesn't have one, but **two** independent permission layers — and both need to be correct.

## Layer 1: Row Level Security (RLS)

RLS is what everyone talks about. You enable it on a table, define policies — who can read or write which rows. This is the visible, documented layer.

```sql
CREATE POLICY "thoughts_public_read"
  ON thoughts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');
```

Looks good. Still doesn't work. Why?

## Layer 2: Table-Level GRANTs

Nobody talks about this — but beneath RLS lies a second layer: classic PostgreSQL GRANTs. These decide whether a role can *see* the table at all. Without a GRANT, even the best RLS policy is useless.

What caught me off guard: Supabase has **three different roles**, each requiring separate GRANTs:

| Role | Used for | GRANT |
|---|---|---|
| `anon` | Portfolio reads published posts | `SELECT` |
| `authenticated` | Admin panel reads and writes | `SELECT, INSERT, UPDATE, DELETE` |
| `service_role` | Build script reads all posts | `ALL` |

The critical mistake was `service_role`. The build script that generates my blog posts uses the service role key — and it had no GRANT. Admin panel? Worked. Portfolio? Worked. But `node scripts/build-thoughts.mjs` failed.

## The complete fix

```sql
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT                         ON thoughts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON thoughts TO authenticated;
GRANT ALL                            ON thoughts TO service_role;
```

Plus the RLS policies on top. Always both together.

## The rule

With any `permission denied` error in Supabase: check GRANTs first, then RLS. Both layers, all roles. This isn't stated clearly anywhere in the official documentation — so now it's stated here.
  $EN2$,

  -- DE -----------------------------------------------------------------------
  'Supabase-Berechtigungen: die zwei Schichten, die niemand erklärt',
  'permission denied for table thoughts — Stunden debuggen, eine Zeile Code. Supabase hat zwei Berechtigungsschichten, über die kaum jemand spricht.',
  $DE2$
Ich habe Stunden damit verbracht, einen einzigen Fehler zu debuggen: `permission denied for table thoughts`. Die Fehlermeldung war klar. Die Ursache war es nicht.

Das Problem: Supabase hat nicht eine, sondern **zwei** unabhängige Berechtigungsschichten — und beide müssen stimmen.

## Schicht 1: Row Level Security (RLS)

RLS ist das, worüber alle reden. Du aktivierst es auf einer Tabelle, definierst Policies — wer darf welche Zeilen lesen oder schreiben. Das ist die sichtbare, dokumentierte Schicht.

```sql
CREATE POLICY "thoughts_public_read"
  ON thoughts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');
```

Sieht gut aus. Funktioniert trotzdem nicht. Warum?

## Schicht 2: Table-Level GRANTs

Darüber spricht niemand — aber unter RLS liegt eine zweite Schicht: die klassischen PostgreSQL-GRANTs. Diese entscheiden, ob eine Rolle die Tabelle überhaupt *sehen* darf. Ohne GRANT hilft die beste RLS-Policy nichts.

Was mich kalt erwischt hat: Supabase hat **drei verschiedene Rollen**, die alle separate GRANTs brauchen:

| Rolle | Wofür | GRANT |
|---|---|---|
| `anon` | Portfolio liest veröffentlichte Posts | `SELECT` |
| `authenticated` | Admin Panel liest und schreibt | `SELECT, INSERT, UPDATE, DELETE` |
| `service_role` | Build-Script liest alle Posts | `ALL` |

Der entscheidende Fehler war `service_role`. Das Build-Script, das meine Blog-Posts generiert, nutzt den Service-Role-Key — und der hatte keinen GRANT. Admin Panel? Hat funktioniert. Portfolio? Hat funktioniert. Aber `node scripts/build-thoughts.mjs` schlug fehl.

## Die vollständige Lösung

```sql
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT                         ON thoughts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON thoughts TO authenticated;
GRANT ALL                            ON thoughts TO service_role;
```

Plus die RLS-Policies obendrauf. Immer beides zusammen.

## Die Regel

Bei jedem `permission denied`-Fehler in Supabase: erst GRANTs prüfen, dann RLS. Beide Schichten, alle Rollen. Das steht so nirgends in der offiziellen Dokumentation — deshalb steht es jetzt hier.
  $DE2$,

  -- AR -----------------------------------------------------------------------
  'صلاحيات Supabase: الطبقتان اللتان لا يشرحهما أحد',
  'أمضيتُ ساعات في تتبع خطأ واحد. السبب: Supabase تملك طبقتين من الصلاحيات لا يتحدث عنهما أحد تقريباً.',
  $AR2$
أمضيتُ ساعات في تتبع خطأ واحد: `permission denied for table thoughts`. الرسالة كانت واضحة. السبب لم يكن كذلك.

المشكلة: لا تملك Supabase طبقة صلاحيات واحدة، بل **طبقتين** مستقلتين — وكلتاهما يجب أن تكونا صحيحتين.

## الطبقة الأولى: أمان مستوى الصف (RLS)

RLS هو ما يتحدث عنه الجميع. تُفعِّله على جدول وتُعرِّف سياسات — من يستطيع قراءة أو كتابة أيّ صفوف. هذه هي الطبقة المرئية والموثقة.

```sql
CREATE POLICY "thoughts_public_read"
  ON thoughts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');
```

يبدو جيداً. لا يعمل رغم ذلك. لماذا؟

## الطبقة الثانية: صلاحيات مستوى الجدول (GRANTs)

لا أحد يتحدث عن هذا — لكن تحت RLS توجد طبقة ثانية: صلاحيات PostgreSQL الكلاسيكية. هي التي تحدد ما إذا كان دور ما يستطيع *رؤية* الجدول أصلاً. بدون GRANT لا تُجدي أفضل سياسة RLS نفعاً.

ما فاجأني: تملك Supabase **ثلاثة أدوار مختلفة**، كل منها يحتاج GRANTs منفصلة:

| الدور | الاستخدام | الصلاحية |
|---|---|---|
| `anon` | المحفظة تقرأ المنشورات المنشورة | `SELECT` |
| `authenticated` | لوحة الإدارة تقرأ وتكتب | `SELECT, INSERT, UPDATE, DELETE` |
| `service_role` | سكريبت البناء يقرأ جميع المنشورات | `ALL` |

الخطأ الحاسم كان في `service_role`. السكريبت الذي يُولِّد منشورات مدونتي يستخدم مفتاح service role — ولم يكن يملك GRANT. لوحة الإدارة؟ عملت. المحفظة؟ عملت. لكن `node scripts/build-thoughts.mjs` فشل.

## الحل الكامل

```sql
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT                         ON thoughts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON thoughts TO authenticated;
GRANT ALL                            ON thoughts TO service_role;
```

مع إضافة سياسات RLS فوقها. دائماً كلاهما معاً.

## القاعدة

مع أي خطأ `permission denied` في Supabase: تحقق من GRANTs أولاً، ثم RLS. كلتا الطبقتين، جميع الأدوار. هذا غير مُوضَّح بوضوح كافٍ في التوثيق الرسمي — لذا أوضحته هنا.
  $AR2$,

  ARRAY['Supabase', 'Backend', 'PostgreSQL'],
  2,
  'published',
  now()
);
