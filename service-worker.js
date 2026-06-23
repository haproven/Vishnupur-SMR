
const CACHE_NAME = 'vishnupursmr-v2';
const OFFLINE_URL = '/offline.html';
const NOT_FOUND_URL = '/404.html';

const STATIC_ASSETS = [
    '/',
    '/index.html'
];

/* ================= INSTALL ================= */

self.addEventListener('install', (event) => {

    event.waitUntil(

        caches.open(CACHE_NAME).then((cache) => {

            return cache.addAll(STATIC_ASSETS);

        })

    );

    self.skipWaiting();

});

/* ================= ACTIVATE ================= */

self.addEventListener('activate', (event) => {

    event.waitUntil(

        caches.keys().then((keys) => {

            return Promise.all(

                keys.map((key) => {

                    if (key !== CACHE_NAME) {

                        return caches.delete(key);

                    }

                })

            );

        })

    );

    self.clients.claim();

});

/* ================= FETCH ================= */

self.addEventListener('fetch', (event) => {

    const request = event.request;

    /* ===== HTML Pages ===== */

    if (request.mode === 'navigate') {

        event.respondWith(

            fetch(request)

                .then((response) => {

                    /* Save Latest HTML */

                    const responseClone = response.clone();

                    caches.open(CACHE_NAME).then((cache) => {

                        cache.put(request, responseClone);

                    });

                    /* 404 */

                    if (response.status === 404) {

                        return caches.match(NOT_FOUND_URL);

                    }

                    return response;

                })

                .catch(async () => {

                    return (
                        await caches.match(request) ||
                        await caches.match(OFFLINE_URL)
                    );

                })

        );

        return;

    }

    /* ===== CSS / JS / Images ===== */

    event.respondWith(

        caches.match(request).then(async (cachedResponse) => {

            const fetchPromise = fetch(request)

                .then((networkResponse) => {

                    /* Save Fresh Files */

                    const responseClone = networkResponse.clone();

                    caches.open(CACHE_NAME).then((cache) => {

                        cache.put(request, responseClone);

                    });

                    return networkResponse;

                })

                .catch(() => cachedResponse);

            /* Return cache instantly + update in background */

            return cachedResponse || fetchPromise;

        })

    );

});