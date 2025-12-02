/* ==========================================================================
   YUSEF BACH PORTFOLIO - MAIN SCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* --------------------------------------------------------------------------
       MOBILE NAVIGATION
       -------------------------------------------------------------------------- */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");

      // Hamburger Animation (zu X werden)
      const spans = hamburger.querySelectorAll("span");
      spans.forEach((span) => {
        span.classList.toggle("active");
      });
    });
  }

  /* --------------------------------------------------------------------------
        SCROLLING
       -------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      // Menü schließen, falls mobil geöffnet
      if (navLinks) navLinks.classList.remove("active");

      // Hamburger zurücksetzen
      if (hamburger) {
        const spans = hamburger.querySelectorAll("span");
        spans.forEach((span) => span.classList.remove("active"));
      }

      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);

      if (target) {
        const headerOffset = 80; // Höhe des Headers kompensieren
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  /* --------------------------------------------------------------------------
       SCROLL ANIMATIONS (Reveal on Scroll)
       -------------------------------------------------------------------------- */
  const observerOptions = {
    threshold: 0.1, // Startet, wenn 10% des Elements sichtbar sind
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        // Optional: Beobachtung stoppen, damit es nicht immer wieder animiert
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Alle Elemente mit diesen Klassen beobachten
  document.querySelectorAll(".reveal, .fade-in-up").forEach((el) => {
    observer.observe(el);
  });

  /* --------------------------------------------------------------------------
       STICKY HEADER SHADOW
       -------------------------------------------------------------------------- */
  const header = document.querySelector("header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.5)";
      header.style.padding = "10px 0";
      header.style.background = "rgba(10, 10, 10, 0.95)";
    } else {
      header.style.boxShadow = "none";
      header.style.padding = "15px 0";
      header.style.background = "rgba(10, 10, 10, 0.9)";
    }
  });

  /* --------------------------------------------------------------------------
   CONTACT FORM HANDLING (EmailJS Integration)
   -------------------------------------------------------------------------- */
  const contactForm = document.querySelector(".contact-form"); // Stelle sicher, dass dein Formular diese Klasse hat

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Verhindert das normale Neuladen der Seite

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerText;

      // 1. Visuelles Feedback: Button ändern ("Wird gesendet...")
      submitBtn.innerText = "Wird gesendet...";
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";
      submitBtn.style.cursor = "not-allowed";

      // 2. Deine EmailJS IDs (Automatisch eingetragen)
      const serviceID = "service_y8c0s0c";
      const templateID = "template_k23slsm";

      // 3. Senden an EmailJS
      emailjs.sendForm(serviceID, templateID, this).then(
        () => {
          // ERFOLG: Weiterleitung zur Danke-Seite
          console.log("SUCCESS!");
          window.location.href = "thanks.html";
        },
        (error) => {
          // FEHLER: Nachricht an Nutzer
          console.log("FAILED...", error);
          alert(
            "Hoppla, da ist etwas schiefgelaufen. Bitte versuche es später noch einmal oder schreibe mir direkt per Mail."
          );

          // Button zurücksetzen
          submitBtn.innerText = originalBtnText;
          submitBtn.disabled = false;
          submitBtn.style.opacity = "1";
          submitBtn.style.cursor = "pointer";
        }
      );
    });
  }
});
