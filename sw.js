const CACHE_NAME = "exora-v1";

const urlsToCache = [
  "/",
  "/login.html",
  "/css/style.css",
  "/css/responsive.css",
  "/js/login.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
