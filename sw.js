const CACHE_NAME = "mirkuk-news-pwa-v1";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/mirkuk-toi-theme.css",
  "./js/mirkuk-live-engine.js",
  "./js/mirkuk-beast-brain.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const reqUrl = new URL(event.request.url);

  // Only cache same-origin app shell assets; let external news feeds stay fresh
  if (reqUrl.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        const networkFetch = fetch(event.request).then(resp => {
          if (resp && resp.status === 200) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone)).catch(() => {});
          }
          return resp;
        }).catch(() => cached);
        return cached || networkFetch;
      })
    );
  }
});
