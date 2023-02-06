import {loadScript, httpProtocol} from '../utils/utils.js';

/**
 * @constructor
 */

const ConditionalLoader = function (options) {
    this.options = options;

    this.loadScripts();
};

// LOAD SCRIPTS
ConditionalLoader.prototype.loadScripts = function () {
    /* Highlight.js (code highlighter) */
    if (document.querySelectorAll('pre > code').length) {
        loadScript(`${this.options.SITE_BASE_URL}/js/libs/highlight.pack.js`)
            .then(() => {
                window.hljs.initHighlightingOnLoad();
            });
    }
    /* CAN I USE INFO */
    if (document.querySelectorAll('.caniuse').length) {
        loadScript(`${this.options.SITE_BASE_URL}/js/libs/caniuse.min.js`);
    }
    /* CODEPEN EXAMPLES */
    if (document.querySelectorAll('.codepen').length) {
        loadScript(`${httpProtocol}//codepen.io/assets/embed/ei.js`);
    }
    /* JSBIN EXAMPLES */
    if (document.querySelectorAll('.jsbin-embed').length) {
        loadScript(`${httpProtocol}//static.jsbin.com/js/embed.js`);
    }
    /* DISCUSS COMMENTS */
    if (document.querySelectorAll('#disqus_thread').length) {
        const _this = this; // due to the Disqus specifics

        // Load Disqus comments only when the user scrolls into the area Disqus is placed
        const observer = new IntersectionObserver((entries, _observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // embed Disqus
                    window.disqus_config = function () {
                        // noinspection JSPotentiallyInvalidUsageOfThis
                        this.page.url = _this.options.PAGE_URL;
                        // noinspection JSPotentiallyInvalidUsageOfThis
                        this.page.identifier = _this.options.PAGE_IDENTIFIER;
                    };
                    loadScript(`${httpProtocol}//${this.options.DISCUSS_ID}.disqus.com/embed.js`);

                    // Stop observing to prevent reinitializing Disqus.
                    _observer.unobserve(entry.target);
                }
            });
        });

        // Start an intersection observer
        const mountNode = document.querySelector('#disqus_thread');
        observer.observe(mountNode);
    }

    /* DISCUSS COMMENTS COUNTERS */
    if (document.querySelectorAll('.post__short-comment-counter').length) {
        loadScript(
            `${httpProtocol}//${this.options.DISCUSS_ID}.disqus.com/count.js`,
            {
                id: 'dsq-count-scr'
            }
        );
    }

    /* TWITTER BUTTONS */
    if (document.querySelectorAll('.twitter-widget').length) {
        loadScript(`${httpProtocol}//platform.twitter.com/widgets.js`);
    }

    /* FACEBOOK BUTTONS */
    if (document.querySelectorAll('.fb-widget').length) {
        const fbRoot = document.createElement('div');
        fbRoot.setAttribute('id', 'fb-root');
        document.body.appendChild(fbRoot);

        loadScript(`${httpProtocol}//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.10`);
    }

    /* IMAGE GALLERY */
    if (document.querySelectorAll('.image-gallery').length) {
        loadScript(`${this.options.SITE_BASE_URL}/js/libs/baguetteBox.min.js`)
            .then(() => {
                window.baguetteBox.run('.image-gallery');
            });
    }
};

export default ConditionalLoader;