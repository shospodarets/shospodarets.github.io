exports.triggerEvent = function (el, eventName) {
    const event = document.createEvent('HTMLEvents');
    event.initEvent(eventName, true, true);
    event.eventName = eventName;
    el.dispatchEvent(event);
};

/**
 * @param src {String}
 * @param [onload] {Function} Can be used for specific cases when action is needed on script load
 * without wait one JS cycle which will be before invoking SUCCESS function passed in promise.then
 */
exports.loadScript = function (src, onload) {
    return new Promise(function (resolve, reject) {
        const script = document.createElement('script');
        script.async = true;
        script.src = src;
        if (onload) {
            script.onload = onload;
        } else {
            script.onload = resolve;
            script.onerror = reject;
        }
        document.head.appendChild(script);
    });
};

exports.httpProtocol = document.location.protocol == 'https:' ? 'https:' : 'http:';
