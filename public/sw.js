// Enhanced Service Worker for PWA and Offline Support

const CACHE_NAME = 'portfolio-v4-enhanced';
const STATIC_CACHE = 'portfolio-static-v4';
const DYNAMIC_CACHE = 'portfolio-dynamic-v4';
const IMAGE_CACHE = 'portfolio-images-v4';

// Static assets to cache immediately
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Core CSS and JS will be cached dynamically
];

// Cache strategies
const cacheStrategies = {
  // Cache first for static assets
  static: (request) => {
    return caches.match(request).then(response => {
      return response || fetch(request).then(fetchResponse => {
        if (fetchResponse.status === 200) {
          return caches.open(STATIC_CACHE).then(cache => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        }
        return fetchResponse;
      });
    });
  },

  // Network first for dynamic content
  networkFirst: (request) => {
    return fetch(request).then(fetchResponse => {
      if (fetchResponse.status === 200) {
        return caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(request, fetchResponse.clone());
          return fetchResponse;
        });
      }
      return fetchResponse;
    }).catch(() => {
      return caches.match(request);
    });
  },

  // Cache first with stale-while-revalidate for images
  staleWhileRevalidate: (request) => {
    return caches.match(request).then(cachedResponse => {
      const fetchPromise = fetch(request).then(fetchResponse => {
        if (fetchResponse.status === 200) {
          return caches.open(IMAGE_CACHE).then(cache => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        }
        return fetchResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    });
  }
};

// Enhanced install event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('Service Worker: Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Enhanced fetch event with multiple strategies
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // Determine cache strategy based on request type
  let strategy;
  
  if (event.request.destination === 'image') {
    strategy = cacheStrategies.staleWhileRevalidate;
  } else if (url.pathname.includes('/api/')) {
    strategy = cacheStrategies.networkFirst;
  } else if (url.origin === location.origin) {
    strategy = cacheStrategies.static;
  } else {
    strategy = cacheStrategies.networkFirst;
  }

  event.respondWith(strategy(event.request));
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks
      console.log('Service Worker: Background sync triggered')
    );
  }
});

// Push notification handler
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Message handler for communication with main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
