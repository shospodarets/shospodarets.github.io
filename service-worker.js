/* VARS */

// enables debug logging
// in global scope to simplify debugging
self.isDebugEnabled = false;

(()=> {// incapsulate funcs, vars from global scope
    const CACHE_NAME = 'offline';

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
        log('SW is installed');
        // OLD SW MIGHT BE STILL ACTIVE HERE
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then((cache) =>cache.addAll(urlsToCache))
                .catch((err)=> {
                    logError(`Error opening the cache "${CACHE_NAME}"`, err);
                })
        );
    });

    /* DELETE PREVIOUS CACHES */
    self.addEventListener('activate', (event) => {
        log('SW is activated');
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
                    logError(`Error reading cache keys for "${CACHE_NAME}"`, err);
                })
        );
    });

    /* FETCH */
    self.addEventListener('fetch', (event) => {
        // Fetching request as usually if possible updating the cached version
        // and serve cached version only in cases of errors (offline mode, network or server errors etc.)
        event.respondWith(
            caches.match(event.request)
                .then((responseFromCache) => {
                        //log('Fetching', event.request.url);

                        // event.request.clone -  as event.request is used after and can be consumed only once
                        return fetch(event.request.clone())
                            .then((response) => {
                                // Check if we received a valid response
                                if (!response || response.status !== 200 || response.type !== 'basic') {
                                    return response;
                                }

                                caches.open(CACHE_NAME)
                                    .then((cache) => {
                                        log('Cumulative add to cache', event.request.url);

                                        // response.clone - because response can be consumed only once
                                        cache.put(event.request, response.clone());
                                    })
                                    .catch((err)=> {
                                        logError(`Error opening the cache "${CACHE_NAME}"`, err);
                                    });

                                return response;
                            })
                            .catch((err)=> {
                                if (responseFromCache) {
                                    log(`Serving cached response for "${event.request.url}" because of fetching error`, err);
                                    sendMessageToPage('Some content was served from browser cache because of connection problems');
                                    return responseFromCache;
                                } else {
                                    logError(`Error fetching the request "${event.request.url}"`, err);
                                }
                            });
                    }
                )
                .catch((err)=> {
                    logError(`Error matching cache for the request "${event.request}"`, err);
                })
        );
    });

    /*--- MESSAGING ---*/
    self.addEventListener('message', (event)=> {
        //log('Handling a message', event);
        if (event.data['---isDebugEnabled---'] !== undefined) {
            isDebugEnabled = event.data['---isDebugEnabled---'];
        }
    });

    function sendMessageToPage(message) {
        return self.clients.matchAll()
            .then(function (clients) {
                clients.forEach(function (client) {
                    client.postMessage({
                        "---notification---": message
                    });
                });
            });
    }

    /*--- LOGGING ---*/
    function log() {
        if (!isDebugEnabled) return;
        console.log.apply(console, addMessagePrefix('SW:', arguments));
    }

    function logError() {
        if (!isDebugEnabled) return;
        console.error.apply(console, addMessagePrefix('SW:', arguments));
    }

    function addMessagePrefix(prefix, args) {
        var res = Array.prototype.slice.apply(args);
        res.unshift(prefix);
        return res;
    }
})();