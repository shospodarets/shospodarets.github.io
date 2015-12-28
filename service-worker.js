importScripts('js/libs/cache-polyfill.js');

/*--- CACHE ---*/

const CACHE_NAME = 'v2';

/* CACHE REQUIRED ITEMS */
const urlsToCache = [
    // html
    '/',
    '/index.html',

    // css
    '/css/non-critical.css',

    // js
    '/js/main.min.js'
];

self.addEventListener('install', function (event) {
    // OLD SW MIGHT BE STILL ACTIVE HERE
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

/* DELETE PREVIOUS CACHES */
self.addEventListener('activate', function (event) {
    // CURRENT SW TAKES CONTROL, OLD ISN'T ACTIVE HERE
    var cacheWhitelist = [CACHE_NAME];

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

/* FETCH */
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (responseFromCache) {
                    if (responseFromCache) {
                        log('* [Serving cached]: ' + event.request.url);
                        return responseFromCache;
                    }

                    log('* [Fetching]: ' + event.request.url);
                    log('CACHE_NAME:' + CACHE_NAME);

                    // event.request.clone -  as event.request is used after and can be consumed only once
                    return fetch(event.request.clone())
                        .then(function (response) {
                            // Check if we received a valid response
                            if (!response || response.status !== 200 || response.type !== 'basic') {
                                return response;
                            }

                            caches.open(CACHE_NAME)
                                .then(function (cache) {
                                    log('* [Cumulative add to cache:]: ' + event.request.url);

                                    // response.clone - because response can be consumed only once
                                    cache.put(event.request, response.clone());
                                });

                            return response;
                        });
                }
            )
    );
});

/*--- UTILS ---*/

/**
 * @param str {String}
 *
 * Output string to console
 */
function log(str) {
    //if (!self.debug) return;

    console.log(str);
}