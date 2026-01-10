const CACHE_NAME = "app-cache-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./actividad.html",
  "./control.html",
  "./lista.html",
  "./menu.html",
  "./app.css",
  "./components.css",
  "./main.js",
  "./datos.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});