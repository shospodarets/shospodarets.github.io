import {loadScript, httpProtocol, triggerEvent} from '../utils/utils.js';

/**
 * Applies placeholder actions to original google custom search form
 * @constructor
 */

const queryParams = new URLSearchParams(document.location.search);
const isTriggerJsErrorEnabled = queryParams.get('triggerJsError') === 'true';
if (isTriggerJsErrorEnabled) {
    callUndefinedFunctionToTriggerSentry();
}

const CustomSearch = function (options) {
    this.options = options;

    this.isLoading = false;

    this._onFocus = this.onFocus.bind(this);// create link function to add/remove it as event listener

    this.placeholderForm = document.querySelector('.google-custom-search-placeholder');
    if (!this.placeholderForm) return;

    this.placeholderInput = this.placeholderForm.querySelector('input');
    this.originalInput = undefined;
    this.googleOriginalSubmit = undefined;

    this.bindEvents();
};

// METHODS
CustomSearch.prototype.defineOriginalElements = function () {
    if (!this.originalInput) {
        this.originalInput = document.querySelector('.gsc-input input[type="text"]');
    }
    if (!this.googleOriginalSubmit) {
        this.googleOriginalSubmit = document.querySelector('.gsc-search-button button');
    }
};

CustomSearch.prototype.runSearch = function (value) {
    this.originalInput.value = value;
    this.placeholderInput.blur();// remove focus from placeholder input

    window.console.log = function () {
    };// to keep console clear from google suggestions
    triggerEvent(this.googleOriginalSubmit, 'click');
    delete console.log;// get console back
};

CustomSearch.prototype.loadSearch = function () {
    return loadScript(`${httpProtocol}//www.google.com/cse/cse.js?cx=${this.options.GOOGLE_SEARCH_ID}`);
};

CustomSearch.prototype.onFocus = function () {
    if (this.isLoading) return;
    this.isLoading = true;

    this.loadSearch()
        .then(() => {
            // on custom search loaded
            this.isLoading = false;
            this.placeholderInput.removeEventListener('focus', this._onFocus);// remove loading request

            this.bindAdditionalEvents();
        }, () => {
            // on custom search loading error
            this.isLoading = false;
        });
};

// EVENTS
CustomSearch.prototype.bindEvents = function () {
    // start loading custom search on input focus
    this.placeholderInput.addEventListener('focus', this._onFocus);

    // prevent submit of placeholder input
    this.placeholderForm.addEventListener('submit', (e) => {
        e.preventDefault();
    });
};

CustomSearch.prototype.bindAdditionalEvents = function () {
    this.placeholderForm.addEventListener('submit', () => {
        this.defineOriginalElements();
        this.runSearch(this.placeholderInput.value);
    });
};

export default CustomSearch;