self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Keep network-first behavior for app shell resources.
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
