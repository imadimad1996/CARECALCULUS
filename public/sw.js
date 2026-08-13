const CACHE_NAME = 'carecalculus-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force new service worker to activate immediately
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of all pages immediately
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);

  // Exclude assets from SW interception entirely
  if (url.pathname.startsWith('/assets/')) {
    return;
  }

  // Network First, fallback to Cache for HTML/Navigation requests
  if (event.request.mode === 'navigate' || url.pathname === '/' || url.pathname === '/index.html') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match('/').then((fallbackResponse) => {
              return fallbackResponse || new Response('<html><body><h2>Offline</h2><p>Please check your internet connection.</p></body></html>', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({'Content-Type': 'text/html'})
              });
            });
          });
        })
    );
    return;
  }
  
  // Cache First, fallback to Network for everything else (manifest, icons)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        return new Response('Network error', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});
