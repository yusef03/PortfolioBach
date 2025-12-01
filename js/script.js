/* ==========================================================================
   YUSEF BACH PORTFOLIO - MAIN SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --------------------------------------------------------------------------
       MOBILE NAVIGATION
       -------------------------------------------------------------------------- */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Hamburger Animation (zu X werden)
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => {
                span.classList.toggle('active');
            });
        });
    }

    /* --------------------------------------------------------------------------
        SCROLLING
       -------------------------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            // Menü schließen, falls mobil geöffnet
            if (navLinks) navLinks.classList.remove('active');
            
            // Hamburger zurücksetzen
            if (hamburger) {
                const spans = hamburger.querySelectorAll('span');
                spans.forEach(span => span.classList.remove('active'));
            }

            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerOffset = 80; // Höhe des Headers kompensieren
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* --------------------------------------------------------------------------
       SCROLL ANIMATIONS (Reveal on Scroll)
       -------------------------------------------------------------------------- */
    const observerOptions = {
        threshold: 0.1, // Startet, wenn 10% des Elements sichtbar sind
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Beobachtung stoppen, damit es nicht immer wieder animiert
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Alle Elemente mit diesen Klassen beobachten
    document.querySelectorAll('.reveal, .fade-in-up').forEach(el => {
        observer.observe(el);
    });

    /* --------------------------------------------------------------------------
       STICKY HEADER SHADOW
       -------------------------------------------------------------------------- */
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
            header.style.padding = '10px 0';
            header.style.background = 'rgba(10, 10, 10, 0.95)';
        } else {
            header.style.boxShadow = 'none';
            header.style.padding = '15px 0';
            header.style.background = 'rgba(10, 10, 10, 0.9)';
        }
    });

    /* --------------------------------------------------------------------------
       CONTACT FORM VALIDATION
       -------------------------------------------------------------------------- */
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Einfache Prüfung auf leere Felder
            if (!name || !email || !message) {
                event.preventDefault();
                alert('Bitte füllen Sie alle erforderlichen Felder aus.');
                return false;
            }

            // E-Mail Format Prüfung
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                event.preventDefault();
                alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
                return false;
            }
            
            // Wenn alles okay ist, sendet Formspree das Formular
        });
    }
});