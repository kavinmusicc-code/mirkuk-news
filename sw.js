/* === MIRKUK PWA SW BOUNDARY START === */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
/* === MIRKUK PWA SW BOUNDARY END === */
