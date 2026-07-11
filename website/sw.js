"use strict";
// Service Worker — BETAPortfolioBach
// v4: Ask-Yusef Bot-Redesign — bot.css hinzugefügt, Cache-Version bumped
// v3: Relaunch — Mehrsprachen-Seiten (/en/, /ar/) im Cache, defensives Caching
//     (Promise.allSettled), eine 404 killt nicht die gesamte Installation.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const CACHE_NAME = 'portfolio-cache-v4';
const ASSETS_TO_CACHE = [
    // Core-Seiten
    '/',
    '/index.html',
    '/roadmap.html',
    '/changelog.html',
    '/thoughts/index.html',
    '/404.html',
    // Core-Seiten — Englisch (/en/) + Arabisch (/ar/)
    '/en/', '/en/index.html', '/en/roadmap.html', '/en/changelog.html', '/en/thoughts/index.html',
    '/ar/', '/ar/index.html', '/ar/roadmap.html', '/ar/changelog.html', '/ar/thoughts/index.html',
    // CSS — Core
    '/css/variables.css',
    '/css/utilities.css',
    '/css/components.css',
    '/css/bot.css',
    '/css/main.css',
    '/css/project-base.css',
    '/css/github-activity.css',
    '/css/pages/roadmap.css',
    '/css/pages/changelog.css',
    '/css/pages/thoughts.css',
    // JS — Web Components
    '/js/components/AppHeader.js',
    '/js/components/AppFooter.js',
    '/js/components/AppProjectHeader.js',
    // JS — Core Logic
    '/js/script.js',
    '/js/status.js',
    '/js/bot.js',
    '/js/lightbox.js',
    // JS — Renderer + Data
    '/js/project-renderer.js',
    '/js/projects-data.js',
    '/js/roadmap-renderer.js',
    '/js/roadmap-data.js',
    '/js/thoughts-renderer.js',
    '/js/thoughts-data.js',
    '/js/github-activity.js',
    // i18n — alle 3 Sprachen
    '/lang/de.json',
    '/lang/en.json',
    '/lang/ar.json',
];
const sw = self;
sw.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => __awaiter(void 0, void 0, void 0, function* () {
        // Defensives Caching: Promise.allSettled statt addAll —
        // eine fehlende Datei (404) bricht die gesamte Installation nicht ab.
        const results = yield Promise.allSettled(ASSETS_TO_CACHE.map((url) => cache.add(url)));
        results.forEach((result, i) => {
            if (result.status === 'rejected') {
                console.warn(`[SW] Cache-Miss (ignoriert): ${ASSETS_TO_CACHE[i]}`);
            }
        });
    })));
    sw.skipWaiting();
});
sw.addEventListener('activate', (event) => {
    event.waitUntil(caches.keys().then((cacheNames) => {
        return Promise.all(cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
            console.log(`[SW] Alter Cache gelöscht: ${name}`);
            return caches.delete(name);
        }));
    }));
    sw.clients.claim();
});
sw.addEventListener('fetch', (event) => {
    // Nur GET-Requests
    if (event.request.method !== 'GET')
        return;
    // Externe APIs ignorieren (Bot-Backend, Supabase, GitHub)
    if (!event.request.url.startsWith(sw.location.origin))
        return;
    if (event.request.url.includes('/api/'))
        return;
    event.respondWith(caches.match(event.request).then((cachedResponse) => {
        // Stale-While-Revalidate: erst Cache ausliefern, im Hintergrund aktualisieren
        const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
            if (networkResponse &&
                networkResponse.status === 200 &&
                networkResponse.type === 'basic') {
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
        })
            .catch(() => {
            // Offline-Fallback: 404-Seite aus Cache zurückgeben
            return caches.match('/404.html');
        });
        return cachedResponse || fetchPromise;
    }));
});
