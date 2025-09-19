const CACHE_NAME = 'ai-photo-editor-v1';
// Add all the files that should be cached for offline use.
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/components/Header.tsx',
  '/components/ImageDisplay.tsx',
  '/components/ImageUploader.tsx',
  '/components/Spinner.tsx',
  '/services/geminiService.ts',
  '/manifest.json',
  '/icon.svg',
  'https://cdn.tailwindcss.com',
];

// Install event: opens a cache and adds the core files to it.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Use addAll with a catch block for better error handling, especially with external resources.
        return cache.addAll(urlsToCache).catch(error => {
            console.error('Failed to cache one or more resources:', error);
        });
      })
  );
});

// Fetch event: serves assets using a cache-first strategy.
self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch from network, then cache it.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200) {
              return response;
            }
             // Do not cache opaque responses (e.g. from no-cors requests to third-party CDNs without proper headers)
            if (response.type === 'opaque') {
                return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// Activate event: cleans up old caches.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
