/* ============================================================================
 * bot.ts — Ask Yusef · Neural Console (AI-Twin-Chat-Widget)
 *
 * Vanilla-TypeScript. Läuft auf allen Portfolio-Seiten (DE/EN/AR).
 * Backend: stateless RAG (portfolio-bach-seven.vercel.app/api/chat).
 *
 * Features v2 (2026-07-04):
 *   - AI-Ring-FAB mit Attention-Pulse + First-Visit-Tooltip
 *   - Panel (Desktop/iPad) + Fullscreen-Sheet (Mobile) mit Swipe-to-close
 *   - Verlauf 30 Tage / max 50 Msgs in localStorage (Fallback: in-memory)
 *   - Context-aware Greeting + Prompt-Chips (Home / Projekt / Thought)
 *   - Typing-Dots + Typewriter-Reveal
 *   - Copy-Button + Timestamps + Char-Counter (max 400)
 *   - Cmd/Ctrl+K öffnet Panel (Desktop mit pointer:fine)
 *   - Info-Popover (Was ist dieser Bot? — RAG-Erklärung + Datenschutz)
 *   - Focus-Trap, role="dialog", aria-live, Esc-Close, Focus-Return
 *   - RTL (AR): FAB spiegelt, Send-Icon spiegelt
 *   - Reduced-Motion: alle Animationen deaktiviert
 *   - XSS-safe Markdown-Rendering (Bold, Bullets, Code-Blocks, Inline-Code)
 * ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // ── Konstanten ──────────────────────────────────────────────────────────
  const BACKEND_URL = "https://portfolio-bach-seven.vercel.app/api/chat";
  const HISTORY_KEY = "yb.bot.history.v1";
  const FIRST_VISIT_KEY = "yb.bot.firstVisit.v1";
  const MAX_HISTORY = 50;
  const HISTORY_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 Tage
  const CHAR_LIMIT = 400;
  const CHAR_WARN = 350;
  const TYPEWRITER_TOTAL_MS = 800; // Deckel: Reveal-Dauer nie länger als 800ms
  const TYPEWRITER_MIN_MS_PER_CHAR = 8;
  const DRAG_CLOSE_THRESHOLD = 120; // px runter → schließt
  const DRAG_VELOCITY_THRESHOLD = 0.5; // px/ms

  // ── Sprach-Ermittlung ───────────────────────────────────────────────────
  let currentLang: "de" | "en" | "ar" = (window.__PAGE_LANG__ ?? "de") as "de" | "en" | "ar";

  // ── i18n-Strings ────────────────────────────────────────────────────────
  type BotStrings = {
    title: string;
    subtitle: string;
    greeting: string;
    greetingProject: (project: string) => string;
    greetingThought: string;
    placeholder: string;
    thinking: string;
    fallbackNetwork: string;
    fallbackRate: string;
    fallbackServer: string;
    fabAria: string;
    closeAria: string;
    infoAria: string;
    infoTitle: string;
    infoBody: string;
    infoClose: string;
    copyAria: string;
    copied: string;
    clear: string;
    clearConfirm: string;
    charCount: (n: number, max: number) => string;
    tooltipHint: string;
    chips: string[];
    chipsProject: (project: string) => string[];
    chipsThought: string[];
  };

  const STRINGS: Record<"de" | "en" | "ar", BotStrings> = {
    de: {
      title: "Ask Yusef",
      subtitle: "AI Twin · Yusefs Wissen",
      greeting: "Hi! Ich bin Yusefs AI-Twin — trainiert auf seinem Wissen. Frag mich zu seinen Skills, Projekten oder Erfahrungen.",
      greetingProject: (p) => `Hi! Du bist gerade beim Projekt ${p}. Willst du wissen wie's gebaut wurde, welcher Stack drin steckt oder was die größte Challenge war?`,
      greetingThought: "Hi! Du liest gerade einen Yusef-Thought. Willst du eine Zusammenfassung, den Kontext dahinter, oder verwandte Projekte?",
      placeholder: "Schreib eine Nachricht…",
      thinking: "denkt nach",
      fallbackNetwork: "Meine Leitung zum AI-Backend hakt gerade. Wenn's eilt: schreib Yusef direkt an kontakt@yusefbach.de.",
      fallbackRate: "Kurz durchatmen — ich habe gerade viele Fragen gleichzeitig. Versuch's in einer Minute nochmal.",
      fallbackServer: "Server-Schluckauf. Yusef ist informiert. In der Zwischenzeit: die Projekt-Cases sind auch ohne mich lesenswert.",
      fabAria: "AI-Twin öffnen",
      closeAria: "Schließen",
      infoAria: "Was ist das?",
      infoTitle: "Was ist der AI-Twin?",
      infoBody: "Ich bin ein RAG-System, das auf Yusefs persönlicher Wissensbasis läuft (`yusef_brain.md`). Deine Frage geht an einen Serverless-Endpunkt (Vercel + Google Gemini), der die Antwort aus Yusefs Notizen zusammenbaut. Der Verlauf bleibt **lokal in deinem Browser** (30 Tage, max 50 Nachrichten) — nichts geht an Yusef. Volle Details in der [Datenschutzerklärung](/datenschutz.html).",
      infoClose: "Verstanden",
      copyAria: "Nachricht kopieren",
      copied: "Kopiert",
      clear: "Verlauf löschen",
      clearConfirm: "Verlauf komplett löschen?",
      charCount: (n, max) => `${n}/${max}`,
      tooltipHint: "Frag den AI-Twin",
      chips: [
        "Was macht dich als AI-Dev besonders?",
        "Deine wichtigsten Projekte?",
        "Wie war deine HDI-Zeit?"
      ],
      chipsProject: (p) => [
        `Wie hast du ${p} gebaut?`,
        "Welcher Tech-Stack?",
        "Größte Challenge?"
      ],
      chipsThought: [
        "Kurze Zusammenfassung?",
        "Warum dieses Thema?",
        "Verwandte Projekte?"
      ]
    },
    en: {
      title: "Ask Yusef",
      subtitle: "AI Twin · Yusef's brain",
      greeting: "Hi! I'm Yusef's AI Twin — trained on his knowledge. Ask me about his skills, projects, or experience.",
      greetingProject: (p) => `Hi! You're currently on the ${p} project page. Want to know how it was built, the tech stack, or the biggest challenge?`,
      greetingThought: "Hi! You're reading one of Yusef's Thoughts. Want a summary, the background, or related projects?",
      placeholder: "Write a message…",
      thinking: "thinking",
      fallbackNetwork: "My line to the AI backend is choppy right now. If it's urgent: reach Yusef directly at kontakt@yusefbach.de.",
      fallbackRate: "Give me a sec — lots of questions at once. Try again in a minute.",
      fallbackServer: "Server hiccup. Yusef has been notified. Meanwhile: the project case studies are worth a read on their own.",
      fabAria: "Open AI Twin",
      closeAria: "Close",
      infoAria: "What is this?",
      infoTitle: "What is the AI Twin?",
      infoBody: "I'm a RAG system running on Yusef's personal knowledge base (`yusef_brain.md`). Your question is sent to a serverless endpoint (Vercel + Google Gemini) that composes the answer from Yusef's notes. Your history stays **local in your browser** (30 days, max 50 messages) — nothing is sent to Yusef. Full details in the [privacy notice](/datenschutz.html).",
      infoClose: "Got it",
      copyAria: "Copy message",
      copied: "Copied",
      clear: "Clear chat",
      clearConfirm: "Clear entire chat history?",
      charCount: (n, max) => `${n}/${max}`,
      tooltipHint: "Ask the AI Twin",
      chips: [
        "What sets you apart as an AI dev?",
        "Your top projects?",
        "How was your HDI time?"
      ],
      chipsProject: (p) => [
        `How did you build ${p}?`,
        "Which tech stack?",
        "Biggest challenge?"
      ],
      chipsThought: [
        "Quick summary?",
        "Why this topic?",
        "Related projects?"
      ]
    },
    ar: {
      title: "اسأل يوسف",
      subtitle: "التوأم الذكي · معرفة يوسف",
      greeting: "مرحباً! أنا التوأم الذكي ليوسف — مُدرَّب على معرفته. اسألني عن مهاراته أو مشاريعه أو خبراته.",
      greetingProject: (p) => `مرحباً! أنت الآن في صفحة مشروع ${p}. هل تريد معرفة كيف تم بناؤه، ما هي التقنيات المستخدمة، أو أكبر تحدٍّ واجهه؟`,
      greetingThought: "مرحباً! أنت تقرأ إحدى مقالات يوسف. هل تريد ملخصاً، الخلفية، أو مشاريع ذات صلة؟",
      placeholder: "اكتب رسالة…",
      thinking: "يفكّر",
      fallbackNetwork: "الاتصال بخادم الذكاء الاصطناعي متعثّر حالياً. للأمر العاجل: تواصل مع يوسف مباشرة عبر kontakt@yusefbach.de.",
      fallbackRate: "أمهلني لحظة — كثرة أسئلة في وقت واحد. حاول بعد دقيقة.",
      fallbackServer: "خلل مؤقت في الخادم. تم إعلام يوسف. في الأثناء: دراسات حالة المشاريع تستحق القراءة.",
      fabAria: "افتح التوأم الذكي",
      closeAria: "إغلاق",
      infoAria: "ما هذا؟",
      infoTitle: "ما هو التوأم الذكي؟",
      infoBody: "أنا نظام RAG يعمل على قاعدة معرفة يوسف الشخصية (`yusef_brain.md`). يُرسَل سؤالك إلى نقطة نهاية Serverless (Vercel + Google Gemini) لتُركّب الإجابة من ملاحظات يوسف. السجل يبقى **محلياً في متصفحك** (30 يوماً، بحد أقصى 50 رسالة) — لا شيء يُرسَل إلى يوسف. للتفاصيل الكاملة، راجع [إشعار الخصوصية](/datenschutz.html).",
      infoClose: "فهمت",
      copyAria: "نسخ الرسالة",
      copied: "تم النسخ",
      clear: "مسح السجل",
      clearConfirm: "هل تريد مسح السجل بالكامل؟",
      charCount: (n, max) => `${n}/${max}`,
      tooltipHint: "اسأل التوأم الذكي",
      chips: [
        "ما الذي يميّزك كمطوّر ذكاء اصطناعي؟",
        "أهم مشاريعك؟",
        "كيف كانت فترتك في HDI؟"
      ],
      chipsProject: (p) => [
        `كيف بنيت ${p}؟`,
        "ما هي التقنيات؟",
        "أكبر تحدٍّ؟"
      ],
      chipsThought: [
        "ملخّص سريع؟",
        "لماذا هذا الموضوع؟",
        "مشاريع ذات صلة؟"
      ]
    }
  };

  const t = (): BotStrings => STRINGS[currentLang] ?? STRINGS.de;

  // ── Reduced-Motion ──────────────────────────────────────────────────────
  const prefersReducedMotion = (): boolean =>
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  // ── localStorage-Wrapper mit try/catch ──────────────────────────────────
  type ChatHistoryEntry = { role: "user" | "bot"; text: string; ts: number; lang: string };
  type ChatHistory     = { version: 1; updatedAt: number; entries: ChatHistoryEntry[] };
  const memHistory: ChatHistory = { version: 1, updatedAt: Date.now(), entries: [] };

  const storage = {
    read(): ChatHistory {
      try {
        const raw = localStorage.getItem(HISTORY_KEY);
        if (!raw) return memHistory;
        const parsed = JSON.parse(raw) as ChatHistory;
        if (parsed.version !== 1 || !Array.isArray(parsed.entries)) return memHistory;
        // 30-Tage-Cleanup
        const cutoff = Date.now() - HISTORY_TTL_MS;
        parsed.entries = parsed.entries.filter((e) => e.ts >= cutoff).slice(-MAX_HISTORY);
        return parsed;
      } catch {
        return memHistory;
      }
    },
    write(h: ChatHistory): void {
      h.updatedAt = Date.now();
      h.entries = h.entries.slice(-MAX_HISTORY);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
      } catch {
        memHistory.entries = h.entries;
        memHistory.updatedAt = h.updatedAt;
      }
    },
    clear(): void {
      try { localStorage.removeItem(HISTORY_KEY); } catch { /* noop */ }
      memHistory.entries = [];
    },
    isFirstVisit(): boolean {
      try {
        if (localStorage.getItem(FIRST_VISIT_KEY)) return false;
        return true;
      } catch { return false; }
    },
    markVisited(): void {
      try { localStorage.setItem(FIRST_VISIT_KEY, String(Date.now())); } catch { /* noop */ }
    }
  };

  // ── Context-Detection (Path → Greeting + Chips) ─────────────────────────
  type PageContext = { kind: "home" | "project" | "thought" | "other"; name?: string };

  const getPageContext = (): PageContext => {
    const p = window.location.pathname.toLowerCase();
    // /projects/<slug>.html   oder   /en/projects/<slug>.html   oder   /ar/projects/…
    const projectMatch = p.match(/\/projects\/([a-z0-9-]+?)\.html$/);
    if (projectMatch && projectMatch[1] !== "archive" && !projectMatch[1].startsWith("_")) {
      const slugToName: Record<string, string> = {
        "studynexus":         "StudyNexus",
        "community-software": "Community Software",
        "html-cv":            "HTML CV",
        "phishing-defender":  "Phishing Defender",
        "portfolio-meta":     "Portfolio Meta"
      };
      return { kind: "project", name: slugToName[projectMatch[1]] ?? projectMatch[1] };
    }
    // /thoughts/<slug>.html
    const thoughtMatch = p.match(/\/thoughts\/([a-z0-9-]+?)\.html$/);
    if (thoughtMatch && thoughtMatch[1] !== "index" && !thoughtMatch[1].startsWith("_")) {
      return { kind: "thought" };
    }
    // Home: /, /index.html, /en/, /en/index.html, /ar/, /ar/index.html
    if (p === "/" || /\/(en|ar)?\/?(index\.html)?$/.test(p) || p === "/index.html") {
      return { kind: "home" };
    }
    return { kind: "other" };
  };

  // ── HTML einfügen ───────────────────────────────────────────────────────
  if (!document.getElementById("rag-bot-wrapper")) {
    const isAr = currentLang === "ar";
    const dirAttr = isAr ? ' dir="rtl"' : "";
    const backdropHTML = `<div id="rag-backdrop" aria-hidden="true"></div>`;
    const panelHTML = `
      <div id="rag-chat-window"
           class="hidden"
           role="dialog"
           aria-modal="true"
           aria-labelledby="rag-title"
           aria-hidden="true"${dirAttr}>
        <div class="sheet-handle" aria-hidden="true"></div>
        <div class="chat-header">
          <div class="header-info">
            <span class="ai-pulse-dot" aria-hidden="true"></span>
            <div class="header-titles">
              <h4 id="rag-title">Ask Yusef</h4>
              <span class="header-sub" id="rag-subtitle">AI Twin · Yusef's brain</span>
            </div>
          </div>
          <div class="header-actions">
            <button id="rag-info-btn" class="chat-icon-btn" type="button" aria-label="Info">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </button>
            <button id="rag-close-btn" class="chat-icon-btn" type="button" aria-label="Close">×</button>
          </div>
        </div>
        <div class="chat-body-wrap">
          <div id="rag-chat-messages" class="chat-body" aria-live="polite" aria-atomic="false"></div>
          <div id="rag-info-sheet" class="info-sheet hidden" role="region" aria-labelledby="rag-info-title" aria-hidden="true">
            <h5 id="rag-info-title"></h5>
            <p id="rag-info-body"></p>
            <button class="info-close" type="button" id="rag-info-close"></button>
          </div>
        </div>
        <div class="chat-footer">
          <div id="rag-chip-row" class="chip-row" role="list"></div>
          <div class="chat-input-row">
            <input type="text"
                   id="rag-chat-input"
                   maxlength="${CHAR_LIMIT}"
                   autocomplete="off"
                   spellcheck="true"
                   aria-label="Message" />
            <button id="rag-send-btn" type="button" disabled aria-label="Send">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="12" y1="19" x2="12" y2="5"/>
                <polyline points="5 12 12 5 19 12"/>
              </svg>
            </button>
          </div>
          <div class="chat-meta-row">
            <span id="rag-char-count">0/${CHAR_LIMIT}</span>
            <button id="rag-clear-btn" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              </svg>
              <span id="rag-clear-label">Clear</span>
            </button>
          </div>
        </div>
      </div>`;
    const fabHTML = `
      <button id="rag-fab-btn" type="button" aria-expanded="false" aria-controls="rag-chat-window">
        <svg class="rag-fab-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="12" y1="3.6" x2="12" y2="6.4"/>
          <circle class="rag-fab-antenna" cx="12" cy="3" r="0.9" fill="currentColor" stroke="none"/>
          <rect x="4.5" y="7" width="15" height="11" rx="4.2"/>
          <circle class="rag-fab-eye" cx="9" cy="12.6" r="1.15" fill="currentColor" stroke="none"/>
          <circle class="rag-fab-eye" cx="15" cy="12.6" r="1.15" fill="currentColor" stroke="none"/>
          <path d="M9 15.6 Q12 17.2 15 15.6" opacity="0.55"/>
        </svg>
        <span id="rag-fab-tooltip" role="tooltip"></span>
      </button>
      <span id="rag-kbd-hint" aria-hidden="true"><kbd>⌘</kbd><kbd>K</kbd></span>`;
    document.body.insertAdjacentHTML(
      "beforeend",
      `${backdropHTML}<div id="rag-bot-wrapper">${panelHTML}${fabHTML}</div>`
    );
  }

  // ── DOM-Refs ────────────────────────────────────────────────────────────
  const fabBtn        = document.getElementById("rag-fab-btn") as HTMLButtonElement | null;
  const chatWindow    = document.getElementById("rag-chat-window") as HTMLDivElement | null;
  const closeBtn      = document.getElementById("rag-close-btn") as HTMLButtonElement | null;
  const infoBtn       = document.getElementById("rag-info-btn") as HTMLButtonElement | null;
  const infoSheet     = document.getElementById("rag-info-sheet") as HTMLDivElement | null;
  const infoTitle     = document.getElementById("rag-info-title") as HTMLHeadingElement | null;
  const infoBody      = document.getElementById("rag-info-body") as HTMLParagraphElement | null;
  const infoClose     = document.getElementById("rag-info-close") as HTMLButtonElement | null;
  const sendBtn       = document.getElementById("rag-send-btn") as HTMLButtonElement | null;
  const inputField    = document.getElementById("rag-chat-input") as HTMLInputElement | null;
  const messagesEl    = document.getElementById("rag-chat-messages") as HTMLDivElement | null;
  const backdrop      = document.getElementById("rag-backdrop") as HTMLDivElement | null;
  const chipRow       = document.getElementById("rag-chip-row") as HTMLDivElement | null;
  const charCount     = document.getElementById("rag-char-count") as HTMLSpanElement | null;
  const clearBtn      = document.getElementById("rag-clear-btn") as HTMLButtonElement | null;
  const clearLabel    = document.getElementById("rag-clear-label") as HTMLSpanElement | null;
  const subtitleEl    = document.getElementById("rag-subtitle") as HTMLSpanElement | null;
  const titleEl       = document.getElementById("rag-title") as HTMLHeadingElement | null;
  const fabTooltip    = document.getElementById("rag-fab-tooltip") as HTMLSpanElement | null;
  const kbdHint       = document.getElementById("rag-kbd-hint") as HTMLSpanElement | null;
  const sheetHandle   = chatWindow?.querySelector<HTMLDivElement>(".sheet-handle") ?? null;

  if (!fabBtn || !chatWindow || !inputField || !messagesEl) return;

  // ── i18n-Apply ──────────────────────────────────────────────────────────
  const applyI18nStatic = () => {
    const s = t();
    if (titleEl)    titleEl.textContent = s.title;
    if (subtitleEl) subtitleEl.textContent = s.subtitle;
    inputField.placeholder = s.placeholder;
    fabBtn.setAttribute("aria-label", s.fabAria);
    closeBtn?.setAttribute("aria-label", s.closeAria);
    infoBtn?.setAttribute("aria-label", s.infoAria);
    if (infoTitle) infoTitle.textContent = s.infoTitle;
    if (infoBody)  renderSafeMarkdown(infoBody, s.infoBody);
    if (infoClose) infoClose.textContent = s.infoClose;
    if (clearLabel) clearLabel.textContent = s.clear;
    clearBtn?.setAttribute("aria-label", s.clear);
    if (fabTooltip) fabTooltip.textContent = s.tooltipHint;
    updateCharCount();
    // RTL an dir-Attribut spiegeln (script.ts feuert nach Sprachwechsel)
    if (currentLang === "ar") chatWindow.setAttribute("dir", "rtl");
    else                       chatWindow.removeAttribute("dir");
  };

  // ── Message-Rendering ───────────────────────────────────────────────────
  let messageIdCounter = 0;
  const nextMsgId = () => `msg-${Date.now()}-${++messageIdCounter}`;

  type AppendOptions = { skipStore?: boolean; typewriter?: boolean; timestamp?: number; withCopy?: boolean };

  const appendMessage = (
    sender: "user" | "bot",
    text: string,
    opts: AppendOptions = {}
  ): string => {
    const id = nextMsgId();
    const msg = document.createElement("div");
    msg.id = id;
    msg.className = `msg ${sender}-msg`;
    const ts = opts.timestamp ?? Date.now();

    if (opts.typewriter && sender === "bot" && !prefersReducedMotion()) {
      typewriterRender(msg, text);
    } else {
      renderSafeMarkdown(msg, text);
    }

    // Timestamp-Chip
    const timeEl = document.createElement("span");
    timeEl.className = "msg-time";
    timeEl.textContent = formatTime(ts);
    msg.appendChild(timeEl);

    // Copy-Button auf Bot-Messages
    if (sender === "bot" && (opts.withCopy ?? true)) {
      const copyBtn = document.createElement("button");
      copyBtn.className = "msg-copy";
      copyBtn.type = "button";
      copyBtn.setAttribute("aria-label", t().copyAria);
      copyBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
        + '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>'
        + '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'
        + "</svg>";
      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(text);
          copyBtn.classList.add("copied");
          const original = copyBtn.getAttribute("aria-label");
          copyBtn.setAttribute("aria-label", t().copied);
          setTimeout(() => {
            copyBtn.classList.remove("copied");
            if (original) copyBtn.setAttribute("aria-label", original);
          }, 1500);
        } catch { /* Clipboard denied — silent */ }
      });
      msg.appendChild(copyBtn);
    }

    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    if (!opts.skipStore) {
      const h = storage.read();
      h.entries.push({ role: sender, text, ts, lang: currentLang });
      storage.write(h);
    }
    return id;
  };

  const removeMessage = (id: string) => document.getElementById(id)?.remove();

  // ── XSS-safe Markdown-Rendering (Bold, Bullets, Code-Blocks, Inline-Code) ──
  function renderSafeMarkdown(container: HTMLElement, text: string): void {
    // Reset
    while (container.firstChild) container.removeChild(container.firstChild);

    // Code-Blocks (```lang?\n…\n```) zuerst extrahieren
    const segments = text.split(/(```[\s\S]*?```)/g);
    segments.forEach((seg) => {
      if (seg.startsWith("```") && seg.endsWith("```") && seg.length > 6) {
        const inner = seg.slice(3, -3).replace(/^[a-zA-Z0-9]*\n/, "").replace(/\n$/, "");
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        code.textContent = inner;
        pre.appendChild(code);
        container.appendChild(pre);
      } else {
        renderInline(container, seg);
      }
    });
  }

  function renderInline(container: HTMLElement, text: string): void {
    const lines = text.split("\n");
    lines.forEach((line, i) => {
      if (i > 0) container.appendChild(document.createElement("br"));
      // Inline: **bold**, [text](url), `code`, oder * (Bullet)
      const parts = line.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`|\*)/g);
      parts.forEach((p) => {
        if (!p) return;
        if (p.startsWith("**") && p.endsWith("**")) {
          const strong = document.createElement("strong");
          strong.textContent = p.slice(2, -2);
          container.appendChild(strong);
        } else if (p.startsWith("[") && p.includes("](")) {
          // [text](url) — nur sichere URLs (relativ oder https)
          const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
          if (m) {
            const [, linkText, rawUrl] = m;
            const safe = /^https:\/\//i.test(rawUrl) || /^\//.test(rawUrl) || /^\.\.?\//.test(rawUrl);
            if (safe) {
              const a = document.createElement("a");
              a.href = rawUrl;
              a.textContent = linkText;
              if (/^https:\/\//i.test(rawUrl)) {
                a.target = "_blank";
                a.rel = "noopener noreferrer";
              }
              container.appendChild(a);
            } else {
              container.appendChild(document.createTextNode(linkText));
            }
          } else {
            container.appendChild(document.createTextNode(p));
          }
        } else if (p.startsWith("`") && p.endsWith("`") && p.length > 2) {
          const codeEl = document.createElement("code");
          codeEl.textContent = p.slice(1, -1);
          container.appendChild(codeEl);
        } else if (p === "*") {
          container.appendChild(document.createTextNode("• "));
        } else {
          container.appendChild(document.createTextNode(p));
        }
      });
    });
  }

  // ── Typewriter-Reveal (cap 800ms, min 8ms/char) ─────────────────────────
  function typewriterRender(container: HTMLElement, text: string): void {
    const perChar = Math.max(
      TYPEWRITER_MIN_MS_PER_CHAR,
      Math.floor(TYPEWRITER_TOTAL_MS / Math.max(1, text.length))
    );
    // Wenn zu lang → sofort volle Rendering
    if (perChar * text.length > TYPEWRITER_TOTAL_MS * 1.2) {
      renderSafeMarkdown(container, text);
      return;
    }
    let i = 0;
    const tick = () => {
      const shown = text.slice(0, i);
      renderSafeMarkdown(container, shown + (i < text.length ? "▍" : ""));
      messagesEl!.scrollTop = messagesEl!.scrollHeight;
      if (i < text.length) {
        i += Math.max(1, Math.ceil(text.length / (TYPEWRITER_TOTAL_MS / perChar)));
        setTimeout(tick, perChar);
      } else {
        renderSafeMarkdown(container, text);
      }
    };
    tick();
  }

  // ── Typing-Indicator (Drei-Dots) ────────────────────────────────────────
  let typingEl: HTMLDivElement | null = null;
  const showTyping = () => {
    if (typingEl) return;
    typingEl = document.createElement("div");
    typingEl.className = "typing";
    typingEl.setAttribute("aria-label", t().thinking);
    typingEl.innerHTML = "<span></span><span></span><span></span>";
    messagesEl.appendChild(typingEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };
  const hideTyping = () => { typingEl?.remove(); typingEl = null; };

  // ── Format-Helpers ──────────────────────────────────────────────────────
  function formatTime(ts: number): string {
    const d = new Date(ts);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  // ── Char-Counter + Send-Enable ──────────────────────────────────────────
  const updateCharCount = () => {
    const n = inputField.value.length;
    if (charCount) {
      charCount.textContent = t().charCount(n, CHAR_LIMIT);
      charCount.classList.toggle("warn", n >= CHAR_WARN && n < CHAR_LIMIT);
      charCount.classList.toggle("over", n >= CHAR_LIMIT);
    }
    if (sendBtn) sendBtn.disabled = n === 0 || n > CHAR_LIMIT;
  };

  // ── Prompt-Chips (context-aware) ────────────────────────────────────────
  const renderChips = () => {
    if (!chipRow) return;
    chipRow.innerHTML = "";
    const ctx = getPageContext();
    const s = t();
    let chips: string[] = s.chips;
    if (ctx.kind === "project" && ctx.name) chips = s.chipsProject(ctx.name);
    else if (ctx.kind === "thought")        chips = s.chipsThought;

    chips.forEach((label) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.setAttribute("role", "listitem");
      chip.textContent = label;
      chip.addEventListener("click", () => {
        inputField.value = label;
        updateCharCount();
        handleSend();
      });
      chipRow.appendChild(chip);
    });
    chipRow.style.display = chips.length && messagesEl.children.length <= 1 ? "flex" : "none";
  };

  const hideChipsAfterInteraction = () => {
    if (chipRow) chipRow.style.display = "none";
  };

  // ── Verlauf laden + Greeting ────────────────────────────────────────────
  const initMessagesArea = () => {
    messagesEl.innerHTML = "";
    const h = storage.read();
    if (h.entries.length === 0) {
      const ctx = getPageContext();
      const s = t();
      const greeting = ctx.kind === "project" && ctx.name
        ? s.greetingProject(ctx.name)
        : ctx.kind === "thought" ? s.greetingThought
        : s.greeting;
      appendMessage("bot", greeting, { skipStore: true, withCopy: false });
    } else {
      h.entries.forEach((e) => {
        appendMessage(e.role, e.text, {
          skipStore: true,
          timestamp: e.ts,
          withCopy: e.role === "bot"
        });
      });
    }
    renderChips();
  };

  // ── Panel öffnen / schließen ────────────────────────────────────────────
  const isMobile = () => window.matchMedia("(max-width: 767.98px)").matches;
  let lastFocusedEl: HTMLElement | null = null;

  const openPanel = () => {
    if (!chatWindow.classList.contains("hidden")) return;
    lastFocusedEl = document.activeElement as HTMLElement | null;
    chatWindow.classList.remove("hidden");
    chatWindow.setAttribute("aria-hidden", "false");
    fabBtn.setAttribute("aria-expanded", "true");
    fabBtn.classList.add("is-open");
    // Attention-Pulse abbrechen falls noch aktiv
    fabBtn.classList.remove("attention");
    // Tooltip verstecken
    fabTooltip?.classList.remove("show");
    storage.markVisited();
    if (isMobile()) {
      document.body.classList.add("bot-open");
      backdrop?.classList.add("visible");
    }
    // Sprache spiegeln
    applyI18nStatic();
    // Content laden falls leer
    if (messagesEl.children.length === 0) initMessagesArea();
    // Focus in Input
    setTimeout(() => inputField.focus({ preventScroll: true }), 40);
  };

  const closePanel = () => {
    if (chatWindow.classList.contains("hidden")) return;
    chatWindow.classList.add("hidden");
    chatWindow.setAttribute("aria-hidden", "true");
    fabBtn.setAttribute("aria-expanded", "false");
    fabBtn.classList.remove("is-open");
    document.body.classList.remove("bot-open");
    backdrop?.classList.remove("visible");
    // Info-Sheet immer mit schließen
    infoSheet?.classList.add("hidden");
    infoSheet?.setAttribute("aria-hidden", "true");
    // Focus zurückgeben
    (lastFocusedEl ?? fabBtn).focus?.({ preventScroll: true });
  };

  const togglePanel = () => {
    if (chatWindow.classList.contains("hidden")) openPanel();
    else closePanel();
  };

  // ── Focus-Trap ──────────────────────────────────────────────────────────
  const focusableSelector =
    'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const trapFocus = (e: KeyboardEvent) => {
    if (chatWindow.classList.contains("hidden")) return;
    if (e.key !== "Tab") return;
    const nodes = Array.from(chatWindow.querySelectorAll<HTMLElement>(focusableSelector))
      .filter((n) => n.offsetParent !== null || n === document.activeElement);
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // ── Send-Logik ──────────────────────────────────────────────────────────
  async function handleSend() {
    const raw = inputField.value.trim();
    if (!raw || raw.length > CHAR_LIMIT) return;

    hideChipsAfterInteraction();
    appendMessage("user", raw);
    inputField.value = "";
    updateCharCount();
    showTyping();

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: raw, lang: currentLang })
      });

      if (response.status === 429) {
        hideTyping();
        appendMessage("bot", t().fallbackRate, { typewriter: true });
        return;
      }
      if (!response.ok) throw new Error(`Backend ${response.status}`);

      const data = await response.json() as { answer: string };
      hideTyping();
      appendMessage("bot", data.answer ?? t().fallbackServer, { typewriter: true });
    } catch (err) {
      console.error("[Bot] Backend error:", err);
      hideTyping();
      appendMessage("bot", t().fallbackNetwork, { typewriter: true });
    }
  }

  // ── Info-Sheet ──────────────────────────────────────────────────────────
  const openInfoSheet = () => {
    infoSheet?.classList.remove("hidden");
    infoSheet?.setAttribute("aria-hidden", "false");
    infoClose?.focus({ preventScroll: true });
  };
  const closeInfoSheet = () => {
    infoSheet?.classList.add("hidden");
    infoSheet?.setAttribute("aria-hidden", "true");
    infoBtn?.focus({ preventScroll: true });
  };

  // ── Verlauf löschen ─────────────────────────────────────────────────────
  const clearHistory = () => {
    if (!window.confirm(t().clearConfirm)) return;
    storage.clear();
    initMessagesArea();
    inputField.focus({ preventScroll: true });
  };

  // ── Drag-to-close (Mobile) ──────────────────────────────────────────────
  const attachDragToClose = () => {
    if (!sheetHandle) return;
    let startY = 0;
    let currentY = 0;
    let startTime = 0;
    let dragging = false;
    let baseTransition = "";

    const onDown = (e: PointerEvent) => {
      if (!isMobile()) return;
      dragging = true;
      startY = e.clientY;
      currentY = e.clientY;
      startTime = performance.now();
      baseTransition = chatWindow.style.transition;
      chatWindow.style.transition = "none";
      sheetHandle.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      currentY = e.clientY;
      const dy = Math.max(0, currentY - startY);
      chatWindow.style.transform = `translateY(${dy}px)`;
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      const dy = Math.max(0, currentY - startY);
      const dt = Math.max(1, performance.now() - startTime);
      const v = dy / dt;
      chatWindow.style.transition = baseTransition;
      chatWindow.style.transform = "";
      try { sheetHandle.releasePointerCapture(e.pointerId); } catch { /* noop */ }
      if (dy > DRAG_CLOSE_THRESHOLD || v > DRAG_VELOCITY_THRESHOLD) closePanel();
    };
    sheetHandle.addEventListener("pointerdown", onDown);
    sheetHandle.addEventListener("pointermove", onMove);
    sheetHandle.addEventListener("pointerup", onUp);
    sheetHandle.addEventListener("pointercancel", onUp);
  };

  // ── Backdrop-Click auf Mobile → schließen ───────────────────────────────
  backdrop?.addEventListener("click", closePanel);

  // ── Event-Bindings ──────────────────────────────────────────────────────
  fabBtn.addEventListener("click", togglePanel);
  closeBtn?.addEventListener("click", closePanel);
  infoBtn?.addEventListener("click", openInfoSheet);
  infoClose?.addEventListener("click", closeInfoSheet);
  sendBtn?.addEventListener("click", handleSend);
  clearBtn?.addEventListener("click", clearHistory);

  inputField.addEventListener("input", updateCharCount);
  inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (chatWindow.classList.contains("hidden")) {
      // Cmd/Ctrl + K → öffnen (Desktop, pointer fine)
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const cmd = isMac ? e.metaKey : e.ctrlKey;
      if (cmd && e.key.toLowerCase() === "k") {
        const finePointer = window.matchMedia("(pointer: fine)").matches;
        if (!finePointer) return;
        // Nicht wenn Focus in einem Input/Textarea außerhalb des Bots
        const target = e.target as HTMLElement | null;
        const inField = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
        if (inField && !chatWindow.contains(target)) return;
        e.preventDefault();
        openPanel();
      }
      return;
    }
    // Panel offen: Esc → schließen, Tab → Trap
    if (e.key === "Escape") {
      if (!infoSheet?.classList.contains("hidden")) closeInfoSheet();
      else closePanel();
    }
    trapFocus(e);
  });

  attachDragToClose();

  // ── Sprachwechsel-Reaktion ──────────────────────────────────────────────
  window.addEventListener("languagechange", () => {
    currentLang = (window.__PAGE_LANG__ ?? "de") as "de" | "en" | "ar";
    applyI18nStatic();
    // Nur den ersten Bot-Bubble (Greeting) nachziehen, wenn Verlauf leer
    const h = storage.read();
    if (h.entries.length === 0) initMessagesArea();
    renderChips();
  });

  // ── Erst-Besuch-Effekte ─────────────────────────────────────────────────
  const runFirstVisitEffects = () => {
    if (!storage.isFirstVisit()) return;
    if (prefersReducedMotion()) return;
    // Attention-Pulse
    setTimeout(() => fabBtn.classList.add("attention"), 1200);
    setTimeout(() => fabBtn.classList.remove("attention"), 1200 + 1600 * 3);
    // Tooltip
    setTimeout(() => fabTooltip?.classList.add("show"), 1800);
    setTimeout(() => fabTooltip?.classList.remove("show"), 6800);
  };

  const runKbdHintFade = () => {
    setTimeout(() => kbdHint?.classList.add("faded"), 5000);
  };

  // ── Scroll-Auto-Hide ─────────────────────────────────────────────────────
  // Beim Scrollen nach unten (nach den ersten 200px): FAB dimmt.
  // Beim Scrollen nach oben, Scroll-Stop nach 1.4s oder Hover: FAB kommt zurück.
  // Panel offen → nie dimmen. Reduced-Motion → dezenter, keine Transform.
  //
  // WICHTIG: Die Dimm-Klasse sitzt auf #rag-fab-btn, NICHT auf #rag-bot-wrapper!
  // Ein transform auf dem Wrapper würde einen neuen Containing-Block erzeugen
  // und die "position:fixed"-Vollbild-Positionierung des Mobile-Sheets
  // (#rag-chat-window, Geschwister im selben Wrapper) relativ zum Wrapper
  // statt zum Viewport berechnen (CSS-Spec-Verhalten) — das Panel würde dann
  // in der Ecke neben dem FAB kleben statt den Screen zu füllen.
  const attachScrollAutoHide = () => {
    let lastY = window.scrollY;
    let stopTimer: number | null = null;

    const setDimmed = (dim: boolean) => {
      if (dim) fabBtn.classList.add("rag-dimmed");
      else     fabBtn.classList.remove("rag-dimmed");
    };

    const onScroll = () => {
      // Panel offen → nie dimmen
      if (!chatWindow.classList.contains("hidden")) {
        setDimmed(false);
        lastY = window.scrollY;
        return;
      }
      const y  = window.scrollY;
      const dy = y - lastY;
      if (Math.abs(dy) < 6) return;
      if (dy > 0 && y > 200) setDimmed(true);
      else if (dy < 0)       setDimmed(false);
      lastY = y;
      // Scroll-Stop → fade-in nach 1.4s
      if (stopTimer) clearTimeout(stopTimer);
      stopTimer = window.setTimeout(() => setDimmed(false), 1400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  };

  // ── Init ────────────────────────────────────────────────────────────────
  applyI18nStatic();
  updateCharCount();
  runFirstVisitEffects();
  runKbdHintFade();
  attachScrollAutoHide();
});
