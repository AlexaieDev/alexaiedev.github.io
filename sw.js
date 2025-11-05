// Service Worker para Portfolio de Alex Henríquez
// Version 1.0.0

const CACHE_NAME = 'alexh-portfolio-v1.0.0';
const RUNTIME_CACHE = 'alexh-runtime-v1.0.0';

// Archivos críticos para cachear en la instalación
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/favicon.svg',
  '/manifest.json'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Installing Service Worker...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Precaching critical assets');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  console.log('[SW] Activating Service Worker...');

  // Limpiar cachés antiguos
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
            })
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Estrategia de fetch: Network First para HTML, Cache First para assets estáticos
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo cachear requests del mismo origen
  if (url.origin !== location.origin) {
    return;
  }

  // No cachear el PDF del CV
  if (url.pathname.endsWith('.pdf')) {
    return;
  }

  // Estrategia Network First para HTML
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Guardar la respuesta en caché
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE)
            .then(cache => cache.put(request, responseClone));
          return response;
        })
        .catch(() => {
          // Si falla la red, buscar en caché
          return caches.match(request)
            .then(response => {
              return response || caches.match('/index.html');
            });
        })
    );
    return;
  }

  // Estrategia Cache First para CSS, JS, imágenes
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request)
            .then(response => {
              // Solo cachear respuestas exitosas
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              const responseClone = response.clone();
              caches.open(RUNTIME_CACHE)
                .then(cache => cache.put(request, responseClone));

              return response;
            });
        })
    );
    return;
  }

  // Para todo lo demás, Network First
  event.respondWith(
    fetch(request)
      .catch(() => caches.match(request))
  );
});

// Manejo de mensajes desde el cliente
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
});

// Sincronización en segundo plano (para futuras funcionalidades)
self.addEventListener('sync', event => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'sync-analytics') {
    event.waitUntil(
      // Aquí podrías sincronizar analytics o métricas
      Promise.resolve()
    );
  }
});

// Notificaciones push (para futuras funcionalidades)
self.addEventListener('push', event => {
  console.log('[SW] Push notification received');

  const options = {
    body: event.data ? event.data.text() : 'Nueva actualización disponible',
    icon: '/favicon-192x192.png',
    badge: '/favicon-192x192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Portfolio Alex Henríquez', options)
  );
});

// Click en notificación
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked');
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});

console.log('[SW] Service Worker loaded successfully');
