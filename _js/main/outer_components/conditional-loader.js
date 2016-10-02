const UTILS = require('../utils/utils');

/**
 * @constructor
 */

const ConditionalLoader = function (options) {
    this.options = options;

    this.loadScripts();
};

// LOAD SCRIPTS
ConditionalLoader.prototype.loadScripts = function () {
    /* CAN I USE INFO */
    if (document.querySelectorAll('.caniuse').length) {
        UTILS.loadScript(this.options.SITE_BASE_URL + '/js/libs/caniuse.min.js');
    }
    /* CODEPEN EXAMPLES */
    if (document.querySelectorAll('.codepen').length) {
        UTILS.loadScript(UTILS.httpProtocol + '//codepen.io/assets/embed/ei.js');
    }
    /* JSBIN EXAMPLES */
    if (document.querySelectorAll('.jsbin-embed').length) {
        UTILS.loadScript(UTILS.httpProtocol + '//static.jsbin.com/js/embed.js');
    }
    /* DISCUSS */
    if (document.querySelectorAll('#disqus_thread').length) {
        window.disqus_config = function () {
            this.page.url = this.options.PAGE_URL;
            this.page.identifier = this.options.PAGE_IDENTIFIER;
        };
        UTILS.loadScript(
            UTILS.httpProtocol + '//' + this.options.DISCUSS_ID + '.disqus.com/embed.js'
        );
    }
    /* TWITTER BUTTONS */
    if (document.querySelectorAll('.twitter-widget').length) {
        UTILS.loadScript(
            UTILS.httpProtocol + '//' + 'platform.twitter.com/widgets.js'
        );
    }
};

exports.ConditionalLoader = ConditionalLoader;