importScripts('js/libs/cache-polyfill.js');

/*--- CACHE ---*/

const CACHE_NAME = 'v5';

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

self.addEventListener('install', (event) => {
    // OLD SW MIGHT BE STILL ACTIVE HERE
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) =>cache.addAll(urlsToCache))
            .catch((err)=> {
                log(`Error opening the cache "${CACHE_NAME}": ${err}`, 'error');
            })
    );
});

/* DELETE PREVIOUS CACHES */
self.addEventListener('activate', (event) => {
    log('CACHE_NAME:' + CACHE_NAME);
    // CURRENT SW TAKES CONTROL, OLD ISN'T ACTIVE HERE
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .catch((err) => {
                log(`Error reading cache keys for "${CACHE_NAME}": ${err}`, 'error');
            })
    );
});

/* FETCH */
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((responseFromCache) => {
                    if (responseFromCache) {
                        log('* [Serving cached]: ' + event.request.url);
                        return responseFromCache;
                    }

                    //log('* [Fetching]: ' + event.request.url);

                    // event.request.clone -  as event.request is used after and can be consumed only once
                    return fetch(event.request.clone())
                        .then((response) => {
                            // Check if we received a valid response
                            if (!response || response.status !== 200 || response.type !== 'basic') {
                                return response;
                            }

                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    log('* [Cumulative add to cache:]: ' + event.request.url);

                                    // response.clone - because response can be consumed only once
                                    cache.put(event.request, response.clone());
                                })
                                .catch((err)=> {
                                    log(`Error opening the cache "${CACHE_NAME}": ${err}`, 'error');
                                });

                            return response;
                        })
                        .catch((err)=> {
                            log(`Error fetching the request "${event.request.url}": ${err}`, 'error');
                        });
                }
            )
            .catch((err)=> {
                log(`Error matching cache for the request "${event.request}": ${err}`, 'error');
            })
    );
});

/*--- UTILS ---*/

/**
 * @param str {String}
 * @param isError {Boolean|String}
 *
 * Output string to console
 */
function log(str, isError) {
    if (!self.debug) return;

    if (isError) {
        console.error(str);
    } else {
        console.log(str);
    }
}