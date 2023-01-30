/* VARS */

// enables debug logging
// in global scope to simplify debugging
self.isDebugEnabled = false; // eslint-disable-line no-restricted-globals

(() => { // incapsulate funcs, vars from global scope
    const CACHE_NAME = 'offline1';

    /* CACHE REQUIRED ITEMS */
    const urlsToCache = [
        // // html
        // '/',
        // '/index.html',
        //
        // // css
        // '/css/non-critical.css',
    ];

    self.addEventListener('install', (event) => { // eslint-disable-line no-restricted-globals
        log('SW is installed');
        // OLD SW MIGHT BE STILL ACTIVE HERE
        event.waitUntil(caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
            .catch((err) => {
                logError(`Error opening the cache "${CACHE_NAME}"`, err);
            }));
    });

    /* DELETE PREVIOUS CACHES */
    self.addEventListener('activate', (event) => { // eslint-disable-line no-restricted-globals
        log('SW is activated');
        // CURRENT SW TAKES CONTROL, OLD ISN'T ACTIVE HERE
        event.waitUntil(caches.keys()
            .then((cacheNames) => {
                return Promise.all(cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                    return undefined;
                }));
            })
            .catch((err) => {
                logError(`Error reading cache keys for "${CACHE_NAME}"`, err);
            }));
    });

    /* FETCH */
    self.addEventListener('fetch', (event) => { // eslint-disable-line no-restricted-globals
        // Fetching request as usually if possible updating the cached version
        // and serve cached version only in cases of errors (offline mode, network or server errors etc.)
        event.respondWith(caches.match(event.request)
            .then((responseFromCache) => {
                // log('Fetching', event.request.url);

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
                            .catch((err) => {
                                logError(`Error opening the cache "${CACHE_NAME}"`, err);
                            });

                        return response;
                    })
                    .catch((err) => {
                        if (responseFromCache) {
                            log(`Serving cached response for "${event.request.url}" because of fetching error`, err);
                            sendMessageToPage('Some content was served from browser cache because of connection problems');
                            return responseFromCache;
                        }
                        logError(`Error fetching the request "${event.request.url}"`, err);
                    });
            })
            .catch((err) => {
                logError(`Error matching cache for the request "${event.request}"`, err);
            }));
    });

    /* --- MESSAGING ---*/
    self.addEventListener('message', (event) => { // eslint-disable-line no-restricted-globals
        // log('Handling a message', event);
        if (event.data['---isDebugEnabled---'] !== undefined) {
            self.isDebugEnabled = event.data['---isDebugEnabled---']; // eslint-disable-line no-restricted-globals
        }
    });

    function sendMessageToPage(message) {
        if (!self.isDebugEnabled) return; // eslint-disable-line no-restricted-globals

        return self.clients.matchAll() // eslint-disable-line no-restricted-globals
            .then((clients) => {
                clients.forEach((client) => {
                    client.postMessage({
                        '---notification---': message
                    });
                });
            });
    }

    /* --- LOGGING ---*/
    function log() {
        if (!self.isDebugEnabled) return; // eslint-disable-line no-restricted-globals

        console.log(...addMessagePrefix('SW:', arguments));
    }

    function logError() {
        if (!self.isDebugEnabled) return; // eslint-disable-line no-restricted-globals
        console.error(...addMessagePrefix('SW:', arguments));
    }

    function addMessagePrefix(prefix, args) {
        const res = Array.prototype.slice.apply(args);
        res.unshift(prefix);
        return res;
    }
})();