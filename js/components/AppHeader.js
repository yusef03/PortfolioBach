class AppHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Ermitteln, ob wir im Root (index.html) oder tiefer sind
    // Wir steuern das über ein Attribut: <app-header base-path="./"></app-header>
    const basePath = this.getAttribute("base-path") || ".";
    const isRoot = basePath === "."; // Wenn "." sind wir auf der Startseite

    // Link-Logik: Auf Unterseiten müssen wir "index.html" vor die Anker (#) setzen
    const homeLink = isRoot ? "#" : `${basePath}/index.html`;
    const projectLink = isRoot
      ? "#projects"
      : `${basePath}/index.html#projects`;
    const stackLink = isRoot ? "#skills" : `${basePath}/index.html#skills`;
    const aboutLink = isRoot ? "#about" : `${basePath}/index.html#about`;
    const contactLink = isRoot ? "#contact" : `${basePath}/index.html#contact`;

    // Das HTML genau wie vorher, aber mit dynamischen Pfaden
    this.innerHTML = `
      <header>
        <div class="container">
          <nav class="navbar">
            <a href="${homeLink}" class="logo">
              <img
                src="${basePath}/images/ui/logo.png"
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
              <a href="${contactLink}" class="cta-button" data-i18n="nav_contact">Kontakt</a>

              <button
                id="lang-switch"
                class="lang-btn"
                aria-label="Switch Language"
              ></button>
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
    }

    // Language Switch Event weiterleiten an globalen Handler
    if (langBtn) {
      // Icon Initialisierung (damit es nicht leer ist bevor script.js greift)
      const currentLang = localStorage.getItem("language") || "de";
      const label = currentLang === "de" ? "EN" : "DE";
      langBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg> <span>${label}</span>`;

      // Das eigentliche Umschalten macht weiterhin deine script.js / translations.js
      // Wir müssen hier nichts tun, da das Element die ID #lang-switch hat
      // und script.js darauf hört.
    }
  }
}

// Dem Browser das neue Tag beibringen
customElements.define("app-header", AppHeader);
