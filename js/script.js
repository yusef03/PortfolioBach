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
       CONTACT FORM HANDLING (AJAX)
       -------------------------------------------------------------------------- */
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // 1. Standard-Absenden verhindern (sonst leitet Formspree weiter)
            event.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            const submitBtn = contactForm.querySelector('.submit-btn');

            // 2. Validierung
            if (!name || !email || !message) {
                alert('Bitte füllen Sie alle erforderlichen Felder aus.');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
                return;
            }

            // 3. Button Feedback geben (Lade-Status)
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = "Wird gesendet...";
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.7";

            // 4. Daten im Hintergrund senden (AJAX / Fetch)
            const formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // ERFOLG: Weiterleitung auf DEINE eigene Danke-Seite
                    window.location.href = "thanks.html"; 
                } else {
                    // Fehler von Formspree
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            alert(data["errors"].map(error => error["message"]).join(", "));
                        } else {
                            alert("Oops! Beim Senden ist ein Fehler aufgetreten.");
                        }
                    });
                    // Button zurücksetzen
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = "1";
                }
            })
            .catch(error => {
                // Netzwerkfehler
                alert("Oops! Es gab ein Netzwerkproblem. Bitte versuche es später noch einmal.");
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
            });
        });
    }
});