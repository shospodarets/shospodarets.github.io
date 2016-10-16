import {loadScript} from "../utils/utils";
import {httpProtocol} from "../utils/utils";

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
        loadScript(this.options.SITE_BASE_URL + '/js/libs/caniuse.min.js');
    }
    /* CODEPEN EXAMPLES */
    if (document.querySelectorAll('.codepen').length) {
        loadScript(httpProtocol + '//codepen.io/assets/embed/ei.js');
    }
    /* JSBIN EXAMPLES */
    if (document.querySelectorAll('.jsbin-embed').length) {
        loadScript(httpProtocol + '//static.jsbin.com/js/embed.js');
    }
    /* DISCUSS */
    if (document.querySelectorAll('#disqus_thread').length) {
        window.disqus_config = function () {
            //noinspection JSPotentiallyInvalidUsageOfThis
            this.page.url = this.options.PAGE_URL;
            //noinspection JSPotentiallyInvalidUsageOfThis
            this.page.identifier = this.options.PAGE_IDENTIFIER;
        };
        loadScript(
            httpProtocol + '//' + this.options.DISCUSS_ID + '.disqus.com/embed.js'
        );
    }
    /* TWITTER BUTTONS */
    if (document.querySelectorAll('.twitter-widget').length) {
        loadScript(
            httpProtocol + '//' + 'platform.twitter.com/widgets.js'
        );
    }
};

export default ConditionalLoader;