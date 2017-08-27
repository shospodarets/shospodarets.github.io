export function triggerEvent(el, eventName) {
    const event = document.createEvent('HTMLEvents');
    event.initEvent(eventName, true, true);
    event.eventName = eventName;
    el.dispatchEvent(event);
}

/**
 * @param src {String}
 * @param [scriptAttributes] {Object} Additional attributes to be added to the script DOM element
 * without wait one JS cycle which will be before invoking SUCCESS function passed in promise.then
 */
export function loadScript(src, scriptAttributes) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.async = true;
        script.src = src;

        // add scripts attributes if needed
        if (scriptAttributes) {
            for (const attrName in scriptAttributes) {
                script.setAttribute(attrName, scriptAttributes[attrName]);
            }
        }

        script.onload = resolve;
        script.onerror = reject;

        document.head.appendChild(script);
    });
}

/**
 * @param href {String}
 * @param [onload] {Function} Can be used for specific cases when action is needed on stylesheet load
 * without wait one JS cycle which will be before invoking SUCCESS function passed in promise.then
 */
export function loadCss(href, onload) {
    return new Promise((resolve, reject) => {
        const stylesheet = document.createElement('link');
        stylesheet.href = href;
        stylesheet.rel = 'stylesheet';
        stylesheet.type = 'text/css';
        if (onload) {
            stylesheet.onload = onload;
        } else {
            stylesheet.onload = resolve;
            stylesheet.onerror = reject;
        }
        document.head.appendChild(stylesheet);
    });
}

export const httpProtocol = document.location.protocol === 'https:' ? 'https:' : 'http:';