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
    window._gaq = window._gaq || [];
    window._gaq.push(['_setAccount', this.options.GOOGLE_ANALYTICS]);
    window._gaq.push(['_trackPageview']);
};

Analytics.prototype.load = function () {
    loadScript(
        `${document.location.protocol === 'https:' ? 'https://ssl' : 'http://www' 
        }.google-analytics.com/ga.js`
    );
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