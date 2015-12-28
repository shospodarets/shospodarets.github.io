if ('serviceWorker' in navigator) {
    let swPath = `/service-worker.js`;
    navigator.serviceWorker.register(
        swPath
    ).then(function (reg) {
        if (reg.installing) {
            log(`Service worker "${swPath}" installing`);
        } else if (reg.waiting) {
            log(`Service worker "${swPath}" installed`);
        } else if (reg.active) {
            log(`Service worker "${swPath}" active`);
        }
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