/* VARS */
var humane = require('../libs/humane');// http://wavded.github.io/humane-js/

// enables debug logging in the browser script and Service Worker
var isDebugEnabled = localStorage.debug || location.search.indexOf('debug') !== -1;

/* LOGGING */
function log() {
    if (!isDebugEnabled) return;
    console.log.apply(console, addMessagePrefix('PAGE:', arguments));
}

function logError() {
    if (!isDebugEnabled) return;
    console.error.apply(console, addMessagePrefix('PAGE:', arguments));
}

function addMessagePrefix(prefix, args) {
    var res = Array.prototype.slice.apply(args);
    res.unshift(prefix);
    return res;
}

/* REGISTER WORKER */
//if ('serviceWorker' in navigator) {
//    let swPath = `/service-worker.js`;
//    navigator.serviceWorker.register(
//        swPath
//    ).then(function (registration) {
//        sendMessageToWorker({'---isDebugEnabled---': isDebugEnabled});// send debug state info
//        log(`Service Worker "${swPath}" registration successful with scope: ${registration.scope}`);
//    }).catch(function (error) {
//        // registration failed
//        logError(`Registration of Service Worker "${swPath}" failed with error`, error);
//    });
//}

/*--- MESSAGING ---*/

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

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', function (event) {
        if (event.data['---notification---'] !== undefined) {
            humane.log(event.data['---notification---'], {
                addnCls: 'humane-libnotify-info',
                timeout: 5000,
                clickToClose: true
            });
        }
    });
}