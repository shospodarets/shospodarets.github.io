importScripts('js/libs/cache-polyfill.js');

const cacheVersion = 'v27';

/* DELETE PREVIOUS CACHES */
self.addEventListener('activate', function (event) {
    var cacheWhitelist = [cacheVersion];

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

/* CACHE */

const entitiesToCache = [
    // html
    '/',
    '/index.html',

    // css
    '/css/non-critical.css',

    // js
    '/js/main.min.js'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cacheVersion).then(function (cache) {
            return cache.addAll(entitiesToCache);
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (match) {
                    if (match) {
                        log('* [Serving cached]: ' + event.request.url);
                        return match;
                    }

                    log('* [Fetching]: ' + event.request.url);
                    return fetch(event.request);
                }
            )
    );
});

/* UTILS */

/**
 * @param str {String}
 *
 * Output string to console
 */
function log(str) {
    console.log(str);
}