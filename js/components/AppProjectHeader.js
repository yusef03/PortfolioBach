"use strict";

class AppProjectHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Determine the base path for assets/links
    const basePath = this.getAttribute("base-path") || "..";
    
    // Save the innerHTML which contains the specific internal links for this project
    const injectedContent = this.innerHTML;

    // Build the standardized project header structure
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
            <button id="lang-switch" class="lang-btn" aria-label="Switch Language"></button>
            <div class="hamburger" id="project-hamburger">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </nav>
    `;

    this.initInteractions();
  }

  initInteractions() {
    const hamburger = this.querySelector("#project-hamburger");
    const navLinks = this.querySelector("#project-nav-links");
    const langBtn = this.querySelector("#lang-switch");

    // Hamburger Logic (encapsulated so it always works regardless of script.js timing)
    if (hamburger && navLinks) {
      hamburger.addEventListener("click", (e) => {
        e.stopPropagation();
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
        const spans = hamburger.querySelectorAll("span");
        spans.forEach((span) => span.classList.toggle("active"));
      });

      // Clicking a link closes the mobile menu
      const internalLinks = navLinks.querySelectorAll("a");
      internalLinks.forEach((link) => {
        link.addEventListener("click", () => {
          hamburger.classList.remove("active");
          navLinks.classList.remove("active");
          hamburger.querySelectorAll("span").forEach((s) => s.classList.remove("active"));
        });
      });

      // Tap on the dark overlay background (not a child) closes the menu
      navLinks.addEventListener("click", (e) => {
        if (e.target === navLinks) {
          hamburger.classList.remove("active");
          navLinks.classList.remove("active");
          hamburger.querySelectorAll("span").forEach((s) => s.classList.remove("active"));
        }
      });
      
      // Document click outside to close
      document.addEventListener("click", (e) => {
        if (
          navLinks.classList.contains("active") &&
          !navLinks.contains(e.target) &&
          !hamburger.contains(e.target)
        ) {
          hamburger.classList.remove("active");
          navLinks.classList.remove("active");
          hamburger.querySelectorAll("span").forEach((s) => s.classList.remove("active"));
        }
      });
    }

    // Initialize Language Switch Button Icon
    if (langBtn) {
      const currentLang = localStorage.getItem("language") || "de";
      const label = currentLang === "de" ? "EN" : "DE";
      langBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg> <span style="font-weight:600; font-size: 0.85rem; margin-left: 6px;">${label}</span>`;
      // The actual language switching logic remains in script.js which listens to #lang-switch globally
    }
    
    // Header scroll effect logic
    const nav = this.querySelector(".project-nav");
    if (nav) {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          nav.classList.add("scrolled");
          nav.style.background = "rgba(5, 5, 5, 0.98)";
          nav.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.5)";
        } else {
          nav.classList.remove("scrolled");
          nav.style.background = "rgba(10, 10, 10, 0.85)";
          nav.style.boxShadow = "none";
        }
      };
      window.addEventListener("scroll", handleScroll);
      // Run once on load
      handleScroll();
    }
  }
}

// Define the custom element
customElements.define("app-project-header", AppProjectHeader);
