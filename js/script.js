/* ==========================================================================
   YUSEF BACH PORTFOLIO - MAIN SCRIPT 
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* --- 1. PROJEKT NAVIGATION (Für Unterseiten wie Meta, Phishing) --- */
  const projectHamburger = document.getElementById("project-hamburger");
  const projectNavLinks = document.getElementById("project-nav-links");

  // Sicherheits-Check:  Menü auf dieser Seite?
  if (projectHamburger && projectNavLinks) {
    projectHamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      projectHamburger.classList.toggle("active");
      projectNavLinks.classList.toggle("active");

      const spans = projectHamburger.querySelectorAll("span");
      spans.forEach((span) => span.classList.toggle("active"));
    });

    const internalLinks = projectNavLinks.querySelectorAll("a");
    internalLinks.forEach((link) => {
      link.addEventListener("click", () => {
        projectHamburger.classList.remove("active");
        projectNavLinks.classList.remove("active");
        projectHamburger
          .querySelectorAll("span")
          .forEach((s) => s.classList.remove("active"));
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href.startsWith("#") && href.length > 1) {
        e.preventDefault();

        const target = document.querySelector(href);
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal, .fade-in-up").forEach((el) => {
    observer.observe(el);
  });

  const header =
    document.querySelector("header") || document.querySelector(".project-nav");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");

        header.style.background = "rgba(5, 5, 5, 0.98)";
        header.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.5)";
      } else {
        header.classList.remove("scrolled");
        // Fallback Reset
        if (header.classList.contains("project-nav")) {
          header.style.background = "rgba(10, 10, 10, 0.85)";
        } else {
          header.style.background = "rgba(10, 10, 10, 0.8)";
        }
        header.style.boxShadow = "none";
      }
    });
  }

  /* --- 5. CONTACT FORM (EmailJS) --- */
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerText;

      submitBtn.innerText = "Sende...";
      submitBtn.disabled = true;

      // EmailJS IDs hier eintragen
      emailjs.sendForm("service_y8c0s0c", "template_k23slsm", this).then(
        () => {
          window.location.href = "thanks.html";
        },
        (error) => {
          alert("Fehler beim Senden.");
          submitBtn.innerText = originalBtnText;
          submitBtn.disabled = false;
        }
      );
    });
  }

  /* --- 6. TYPING EFFECT --- */
  const typingElement = document.querySelector(".typing-text");
  if (typingElement) {
    const words = ["Java Developer", "Tech Enthusiast", "Problem Solver"];
    let wordIndex = 0,
      charIndex = 0,
      isDeleting = false;

    function type() {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 100 : 200;

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeSpeed = 2000;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
      }
      setTimeout(type, typeSpeed);
    }
    type();
  }

  /* --- 7. LANGUAGE SWITCHER (CINEMA EFFECT) --- */
  const langBtn = document.getElementById("lang-switch");

  if (langBtn && typeof translations !== "undefined") {
    // Status laden (Default: DE)
    let currentLang = localStorage.getItem("language") || "de";

    // Core-Funktion: Tauscht DOM-Inhalte
    function applyTranslations(lang) {
      // Text-Inhalte aktualisieren
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const text = translations[lang]?.[key];

        if (text) {
          // HTML-Rendering nur wenn nötig (Sicherheit & Performance)
          el[text.includes("<") ? "innerHTML" : "textContent"] = text;
        }
      });

      // Formular-Platzhalter aktualisieren
      document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (translations[lang]?.[key]) {
          el.placeholder = translations[lang][key];
        }
      });

      // Button UI Update (Icon + Label)
      const label = lang.toUpperCase();
      langBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg> 
            <span style="font-weight:600; font-size: 0.85rem; margin-left: 6px;">${label}</span>`;

      // Meta-Daten setzen
      document.documentElement.lang = lang;
    }

    // Initiale Anwendung (Silent Load)
    applyTranslations(currentLang);

    // Click Handler mit Sequenz-Steuerung
    langBtn.addEventListener("click", () => {
      const nextLang = currentLang === "de" ? "en" : "de";

      // Phase 1: Fade Out & Blur
      document.body.classList.add("lang-switching");

      // Phase 2: Content Swap (im unsichtbaren Zustand)
      setTimeout(() => {
        applyTranslations(nextLang);
        currentLang = nextLang;
        localStorage.setItem("language", currentLang);

        // Phase 3: Fade In (im nächsten Frame)
        requestAnimationFrame(() => {
          document.body.classList.remove("lang-switching");
        });
      }, 400); // Sync mit CSS-Transition-Dauer
    });
  }
});
