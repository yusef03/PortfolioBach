const CACHE_NAME = 'portfolio-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/components.css',
  '/js/script.js',
  '/js/components.js',
  '/js/project-renderer.js',
  '/js/projects-data.js',
  '/js/status.js',
  '/js/bot.js',
  '/lang/de.json',
  '/lang/en.json'
];

const sw = self as any;

sw.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  sw.skipWaiting();
});

sw.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  sw.clients.claim();
});

sw.addEventListener('fetch', (event: any) => {
  // Wir cachen nur GET Requests
  if (event.request.method !== 'GET') return;
  // Externe APIs ignorieren (z.B. Gemini Bot)
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Stale-While-Revalidate Strategie
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback wenn Offline
      });
      return cachedResponse || fetchPromise;
    })
  );
});
