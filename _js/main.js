'use strict';

(function () {
    // dependencies
    var CustomSearch = require('./components/custom-search').CustomSearch;
    var Events = require('./components/events-binding').EventsBinding;
    var ConditionalLoader = require('./components/conditional-loader').ConditionalLoader;
    var es6Promise = require('../bower_components/es6-promise/promise');

    /* POLYFILLS */
    if (!window.Promise) window.Promise = es6Promise;

    // APP
    var APP = {};

    APP.SITE_BASE_URL = SITE_BASE_URL;
    delete window.SITE_BASE_URL;// cleaning

    APP.events = new Events();
    APP.conditionalLoader = new ConditionalLoader({
        SITE_BASE_URL: APP.SITE_BASE_URL
    });
    APP.customSearch = new CustomSearch({
        conditionalLoader: APP.conditionalLoader,
        google_cx: '012363491708652379866:741arfehybe'
    });
}());