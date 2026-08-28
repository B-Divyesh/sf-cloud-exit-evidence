const CACHE = 'cee-shell-v2';
const SHELL = ['/', '/privacy/', '/terms/', '/evidence-ledger.webp', '/evidence-ledger-mobile.webp'];

async function cacheDocument(cache, path) {
  const response = await fetch(path, { cache: 'reload' });
  if (!response.ok) throw new Error(`Could not cache ${path}`);
  await cache.put(path, response.clone());
  const documentUrl = new URL(path, self.location.origin);
  const assets = [...(await response.text()).matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => new URL(match[1], documentUrl))
    .filter((url) => url.origin === self.location.origin && /\.(?:css|js|png|svg|webp)$/i.test(url.pathname))
    .map((url) => url.pathname);
  await Promise.all(assets.map((asset) => cache.add(asset)));
}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then(async (cache) => {
    await cache.addAll(SHELL);
    // A landing-page visit must make the one-click demo usable before the
    // network disappears. Cache its document and its built entry assets now.
    await cacheDocument(cache, '/demo/');
  }));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    return response;
  }).catch(async () => {
    // Preview and some hosts send Vary: Origin for module requests while the
    // service worker's warm-up requests have no Origin header. These are
    // same-origin immutable assets, so match their URL regardless of Vary.
    const cached = await caches.match(event.request, { ignoreVary: true });
    if (cached) return cached;
    if (event.request.mode === 'navigate') {
      const path = new URL(event.request.url).pathname;
      if (path === '/demo' || path === '/demo/') return caches.match('/demo/', { ignoreVary: true });
    }
    return caches.match('/', { ignoreVary: true });
  }));
});
