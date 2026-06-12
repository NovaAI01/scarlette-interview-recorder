const CACHE_NAME = "scarlette-interview-recorder-v4";
const APP_SHELL = [
  "./",
  "./index.html",
  "./src/",
  "./src/index.html",
  "./manifest.webmanifest",
  "./assets/icons/icon.svg",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(cached => cached || fetch(request)
        .then(response => {
          if (!response || response.status !== 200 || response.type === "opaque") {
            return response;
          }

          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, copy);
          });
          return response;
        })
        .catch(() => caches.match("./src/index.html")))
  );
});
