import {loadCss} from "../utils/utils.js";

/**
 * @constructor
 */
const IncludeCss = function (options) {
    this.options = options;

    // include default CSS
    if (this.options.isDefaultCssEnabled) {
        loadCss(`${this.options.SITE_BASE_URL}/css/non-critical.css`)
    }
};

// METHODS
IncludeCss.prototype.loadCss = function (href) {
    return loadCss(href);
};

export default IncludeCss;