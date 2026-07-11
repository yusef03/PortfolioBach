/**
 * AppProjectHeader — Web Component für Projektseiten-Navigation.
 * Quelle für js/components/AppProjectHeader.js (wird via tsc generiert).
 *
 * Zuständig für:
 * - Projektseiten-Navbar (Back-Link, interne Kapitel-Links, Lang-Pill)
 * - Hamburger-Menü (Mobile)
 * - Scroll-Effekt (nur Klasse togglen — keine Inline-Styles → theme-aware)
 * - Lang-Pill: aktives Segment sofort visuell setzen (kein Flash)
 */

class AppProjectHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback(): void {
    const basePath = this.getAttribute("base-path") || "..";
    const injectedContent = this.innerHTML;

    this.innerHTML = `
      <nav class="project-nav sticky-nav">
        <div class="nav-container">
          <a href="${basePath}/index.html" class="back-link">
            <span>←</span> <span data-i18n="nav_portfolio">Portfolio</span>
          </a>

          <div class="nav-content-wrapper" id="project-nav-links">
            ${injectedContent}
          </div>

          <div class="mobile-header-controls">
            <div class="lang-pill" id="lang-switch" role="group" aria-label="Sprache wählen">
              <button class="lang-pill-seg" data-lang="de">DE</button>
              <button class="lang-pill-seg" data-lang="en">EN</button>
              <button class="lang-pill-seg" data-lang="ar">ع</button>
            </div>
            <div class="hamburger" id="project-hamburger">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </nav>
    `;

    this.initInteractions();
  }

  private initInteractions(): void {
    this.initHamburger();
    this.initLangPill();
    this.initScrollEffect();
  }

  private initHamburger(): void {
    const hamburger = this.querySelector<HTMLElement>("#project-hamburger");
    const navLinks = this.querySelector<HTMLElement>("#project-nav-links");
    if (!hamburger || !navLinks) return;

    const closeMenu = (): void => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
      hamburger.querySelectorAll("span").forEach((s) => s.classList.remove("active"));
    };

    hamburger.addEventListener("click", (e: Event) => {
      e.stopPropagation();
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");
      hamburger.querySelectorAll("span").forEach((s) => s.classList.toggle("active"));
    });

    // Kapitel-Link klicken → Menü schließen
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Klick auf den dunklen Overlay-Bereich → Menü schließen
    navLinks.addEventListener("click", (e: Event) => {
      if (e.target === navLinks) closeMenu();
    });

    // Klick außerhalb → Menü schließen
    document.addEventListener("click", (e: Event) => {
      if (
        navLinks.classList.contains("active") &&
        !navLinks.contains(e.target as Node) &&
        !hamburger.contains(e.target as Node)
      ) {
        closeMenu();
      }
    });
  }

  private initLangPill(): void {
    const pill = this.querySelector("#lang-switch");
    if (!pill) return;
    const currentLang = window.__PAGE_LANG__ || "de";
    const activeSeg = pill.querySelector<HTMLElement>(`[data-lang="${currentLang}"]`);
    if (activeSeg) activeSeg.classList.add("active");
    // Click-Handling übernimmt script.js
  }

  private initScrollEffect(): void {
    const nav = this.querySelector<HTMLElement>(".project-nav");
    if (!nav) return;

    // Nur Klasse togglen — Farben kommen aus CSS-Tokens (theme-aware, kein Inline-Style)
    const handleScroll = (): void => {
      if (window.scrollY > 50) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initialzustand setzen
  }
}

customElements.define("app-project-header", AppProjectHeader);
