// Service Worker — BETAPortfolioBach
// v4: Ask-Yusef Bot-Redesign — bot.css hinzugefügt, Cache-Version bumped
// v3: Relaunch — Mehrsprachen-Seiten (/en/, /ar/) im Cache, defensives Caching
//     (Promise.allSettled), eine 404 killt nicht die gesamte Installation.

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

const sw = self as any;

sw.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Defensives Caching: Promise.allSettled statt addAll —
      // eine fehlende Datei (404) bricht die gesamte Installation nicht ab.
      const results = await Promise.allSettled(
        ASSETS_TO_CACHE.map((url) => cache.add(url))
      );
      results.forEach((result, i) => {
        if (result.status === 'rejected') {
          console.warn(`[SW] Cache-Miss (ignoriert): ${ASSETS_TO_CACHE[i]}`);
        }
      });
    })
  );
  sw.skipWaiting();
});

sw.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheNames: string[]) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log(`[SW] Alter Cache gelöscht: ${name}`);
            return caches.delete(name);
          })
      );
    })
  );
  sw.clients.claim();
});

sw.addEventListener('fetch', (event: any) => {
  // Nur GET-Requests
  if (event.request.method !== 'GET') return;
  // Externe APIs ignorieren (Bot-Backend, Supabase, GitHub)
  if (!event.request.url.startsWith(sw.location.origin)) return;
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Stale-While-Revalidate: erst Cache ausliefern, im Hintergrund aktualisieren
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline-Fallback: 404-Seite aus Cache zurückgeben
          return caches.match('/404.html') as Promise<Response>;
        });

      return cachedResponse || fetchPromise;
    })
  );
});
