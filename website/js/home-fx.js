"use strict";
/* ============================================================================
 * home-fx.ts — Bewegungs-Fundament (C1 Redesign · "Calm Cinema")
 *
 * Vanilla TS. Ziel: butterweiches Scrollen + ruhige Progress-Anzeige.
 * Reveals laufen über den bestehenden IntersectionObserver in script.ts.
 * Kein Jank: keine Dauer-Repaints, keine 28 Tilt-Listener mehr.
 * Reduced-motion + Touch → alles nativ.
 * ========================================================================= */
(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    // ── Scroll-Progress-Bar ──────────────────────────────────────────────────
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    const mount = () => { document.body.appendChild(bar); };
    if (document.body)
        mount();
    else
        document.addEventListener('DOMContentLoaded', mount);
    let progressTick = false;
    const updateProgress = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
        progressTick = false;
    };
    window.addEventListener('scroll', () => {
        if (!progressTick) {
            progressTick = true;
            requestAnimationFrame(updateProgress);
        }
    }, { passive: true });
    // ── Butterweiches Wheel-Scrolling (nur Desktop-Maus, ohne reduced-motion) ─
    // Lerp-basiert. Tastatur / Scrollbar / Touch / Anker bleiben nativ.
    if (fine && !reduced) {
        let target = window.scrollY;
        let current = window.scrollY;
        let running = false;
        const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
        const clamp = (v) => Math.max(0, Math.min(v, maxScroll()));
        const loop = () => {
            current += (target - current) * 0.12;
            if (Math.abs(target - current) < 0.4) {
                current = target;
                running = false;
            }
            window.scrollTo(0, current);
            if (running)
                requestAnimationFrame(loop);
        };
        window.addEventListener('wheel', (e) => {
            if (e.ctrlKey)
                return; // Pinch-Zoom nicht stören
            if (document.body.classList.contains('cl-modal-open'))
                return; // Modal offen → nativ
            const el = e.target;
            // Über scrollbaren Overlays (Modal, Bot-Panel) nativ scrollen lassen
            if (el && el.closest('.cl-modal, .bot-panel, .bot-sheet, .ask-panel, [data-native-scroll]'))
                return;
            e.preventDefault();
            target = clamp(target + e.deltaY);
            if (!running) {
                running = true;
                requestAnimationFrame(loop);
            }
        }, { passive: false });
        // Bei nativem Scroll (Tastatur, Scrollbar, Anker-Smooth-Scroll) synchronisieren
        window.addEventListener('scroll', () => {
            if (!running) {
                target = window.scrollY;
                current = window.scrollY;
            }
        }, { passive: true });
    }
    updateProgress();
})();
