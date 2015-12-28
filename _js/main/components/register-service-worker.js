if ('serviceWorker' in navigator) {
    let swPath = `/service-worker.js`;
    navigator.serviceWorker.register(
        swPath
    ).then(function (registration) {
        log(`Service Worker "${swPath}" registration successful with scope: ${registration.scope}`);
    }).catch(function (error) {
        // registration failed
        log(`Registration of Service Worker "${swPath}" failed with ${error}`);
    });
}

/**
 * @param str {String}
 *
 * Output string to console if debug mode is active
 */
function log(str) {
    if (
        !self.debug && !localStorage.debug
    ) return;

    console.log(str);
}