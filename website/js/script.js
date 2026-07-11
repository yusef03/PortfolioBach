"use strict";
/**
 * ============================================================================
 * DATEI: js/script.js
 * PROJEKT: PortfolioBach (Bachelor Thesis Artifact)
 * AUTOR:   03yusef
 * VERSION: 1.5.0 (Final Release - Main Controller)
 *
 * BESCHREIBUNG:
 * Globaler Einstiegspunkt für die Interaktionslogik der Website.
 * Beinhaltet UI-Steuerung (Navigation, Scroll-Effekte), Formular-Handling
 * und die clientseitige Internationalisierung (i18n).
 * ============================================================================
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* Initialisierung der Skripte erst nach vollständigem Laden des DOM-Baums */
document.addEventListener("DOMContentLoaded", () => {
    /* ==========================================================================
       0. SCROLL-RESTORATION — Zurück-Navigation landet wo man war (nicht oben)
       Browser-Restoration auf "manual", Position pro Seite in sessionStorage.
       Wiederherstellung NUR bei Back/Forward + nach dem Render (Karten/i18n).
       ========================================================================== */
    if ("scrollRestoration" in history)
        history.scrollRestoration = "manual";
    const SCROLL_KEY = "yb.scroll." + window.location.pathname;
    let scrollSaveTimer;
    window.addEventListener("scroll", () => {
        window.clearTimeout(scrollSaveTimer);
        scrollSaveTimer = window.setTimeout(() => {
            try {
                sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
            }
            catch ( /**/_a) { /**/ }
        }, 100);
    }, { passive: true });
    const navEntry = performance.getEntriesByType("navigation")[0];
    if ((navEntry === null || navEntry === void 0 ? void 0 : navEntry.type) === "back_forward" && !window.location.hash) {
        const restoreScroll = () => {
            try {
                const y = sessionStorage.getItem(SCROLL_KEY);
                if (y !== null)
                    window.scrollTo(0, parseInt(y, 10));
            }
            catch ( /**/_a) { /**/ }
        };
        // Nach vollem Load + kurzem Tick (dynamische Karten sind dann gerendert)
        window.addEventListener("load", () => window.setTimeout(restoreScroll, 60));
        if (document.readyState === "complete")
            window.setTimeout(restoreScroll, 60);
    }
    /* ==========================================================================
       0b. "ZURÜCK"-LINKS ALS ECHTE BACK-NAVIGATION
       Die Projekt-/Thoughts-Header haben feste <a href="index.html">-Links.
       Das ist technisch eine Vorwärts-Navigation → Scroll-Restoration (oben)
       greift nur bei echtem Browser-Zurück (history "back_forward"). Deshalb:
       Klick auf diese Links löst history.back() aus, WENN wir nachweislich von
       dort kamen (document.referrer = gleiche Origin) — sonst normaler Link
       (Fallback für Direktaufrufe, geteilte Links, neue Tabs).
       ========================================================================== */
    document.querySelectorAll(".back-link, .thought-back-link, .thought-back-link-bottom").forEach((link) => {
        link.addEventListener("click", (e) => {
            try {
                const ref = document.referrer ? new URL(document.referrer) : null;
                if (ref && ref.origin === window.location.origin && window.history.length > 1) {
                    e.preventDefault();
                    window.history.back();
                }
            }
            catch ( /* kaputter Referrer — normaler Link greift */_a) { /* kaputter Referrer — normaler Link greift */ }
        });
    });
    /* ==========================================================================
         1. NAVIGATION CONTROLLER (Mobile / Hamburger Menu)
         Steuert die Interaktion des Menüs auf Projekt-Unterseiten.
         ========================================================================== */
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
        document.addEventListener("click", (e) => {
            if (projectNavLinks.classList.contains("active") &&
                !projectNavLinks.contains(e.target) &&
                !projectHamburger.contains(e.target)) {
                projectHamburger.classList.remove("active");
                projectNavLinks.classList.remove("active");
                projectHamburger
                    .querySelectorAll("span")
                    .forEach((s) => s.classList.remove("active"));
            }
        });
        // Tap on the dark overlay background (not a child) closes the menu
        projectNavLinks.addEventListener("click", (e) => {
            if (e.target === projectNavLinks) {
                projectHamburger.classList.remove("active");
                projectNavLinks.classList.remove("active");
                projectHamburger
                    .querySelectorAll("span")
                    .forEach((s) => s.classList.remove("active"));
            }
        });
    }
    /* ==========================================================================
       2. SMOOTH SCROLLING ENGINE
       Verarbeitet Anker-Links (#) und berechnet den Scroll-Offset dynamisch.
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (href.startsWith("#") && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                    });
                }
            }
        });
    });
    /* ==========================================================================
         3. INTERSECTION OBSERVER (Scroll Animations)
         Überwacht Elemente und triggert CSS-Klassen für Reveal-Effekte beim Scrollen.
         ========================================================================== */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Einmal sichtbar → nicht mehr beobachten (Performance)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    document.querySelectorAll(".reveal, .fade-in-up").forEach((el) => {
        // Reveal-Bug-Fix: Elemente die beim Load bereits im Viewport sind
        // (z.B. nach Anker-Sprung via #about) sofort aktivieren —
        // der Observer löst in diesem Fall nie "isIntersecting" aus.
        const rect = el.getBoundingClientRect();
        const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (alreadyVisible) {
            el.classList.add("active");
        }
        else {
            observer.observe(el);
        }
    });
    /* ==========================================================================
         4. DYNAMIC HEADER UI
         Passt Hintergrund und Schatten des Headers basierend auf Scroll-Position an.
         ========================================================================== */
    const header = document.querySelector("header") || document.querySelector(".project-nav");
    if (header) {
        // Nur Klasse togglen — Hintergrund/Schatten kommen aus CSS (theme-aware Tokens),
        // damit Dark/Light korrekt greifen (kein hartkodierter Inline-Style mehr).
        window.addEventListener("scroll", () => {
            header.classList.toggle("scrolled", window.scrollY > 50);
        });
    }
    /* ==========================================================================
        5. CONTACT FORM HANDLER (EmailJS Integration)
        Asynchrone Formularverarbeitung und Versand.
        ========================================================================== */
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "Sende...";
            submitBtn.disabled = true;
            // EmailJS Service Aufruf
            emailjs.sendForm("service_y8c0s0c", "template_k23slsm", this).then(() => {
                window.location.href = "thanks.html";
            }, (error) => {
                alert("Fehler beim Senden.");
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }
    /* ==========================================================================
         6. HERO TYPEWRITER EFFECT
         Rekursive Funktion für die Text-Animation im Hero-Bereich.
         ========================================================================== */
    const typingElement = document.querySelector(".typing-text");
    if (typingElement) {
        const words = ["Architect", "Builder", "B.Sc. Student"];
        // A11y: Bei "Bewegung reduzieren" keine Endlos-Animation — erstes Wort statisch zeigen.
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) {
            typingElement.textContent = words[0];
        }
        else {
            let wordIndex = 0, charIndex = 0, isDeleting = false;
            function type() {
                const currentWord = words[wordIndex];
                if (isDeleting) {
                    typingElement.textContent = currentWord.substring(0, charIndex - 1);
                    charIndex--;
                }
                else {
                    typingElement.textContent = currentWord.substring(0, charIndex + 1);
                    charIndex++;
                }
                // Geglättete Geschwindigkeiten für ein flüssiges, edles Tippgefühl
                let typeSpeed = isDeleting ? 40 : 75;
                if (!isDeleting && charIndex === currentWord.length) {
                    isDeleting = true;
                    typeSpeed = 1800; // Wort steht ruhig, bevor es gelöscht wird
                }
                else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    typeSpeed = 400; // kurze Pause vor dem nächsten Wort
                }
                setTimeout(type, typeSpeed);
            }
            type();
        }
    }
    /* ==========================================================================
         7. LANGUAGE SWITCHER MODULE (Cinema Effect)
         3-Wege Pill: DE · EN · ع
         ========================================================================== */
    const langPill = document.getElementById("lang-switch");
    if (langPill) {
        // Sprache kommt aus der URL (window.__PAGE_LANG__, gesetzt vom Inline-Snippet),
        // Default DE. Der Umschalter navigiert zwischen /, /en/, /ar/ — kein In-Place-Swap.
        let currentLang = window.__PAGE_LANG__ || "de";
        // lang + dir sofort korrekt setzen (SEO + Screenreader, kein Flash)
        document.documentElement.lang = currentLang;
        if (currentLang === "ar") {
            document.documentElement.setAttribute("dir", "rtl");
        }
        // Pill-Segment visuell aktivieren
        function updatePillUI(lang) {
            langPill.querySelectorAll(".lang-pill-seg").forEach(seg => {
                seg.classList.toggle("active", seg.dataset.lang === lang);
            });
        }
        // Core-Funktion: Tauscht DOM-Inhalte
        function applyTranslations(lang) {
            return __awaiter(this, void 0, void 0, function* () {
                let translationsObj = {};
                try {
                    // Absoluter Pfad — robust in /, /en/, /ar/ und jedem Unterordner
                    const response = yield fetch(`/lang/${lang}.json`);
                    translationsObj = yield response.json();
                }
                catch (e) {
                    console.error("Language file could not be loaded:", e);
                    document.body.classList.add("i18n-ready");
                    return;
                }
                // Text-Inhalte aktualisieren
                document.querySelectorAll("[data-i18n]").forEach((el) => {
                    const key = el.getAttribute("data-i18n");
                    const text = key ? translationsObj[key] : null;
                    if (text) {
                        // HTML-Rendering nur wenn nötig (Sicherheit & Performance)
                        el[text.includes("<") ? "innerHTML" : "textContent"] = text;
                    }
                });
                // Formular-Platzhalter aktualisieren
                document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
                    const key = el.getAttribute("data-i18n-placeholder");
                    if (key && translationsObj[key]) {
                        el.placeholder = translationsObj[key];
                    }
                });
                // Pill UI + RTL + lang-Attribut
                updatePillUI(lang);
                if (lang === "ar") {
                    document.documentElement.setAttribute("dir", "rtl");
                }
                else {
                    document.documentElement.removeAttribute("dir");
                }
                document.documentElement.lang = lang;
                // FOUC-Schutz: Body nach erstem i18n-Load sichtbar machen
                document.body.classList.add("i18n-ready");
            });
        }
        // Initiale Anwendung (Silent Load)
        applyTranslations(currentLang);
        // Ziel-URL der aktuellen Seite in der gewünschten Sprache.
        // Führendes /en/ oder /ar/ entfernen (→ DE-Kanonform), dann für en/ar neu
        // voranstellen. DE = Root.
        function langUrl(lang) {
            let path = window.location.pathname.replace(/^\/(en|ar)(?=\/|$)/, "");
            if (path === "")
                path = "/";
            const hash = window.location.hash;
            if (lang === "de")
                return path + hash;
            if (path === "/")
                return `/${lang}/${hash}`;
            return `/${lang}${path}${hash}`;
        }
        // Click: sanft ausblenden, dann zur Sprachvariante navigieren (echte URL, SEO-sauber).
        langPill.querySelectorAll(".lang-pill-seg").forEach(seg => {
            seg.addEventListener("click", () => {
                const nextLang = seg.dataset.lang || "de";
                if (nextLang === currentLang)
                    return;
                document.body.classList.add("lang-switching");
                const target = langUrl(nextLang);
                setTimeout(() => { window.location.href = target; }, 220);
            });
        });
    }
    /* ==========================================================================
         8. DYNAMIC SEMESTER STAT
         ========================================================================== */
    const semesterStat = document.getElementById("semester-number");
    if (semesterStat) {
        const startDate = new Date('2024-09-01');
        const now = new Date();
        const monthsElapsed = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
        const semester = Math.floor(monthsElapsed / 6) + 1;
        semesterStat.textContent = semester.toString() + ".";
    }
    /* ==========================================================================
         9. SERVICE WORKER REGISTRATION
         ========================================================================== */
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then((registration) => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }).catch((err) => {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
});
