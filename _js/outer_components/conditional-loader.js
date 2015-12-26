'use strict';

var UTILS = require('../utils/utils');

/**
 * @constructor
 */

var ConditionalLoader = function (options) {
    this.options = options;

    this.loadScripts();
};

// LOAD SCRIPTS
ConditionalLoader.prototype.loadScripts = function () {
    /* CAN I USE INFO */
    if (document.querySelectorAll('.caniuse').length) {
        UTILS.loadScript(this.options.SITE_BASE_URL + '/js/caniuse.min.js');
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
        UTILS.loadScript(
            UTILS.httpProtocol + '//' + this.options.DISCUSS_ID + '.disqus.com/embed.js'
        );
    }
    /* SHARE BUTTONS */
    if (document.querySelectorAll('.share-buttons').length) {
        UTILS.loadScript(
            document.location.protocol == 'https:' ?
                'https://ws.sharethis.com/button/buttons.js' :
                'http://w.sharethis.com/button/buttons.js',
            false,// if "false"-> loads async
            function () {
                stLight.options({
                    publisher: this.options.SHARE_BUTTONS_ID,
                    doNotHash: true,
                    doNotCopy: true,// if false-> “See more: yourURL.com#SThashtag” will appear
                    hashAddressBar: false,
                    shorten: false
                });
            }.bind(this)
        );
    }
};

exports.ConditionalLoader = ConditionalLoader;