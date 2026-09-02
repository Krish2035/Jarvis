/* =========================================================
   JARVIS MARK VII — SERVICE WORKER (OFFLINE PWA ENGINE)
   ========================================================= */

const CACHE_NAME = 'jarvis-mark-vii-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icon-192.svg',
  '/icon-512.svg'
];

// Install Event: Pre-cache core shell
self.addEventListener('install', (event) => {
  console.log('[JARVIS SW]: Installing Offline Neural Kernel...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[JARVIS SW]: Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clean up outdated caches & claim clients
self.addEventListener('activate', (event) => {
  console.log('[JARVIS SW]: Activating Mark VII Neural Kernel...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[JARVIS SW]: Removing legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Cache-First for assets & fonts, Network-First for API with offline fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle Chrome extension or non-GET requests gracefully
  if (request.method !== 'GET') {
    return;
  }

  // Handle Google Fonts & static CDNs (Cache First)
  if (url.origin.includes('fonts.googleapis.com') || url.origin.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Handle Navigation Requests (HTML document)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache latest HTML version
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => {
          // Fallback to cached index.html when offline
          return caches.match('/') || caches.match('/index.html');
        })
    );
    return;
  }

  // Handle Static App Assets (JS, CSS, SVGs, Images)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache (Stale While Revalidate)
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // If offline and request is an image or icon, return fallback if available
          if (request.destination === 'image') {
            return caches.match('/favicon.svg');
          }
        });
    })
  );
});

// Listen for message events (e.g. skipWaiting)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
