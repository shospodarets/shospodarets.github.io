'use strict';

var UTILS = require('../utils/utils'),
    triggerEvent = UTILS.triggerEvent;

/**
 * Applies placeholder actions to original google custom search form
 * @constructor
 */

var CustomSearch = function (options) {
    this.options = options;

    this.placeholderForm = document.querySelector('.google-custom-search-placeholder');
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

    window.console.log = function () {
    };// to keep console clear from google suggestions
    triggerEvent(this.googleOriginalSubmit, 'click');
    delete console.log;// get console back
};

CustomSearch.prototype.loadSearch = function () {
    return this.options
        .conditionalLoader.loadScript(
        this.options.conditionalLoader.protocol + '//www.google.com/cse/cse.js?cx=' + this.options.google_cx
    );
};

// EVENTS
CustomSearch.prototype.bindEvents = function () {
    // start loading custom search on input focus
    this.placeholderInput.addEventListener('focus', function () {
        this.loadSearch()
            .then(function success() {
                // on custom search loaded
                this.bindAdditionalEvents();
            }.bind(this))
    }.bind(this));

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

exports.CustomSearch = CustomSearch;