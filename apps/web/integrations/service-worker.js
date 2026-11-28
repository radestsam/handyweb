/*
 * The HandyWeb service worker. The build (integrations/service-worker.mjs)
 * writes it to dist/sw.js and fills in VERSION and PRECACHE.
 *
 * The cache holds only static files of the site: HTML pages, CSS, JavaScript,
 * fonts, icons, and the search index. Tool input and output never go into a
 * request, so they can never go into the cache. A request with a query string
 * is never cached, because a query string can hold user data.
 */
const VERSION = "__VERSION__";
const CACHE = `handyweb-${VERSION}`;
const PRECACHE = __PRECACHE__;

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(CACHE)
            .then((cache) => cache.addAll(PRECACHE))
            .then(() => self.skipWaiting()),
    );
});

// Remove the caches of earlier builds.
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => key.startsWith("handyweb-") && key !== CACHE)
                        .map((key) => caches.delete(key)),
                ),
            )
            .then(() => self.clients.claim()),
    );
});

function cacheable(response) {
    return response.ok && response.type === "basic";
}

async function put(request, response) {
    const cache = await caches.open(CACHE);
    await cache.put(request, response);
}

// Hashed files under /_astro/ never change, so the cached copy is always right.
async function cacheFirst(event) {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    const response = await fetch(event.request);
    if (cacheable(response)) event.waitUntil(put(event.request, response.clone()));
    return response;
}

// Pages and other files: the network first, so a new build shows at once.
// Without a network, the cached copy, and for a page that was never opened,
// the start page of its language.
async function networkFirst(event) {
    try {
        const response = await fetch(event.request);
        if (cacheable(response)) event.waitUntil(put(event.request, response.clone()));
        return response;
    } catch (error) {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.mode === "navigate") {
            const locale = new URL(event.request.url).pathname.startsWith("/en/") ? "en" : "fa";
            const start = await caches.match(`/${locale}/`);
            if (start) return start;
        }
        throw error;
    }
}

self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (request.method !== "GET") return;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin || url.search !== "") return;
    if (url.pathname.startsWith("/_astro/")) event.respondWith(cacheFirst(event));
    else event.respondWith(networkFirst(event));
});
