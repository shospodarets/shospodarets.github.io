import {loadScript} from "../utils/utils";

/**
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
        ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') +
        '.google-analytics.com/ga.js'
    );
};

Analytics.prototype.addJsErrorsTracking = function () {
    window['onerror'] = function (msg, url, line) {
        window._gaq.push([
            '_trackEvent',
            'JavaScript Errors',
            msg,
            url + " : " + line,
            new Date().toUTCString() + ' | ' + navigator.userAgent,
            true]);
    };
};

export default Analytics;