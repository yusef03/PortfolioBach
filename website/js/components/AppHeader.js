"use strict";
class AppHeader extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        // base-path zeigt auf den Repo-Root relativ zur aktuellen Seite
        // (".": Root-Ebene wie index.html / roadmap.html, "..": projects/<x>.html)
        const basePath = this.getAttribute("base-path") || ".";
        // WICHTIG: Anker (#projects etc.) existieren NUR auf der Startseite.
        // onHome ist NUR true, wenn wir auf Root-Ebene (base-path=".") UND auf der
        // Startseite (index.html oder "") sind. Auf Unterseiten wie thoughts/index.html
        // (base-path="..") ist seg zwar "index.html", aber basePath !== "." → onHome=false,
        // damit die Anker korrekt nach ../index.html#… aufgelöst werden.
        const seg = (window.location.pathname.split("/").pop() || "").toLowerCase();
        const onHome = basePath === "." && (seg === "" || seg === "index.html");
        // Auf der Startseite: reine Anker. Sonst: index.html voranstellen.
        const homeLink = onHome ? "#" : `${basePath}/index.html`;
        const projectLink = onHome ? "#projects" : `${basePath}/index.html#projects`;
        const stackLink = onHome ? "#skills" : `${basePath}/index.html#skills`;
        const aboutLink = onHome ? "#about" : `${basePath}/index.html#about`;
        const thoughtsLink = `${basePath}/thoughts/`;
        const contactLink = onHome ? "#contact" : `${basePath}/index.html#contact`;
        // Das HTML genau wie vorher, aber mit dynamischen Pfaden
        this.innerHTML = `
      <header>
        <div class="container">
          <nav class="navbar">
            <a href="${homeLink}" class="logo">
              <img
                src="/images/ui/logo.png"
                alt="Yusef Bach Logo"
                style="height: 40px; margin-right: 10px"
              />
              <span>Yusef Bach</span>
            </a>

            <div class="hamburger" id="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div class="nav-links" id="navLinks">
              <a href="${projectLink}" data-i18n="nav_projects">Projekte</a>
              <a href="${stackLink}" data-i18n="nav_stack">Tech Stack</a>
              <a href="${aboutLink}" data-i18n="nav_about">Über mich</a>
              <a href="${thoughtsLink}" data-i18n="nav_thoughts">Gedanken</a>
              <a href="${contactLink}" class="cta-button" data-i18n="nav_contact">Kontakt</a>

              <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Theme wechseln" title="Hell / Dunkel">
                <svg class="ico-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                <svg class="ico-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              </button>

              <div class="lang-pill" id="lang-switch" role="group" aria-label="Sprache wählen">
                <button class="lang-pill-seg" data-lang="de">DE</button>
                <button class="lang-pill-seg" data-lang="en">EN</button>
                <button class="lang-pill-seg" data-lang="ar">ع</button>
              </div>
            </div>
          </nav>
        </div>
      </header>
    `;
        // --- INTERNE LOGIK (Ersetzt Teile der script.js für dieses Element) ---
        this.initInteractions();
    }
    initInteractions() {
        const hamburger = this.querySelector("#hamburger");
        const navLinks = this.querySelector("#navLinks");
        const langBtn = this.querySelector("#lang-switch");
        // Hamburger Logic (gekapselt)
        if (hamburger && navLinks) {
            hamburger.addEventListener("click", () => {
                navLinks.classList.toggle("active");
                const spans = hamburger.querySelectorAll("span");
                spans.forEach((span) => span.classList.toggle("active"));
            });
            // Klick auf Link schließt Menü (Mobile UX)
            navLinks.querySelectorAll("a").forEach((link) => {
                link.addEventListener("click", () => {
                    navLinks.classList.remove("active");
                    hamburger
                        .querySelectorAll("span")
                        .forEach((span) => span.classList.remove("active"));
                });
            });
            // Klick außerhalb schließt Menü
            document.addEventListener("click", (e) => {
                if (navLinks.classList.contains("active") &&
                    !navLinks.contains(e.target) &&
                    !hamburger.contains(e.target)) {
                    navLinks.classList.remove("active");
                    hamburger.querySelectorAll("span").forEach((s) => s.classList.remove("active"));
                }
            });
        }
        // Pill: aktives Segment sofort visuell setzen (kein Flash bevor script.js greift)
        const pill = this.querySelector("#lang-switch");
        if (pill) {
            const currentLang = window.__PAGE_LANG__ || "de";
            const activeSeg = pill.querySelector(`[data-lang="${currentLang}"]`);
            if (activeSeg)
                activeSeg.classList.add("active");
            // Click-Handling übernimmt script.js
        }
        // Theme-Toggle (Dark/Light) — data-theme auf <html>, persistiert in localStorage.
        // Default ist Dark (kein gespeicherter Wert → dark). Das No-Flash-Inline-Script
        // im <head> setzt data-theme bereits vor dem ersten Paint.
        const themeBtn = this.querySelector("#theme-toggle");
        if (themeBtn) {
            const root = document.documentElement;
            if (!root.getAttribute("data-theme")) {
                const stored = localStorage.getItem("theme");
                root.setAttribute("data-theme", stored === "light" ? "light" : "dark");
            }
            themeBtn.addEventListener("click", () => {
                const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
                root.setAttribute("data-theme", next);
                try {
                    localStorage.setItem("theme", next);
                }
                catch ( /**/_a) { /**/ }
            });
        }
    }
}
// Dem Browser das neue Tag beibringen
customElements.define("app-header", AppHeader);
