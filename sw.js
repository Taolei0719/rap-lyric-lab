const CACHE_NAME = "rap-lyric-lab-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./src/app.js",
  "./src/engine.js",
  "./src/styles.css",
  "./assets/covers/asen-life-after-small-town.jpg",
  "./assets/covers/asen-nesa.jpg",
  "./assets/covers/asen-small-town-kid.jpg",
  "./assets/covers/asen-small-town-legend.jpg",
  "./assets/covers/asen-wake-after-rain.jpg",
  "./assets/covers/sasi-cheng-daoliang.jpg",
  "./assets/covers/sasi-nasalik.jpg",
  "./assets/covers/sasi-super-sun.jpg",
  "./assets/covers/sasi-that-boy.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
