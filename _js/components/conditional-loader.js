'use strict';

/**
 * @constructor
 */

var ConditionalLoader = function (options) {
    this.options = options;

    this.protocol = document.location.protocol == 'https:' ? 'https:' : 'http:';

    this.loadScripts();
};

// METHODS
/**
 * @param src {String}
 * @param [notAsync] {Boolean}
 */
ConditionalLoader.prototype.loadScript = function (src, notAsync) {
    return new Promise(function(resolve, reject) {
        var script = document.createElement('script');
        if (!notAsync) script.async = true;
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

// LOAD SCRIPTS
ConditionalLoader.prototype.loadScripts = function () {
    /* CAN I USE INFO */
    if (document.querySelectorAll('.caniuse').length) {
        this.loadScript(this.options.SITE_BASE_URL + '/js/caniuse.min.js');
    }
    /* CODEPEN EXAMPLES */
    if (document.querySelectorAll('.codepen').length) {
        this.loadScript(this.protocol + '//codepen.io/assets/embed/ei.js');
    }
};

exports.ConditionalLoader = ConditionalLoader;