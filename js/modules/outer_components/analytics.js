import {loadScript} from '../utils/utils.js';

/**
 * @param {Object} options
 * @constructor
 */
const Analytics = function (options) {
    this.options = options;

    this.prepare();
    this.load();
    this.addJsErrorsTracking();
};

// METHODS
Analytics.prototype.prepare = function () {
    window.dataLayer = window.dataLayer || [];

    function gtag() {
        window.dataLayer.push(arguments);
    }

    gtag('js', new Date());

    gtag('config', this.options.GOOGLE_ANALYTICS);
};

Analytics.prototype.load = function () {
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${this.options.GOOGLE_ANALYTICS}`);
};

Analytics.prototype.addJsErrorsTracking = function () {
    window.addEventListener('error', (err) => {
        const lineAndColumnInfo = err.colno ? ` line:${err.lineno}, column:${err.colno}` : ` line:${err.lineno}`;
        window._gaq.push([
            '_trackEvent',
            'JavaScript Error',
            err.message,
            `${err.filename + lineAndColumnInfo} -> ${navigator.userAgent}`,
            0,
            true
        ]);
    });
};

export default Analytics;