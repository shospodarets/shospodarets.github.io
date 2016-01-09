/* VARS */

// enables debug logging in the browser script and Service Worker
var IS_DEBUG_ENABLED = localStorage.debug || location.search.indexOf('debug') !== -1;

/* LOGGING */
function log() {
    if (!IS_DEBUG_ENABLED) return;
    console.log.apply(console, addMessagePrefix('PAGE:', arguments));
}

function logError() {
    if (!IS_DEBUG_ENABLED) return;
    console.error.apply(console, addMessagePrefix('PAGE:', arguments));
}

function addMessagePrefix(prefix, args) {
    var res = Array.prototype.slice.apply(args);
    res.unshift(prefix);
    return res;
}

/* REGISTER WORKER */
if ('serviceWorker' in navigator) {
    let swPath = `/service-worker.js`;
    navigator.serviceWorker.register(
        swPath
    ).then(function (registration) {
        sendMessageToWorker({IS_DEBUG_ENABLED: IS_DEBUG_ENABLED});// send debug state info
        log(`Service Worker "${swPath}" registration successful with scope: ${registration.scope}`);
    }).catch(function (error) {
        // registration failed
        logError(`Registration of Service Worker "${swPath}" failed with error`, error);
    });
}

/* UTILS */

// https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/post-message
function sendMessageToWorker(message) {
    return new Promise(function (resolve, reject) {
        var messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = function (event) {
            if (event.data.error) {
                reject(event.data.error);
            } else {
                logError(`An error occured getting a message from SW`, event.data.error);
                resolve(event.data);
            }
        };

        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage(
                message,
                [messageChannel.port2]
            );
        } else {
            logError(`Message sending to SW failed: navigator.serviceWorker.controller is`, navigator.serviceWorker.controller);
        }
    }).then(()=> {
    }, (err)=> {
        logError(`Message sending to SW failed with error`, err);
    });
}