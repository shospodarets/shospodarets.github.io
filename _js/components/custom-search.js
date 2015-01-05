'use strict';

var UTILS = require('../utils/utils'),
    triggerEvent = UTILS.triggerEvent;

/**
 * Applies placeholder actions to original google custom search form
 * @constructor
 */

var CustomSearch = function () {
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

// EVENTS
CustomSearch.prototype.bindEvents = function () {
    this.placeholderForm.addEventListener('submit', function (e) {
        e.preventDefault();

        this.defineOriginalElements();
        this.originalInput.value = this.placeholderInput.value;

        window.console.log = function () {
        };// to keep console clear from google suggestions
        triggerEvent(this.googleOriginalSubmit, 'click');
        delete console.log;// get console back
    }.bind(this));
};

exports.CustomSearch = CustomSearch;