import {loadScript, httpProtocol, triggerEvent} from "../utils/utils";

/**
 * Applies placeholder actions to original google custom search form
 * @constructor
 */

const CustomSearch = function (options) {
    this.options = options;

    this.isLoading = false;

    this._onFocus = this.onFocus.bind(this);// create link function to add/remove it as event listener

    this.placeholderForm = document.querySelector('.google-custom-search-placeholder');
    if (!this.placeholderForm) return;

    this.placeholderInput = this.placeholderForm.querySelector('input');
    this.originalInput =
        this.googleOriginalSubmit = undefined;

    this.bindEvents();
};

// METHODS
CustomSearch.prototype.defineOriginalElements = function () {
    if (!this.originalInput) {
        this.originalInput = document.querySelector('.gsc-input input[type="text"]');
    }
    if (!this.googleOriginalSubmit) {
        this.googleOriginalSubmit = document.querySelector('.gsc-search-button input');
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
    return loadScript(
        httpProtocol + '//www.google.com/cse/cse.js?cx=' + this.options.GOOGLE_SEARCH_ID
    );
};

CustomSearch.prototype.onFocus = function () {
    if (this.isLoading) return;
    this.isLoading = true;

    this.loadSearch()
        .then(function () {
            // on custom search loaded
            this.isLoading = false;
            this.placeholderInput.removeEventListener('focus', this._onFocus);// remove loading request

            this.bindAdditionalEvents();
        }.bind(this), function () {
            // on custom search loading error
            this.isLoading = false;
        }.bind(this));
};

// EVENTS
CustomSearch.prototype.bindEvents = function () {
    // start loading custom search on input focus
    this.placeholderInput.addEventListener('focus', this._onFocus);

    // prevent submit of placeholder input
    this.placeholderForm.addEventListener('submit', function (e) {
        e.preventDefault();
    }.bind(this));
};

CustomSearch.prototype.bindAdditionalEvents = function () {
    this.placeholderForm.addEventListener('submit', function () {
        this.defineOriginalElements();
        this.runSearch(this.placeholderInput.value);
    }.bind(this));
};

export default CustomSearch;