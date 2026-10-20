const CACHE = "noor-v3";
const FILES = ["./", "index.html", "quran.js", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable.png", "apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = e.request.url;
  if (u.includes("everyayah.com")) return; // stream recitation directly
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok && (u.startsWith(self.location.origin) || u.includes("fonts.g"))) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match("index.html"))));
});
