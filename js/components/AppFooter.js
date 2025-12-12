class AppFooter extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const basePath = this.getAttribute("base-path") || ".";
    const year = new Date().getFullYear();

    this.innerHTML = `
    <footer>
      <div class="container">
        <div class="footer-grid">
          <div class="footer-about">
            <a href="#" class="footer-logo">Yusef<span> Bach</span></a>
            <p data-i18n="footer_about">
              Informatik-Student & Nachwuchs-DEV.<br />
              Motiviert, als Werkstudent Theorie in Praxis umzusetzen.
            </p>

            <div class="footer-social">
              <a href="https://github.com/yusef03" class="social-icon-btn" target="_blank" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a href="https://www.linkedin.com/in/yusef-bach/" class="social-icon-btn" target="_blank" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="mailto:kontakt@yusefbach.de" class="social-icon-btn" aria-label="E-Mail">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </a>
            </div>
          </div>

          <div class="footer-links-container">
            <h3 class="footer-heading" data-i18n="footer_nav">Navigation</h3>
            <ul class="footer-links">
              <li><a href="${basePath}/index.html#projects"><i style="margin-right: 5px">&rsaquo;</i> <span data-i18n="nav_projects">Projekte</span></a></li>
              <li><a href="${basePath}/index.html#skills"><i style="margin-right: 5px">&rsaquo;</i> <span data-i18n="nav_stack">Tech Stack</span></a></li>
              <li><a href="${basePath}/index.html#about"><i style="margin-right: 5px">&rsaquo;</i> <span data-i18n="nav_about">Über mich</span></a></li>
            </ul>
          </div>

          <div class="footer-links-container">
            <h3 class="footer-heading" data-i18n="footer_legal">Rechtliches</h3>
            <ul class="footer-links">
              <li><a href="${basePath}/impressum.html"><i style="margin-right: 5px">&rsaquo;</i> <span data-i18n="footer_impressum">Impressum</span></a></li>
              <li><a href="${basePath}/datenschutz.html"><i style="margin-right: 5px">&rsaquo;</i> <span data-i18n="footer_privacy">Datenschutz</span></a></li>
            </ul>
          </div>
        </div>

        <div class="footer-copy">
          <p>&copy; ${year} Yusef Bach</p>
        </div>
      </div>
    </footer>
    `;
  }
}

customElements.define("app-footer", AppFooter);
