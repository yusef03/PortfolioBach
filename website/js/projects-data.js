// AUTO-GENERIERT aus Supabase via scripts/build-projects.mjs — NICHT manuell editieren!
// Letzte Aktualisierung: 2026-07-04T18:05:12.133Z

const projectsData = [
  {
    id: "74d9894a-2c52-4aa9-8fdd-c673b39b671d",
    slug: "studynexus",
    title: "StudyNexus",
    description_de: `Eine gamifizierte SaaS-Plattform für HS Hannover Studierende. Vollständiger Full-Stack Monorepo: Next.js 14 App Router, FastAPI, PostgreSQL, Redis & Docker – mit Kanban-Board, 15-Minuten Schedule-Grid, visuellem Studienplan und echtem GPA-Tracking.`,
    description_en: `A gamified SaaS platform exclusively for HS Hannover students. Full-stack monorepo: Next.js 14 App Router, FastAPI, PostgreSQL, Redis & Docker – with Kanban board, 15-minute schedule grid, visual study plan and real GPA tracking.`,
    description_ar: `منصة SaaS مُحفَّزة بعناصر اللعب حصريًا لطلاب جامعة هانوفر للعلوم التطبيقية. مستودع Full-Stack متكامل: Next.js 14 App Router و FastAPI و PostgreSQL و Redis و Docker — مع لوحة Kanban، وشبكة جدولة بدقّة 15 دقيقة، وخطة دراسية مرئية، وتتبُّع فعلي للمعدّل التراكمي (GPA).`,
    badges: ["Next.js 14", "FastAPI", "PostgreSQL", "Docker", "Redis", "TypeScript", "Python"],
    features: [
      { de: `Full-Stack Monorepo: Next.js 14 + FastAPI + PostgreSQL`, en: `Full-Stack Monorepo: Next.js 14 + FastAPI + PostgreSQL`, ar: `مستودع Full-Stack موحّد: Next.js 14 + FastAPI + PostgreSQL` },
      { de: `Kanban, Schedule Board & visueller Studienplan`, en: `Kanban, Schedule Board & Visual Study Plan`, ar: `لوحة Kanban وجدول المواعيد وخطة دراسية مرئية` },
      { de: `JWT Auth, CSRF-Schutz, Docker Compose, DE/EN i18n`, en: `JWT Auth, CSRF Protection, Docker Compose, DE/EN i18n`, ar: `مصادقة JWT وحماية CSRF و Docker Compose ودعم لغتين (ألماني/إنجليزي)` }
    ],
    status: "in-progress",
    image_url: "images/projects/studynexus/preview.svg",
    github_url: "https://github.com/yusef03/studynexus",
    demo_url: null,
    subpage_url: "projects/studynexus.html",
    timeframe: "04/2026 — laufend",
    role: "Product Owner & Full-Stack Developer",
    is_hero: true,
    sort_order: 0
  },
  {
    id: "71a68e5f-4977-485b-a9a0-9c73f28bd973",
    slug: "phishing-defender",
    title: "PhishingDefender",
    description_de: `Ein interaktives Lernspiel ('Serious Game') zur Cybersicherheit. Ziel ist es, Kindern und Jugendlichen das Erkennen von Phishing-Mails beizubringen.`,
    description_en: `An interactive learning game ('Serious Game') for cyber security. The goal is to teach children and teenagers how to recognize phishing emails.`,
    description_ar: `لعبة تعليمية تفاعلية ('Serious Game') في مجال الأمن السيبراني. الهدف تعليم الأطفال والمراهقين كيفية التعرّف على رسائل التصيّد الاحتيالي (Phishing).`,
    badges: ["Java 17", "Swing / AWT", "Gson (JSON)", "MVC Pattern"],
    features: [
      { de: `<strong>Pure Java:</strong> Keine Game-Engine. UI, Animationen (30 FPS Buffer) und Logik sind komplett selbst in Swing implementiert.`, en: `<strong>Pure Java:</strong> No game engine. UI, animations (30 FPS buffer), and logic are fully implemented in Swing.`, ar: `<strong>جافا خالصة:</strong> بدون محرّك ألعاب. الواجهة والرسوم المتحركة (مخزّن مؤقت 30 إطارًا/ثانية) والمنطق مُنفَّذة بالكامل يدويًا في Swing.` },
      { de: `<strong>Architektur:</strong> Saubere Trennung durch Manager-Klassen (Sound, Settings, Achievements).`, en: `<strong>Architecture:</strong> Clean separation via Manager classes (Sound, Settings, Achievements).`, ar: `<strong>المعمارية:</strong> فصل نظيف عبر فئات إدارة (الصوت، الإعدادات، الإنجازات).` },
      { de: `<strong>Features:</strong> Highscore-System, Speichern (JSON), Admin-Modus und interaktives 'Cyber-HQ'.`, en: `<strong>Features:</strong> Highscore system, Save (JSON), Admin Mode, and interactive 'Cyber-HQ'.`, ar: `<strong>الميزات:</strong> نظام أعلى النقاط، حفظ (JSON)، وضع المدير، ومقرّ سيبراني تفاعلي ('Cyber-HQ').` }
    ],
    status: "completed",
    image_url: "images/projects/phishing/hero.png",
    github_url: "https://github.com/yusef03/PhishingDefender",
    demo_url: null,
    subpage_url: "projects/phishing-defender.html",
    timeframe: null,
    role: null,
    is_hero: false,
    sort_order: 1
  },
  {
    id: "9c53279b-c8b0-4d7b-91a7-ef9534a36571",
    slug: "html-cv",
    title: "HTML/CSS CV Engine",
    description_de: `Entwicklung einer Print-Optimierten Rendering-Engine für Bewerbungsunterlagen. Pixelgenaues A4-Design direkt im Browser.`,
    description_en: `Development of a print-optimized rendering engine for application documents. Pixel-perfect A4 design directly in the browser.`,
    description_ar: `تطوير محرّك عرض (Rendering Engine) مُحسَّن للطباعة لمستندات التقديم. تصميم A4 بدقّة البكسل مباشرة داخل المتصفّح.`,
    badges: ["HTML5", "CSS3 Print", "Git Privacy", "Glassmorphism"],
    features: [
      { de: `<strong>Print CSS:</strong> Pixelgenaue A4-Skalierung via @page Rules.`, en: `<strong>Print CSS:</strong> Pixel-perfect A4 scaling via @page rules.`, ar: `<strong>Print CSS:</strong> قياس A4 بدقّة البكسل عبر قواعد @page.` },
      { de: `<strong>Privacy-First:</strong> Datentrennung via .gitignore Strategie.`, en: `<strong>Privacy-First:</strong> Data separation via .gitignore strategy.`, ar: `<strong>الخصوصية أولًا:</strong> فصل البيانات عبر استراتيجية .gitignore.` },
      { de: `<strong>No-Framework:</strong> 100% Vanilla HTML5 & CSS3 Architecture.`, en: `<strong>No-Framework:</strong> 100% Vanilla HTML5 & CSS3 Architecture.`, ar: `<strong>بدون إطار عمل:</strong> معمارية 100% Vanilla HTML5 و CSS3.` }
    ],
    status: "completed",
    image_url: "images/projects/cv-engine/cv.png",
    github_url: "https://github.com/yusef03/Custom-Modern-Html-CV",
    demo_url: null,
    subpage_url: "projects/html-cv.html",
    timeframe: null,
    role: null,
    is_hero: false,
    sort_order: 2
  },
  {
    id: "fff06151-a507-4a41-9ca3-cae1efbf424d",
    slug: "community-software",
    title: "Community Projekt",
    description_de: `Fokus auf die Entwicklung von Gameplay-Features und UIs mittels Lua und JavaScript sowie die Verwaltung und Optimierung von SQL-Datenbanken für hohen User-Traffic.`,
    description_en: `Focus on the development of gameplay features and UIs using Lua and JavaScript, alongside administration and optimization of SQL databases for high user traffic.`,
    description_ar: `التركيز على تطوير ميزات اللعب وواجهات المستخدم باستخدام Lua و JavaScript، إلى جانب إدارة وتحسين قواعد بيانات SQL لحركة مرور مرتفعة من المستخدمين.`,
    badges: ["Lua", "JavaScript", "SQL Optimization", "Git Release Management", "2nd-Level Support"],
    features: [
      { de: `<strong>Gameplay & UI:</strong> Entwicklung von Gameplay-Systemen & UI-Komponenten mit (Lua/JS).`, en: `<strong>Gameplay & UI:</strong> Development of gameplay systems & UI components (Lua/JS).`, ar: `<strong>اللعب والواجهات:</strong> تطوير أنظمة اللعب ومكوّنات الواجهة (Lua/JS).` },
      { de: `<strong>SQL-Architektur:</strong> Architektur & Optimierung relationaler SQL-Datenbanken für Live-Betrieb.`, en: `<strong>SQL Architecture:</strong> Architecture & optimization of relational SQL databases for live operation.`, ar: `<strong>معمارية SQL:</strong> تصميم وتحسين قواعد بيانات SQL العلائقية للتشغيل الحيّ.` },
      { de: `<strong>DevOps & Support:</strong> Striktes Release-Management über Git und Troubleshooting (2nd-Level).`, en: `<strong>DevOps & Support:</strong> Strict release management via Git and technical troubleshooting (2nd-Level).`, ar: `<strong>DevOps والدعم:</strong> إدارة إصدارات صارمة عبر Git واستكشاف الأعطال (الدعم من المستوى الثاني).` }
    ],
    status: "active",
    image_url: "images/projects/community/com.png",
    github_url: "https://github.com/yusef03",
    demo_url: null,
    subpage_url: "projects/community-software.html",
    timeframe: "01/2021 - 09/2023",
    role: "Lead Developer & Community Management",
    is_hero: false,
    sort_order: 3
  },
  {
    id: "8d875ed0-bb1a-4c8c-b8c5-d85519f19dbb",
    slug: "portfolio-meta",
    title: "Portfolio System Architecture",
    description_de: `Dokumentation des Portfolios selbst. Von statischem HTML zur dynamischen Rendering-Engine. Ein Deep-Dive in Software-Architektur, DNS-Routing und Performance.`,
    description_en: `Documentation of the portfolio itself. From static HTML to a dynamic rendering engine. A deep dive into software architecture, DNS routing, and performance.`,
    description_ar: `توثيق المحفظة ذاتها. من HTML ثابت إلى محرّك عرض ديناميكي. تحليل معمّق في معمارية البرمجيات وتوجيه DNS والأداء.`,
    badges: ["Architecture", "Vanilla JS", "DevOps", "Case Study"],
    features: [],
    status: "active",
    image_url: "images/projects/portfolio-meta/logopf.png",
    github_url: "https://github.com/yusef03/PortfolioBach",
    demo_url: null,
    subpage_url: "projects/portfolio-meta.html",
    timeframe: null,
    role: null,
    is_hero: false,
    sort_order: 4
  }
];

const githubCard = {
  "url": "https://github.com/yusef03",
  "btn_ar": "إلى الملف الشخصي",
  "btn_de": "Zum Profil",
  "btn_en": "To Profile",
  "text_ar": "تصفح مستودعاتي الحديثة وتجاربي البرمجية.",
  "text_de": "Schau dir meine aktuellen Repositories, Experimente und Code-Snippets an.",
  "text_en": "Check out my latest repositories, experiments and code snippets.",
  "title_ar": "المزيد على GitHub",
  "title_de": "Mehr auf GitHub",
  "title_en": "More on GitHub"
};
