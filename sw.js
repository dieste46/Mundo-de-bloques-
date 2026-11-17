// Guarda el juego entero al instalarse, así funciona sin conexión desde la primera visita.
// "Red primero": con conexión siempre coge lo último; sin conexión (o si la red no contesta en 3 s) tira de la caché.
// Al añadir un archivo nuevo al juego, ponlo en ASSETS y sube el número de CACHE.
const CACHE = 'bloques-v1';
const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'fonts/press-start-2p.woff2',
  'icon.svg',
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon.png'
];
self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
));
// Solo se borran las cachés viejas de este juego: en GitHub Pages todos los proyectos de la cuenta comparten
// dominio (y por tanto cachés), y no hay que llevarse por delante la de Mini Juegos.
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('bloques-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  const net = fetch(e.request).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return r;
  });
  const lenta = new Promise((_, no) => setTimeout(no, 3000));
  e.respondWith(
    Promise.race([net, lenta]).catch(() =>
      caches.match(e.request, { ignoreSearch: true }).then(r => r || net))
  );
});
