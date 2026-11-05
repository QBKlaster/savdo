// Savdo daftari — telefon/kompyuterga o'rnatiladigan ilova (PWA) uchun xizmat skripti.
// Sahifa avval internetdan olinadi (har doim eng yangi versiya); internet bo'lmasa — oxirgi saqlangan nusxa ochiladi.
// Ma'lumotlar (Supabase) bu yerda saqlanmaydi va ushlanmaydi.
const CACHE = "savdo-v1";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;     // Supabase, shriftlar — to'g'ridan-to'g'ri
  e.respondWith(fetch(r).then(res => {
    if (res.ok && (r.mode === "navigate" || SHELL.some(s => u.pathname.endsWith(s.replace("./", "/"))))) {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(r.mode === "navigate" ? "./index.html" : r, copy));
    }
    return res;
  }).catch(() => caches.match(r.mode === "navigate" ? "./index.html" : r).then(m => m || caches.match("./"))));
});
