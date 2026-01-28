const CACHE_NAME = "app-cache-v5";

const FILES_TO_CACHE = [
  "index.html",
  "views/actividad.html",
  "views/control.html",
  "views/lista.html",
  "views/menu.html",
  "manifest.json",

  "css/app.css",
  "css/components.css",

  "js/app.js",
  "js/core/config.js",
  "js/core/date.js",
  "js/core/nutrition.js",
  "js/core/storage.js",
  "js/core/ui.js",

  "js/data/foods.js",
  "js/data/menu.js",
  "js/data/targets.js",
  "js/data/actividad.js",

  "js/pages/menu.page.js",
  "js/pages/lista.page.js",
  "js/pages/actividad.page.js",
  "js/pages/control.page.js",

  "assets/icon-192.png",
  "assets/icon-512.png"
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
