'use strict';

(function () {
    // DEPENDENCIES
    // components
    var Events = require('./components/events-binding').EventsBinding;
    var Analytics = require('./outer_components/analytics').Analytics;
    // outer components
    var CustomSearch = require('./outer_components/custom-search').CustomSearch;
    var ConditionalLoader = require('./outer_components/conditional-loader').ConditionalLoader;
    var es6Promise = require('../bower_components/es6-promise/promise');

    /* POLYFILLS */
    if (!window.Promise) window.Promise = es6Promise;

    // APP
    var APP = window.jekyllVariables;
    delete window.jekyllVariables;// cleaning

    // COMPONENTS
    APP.events = new Events();
    // OUTER COMPONENTS (loading services/additions from outside)
    APP.analytics = new Analytics({
        GOOGLE_ANALYTICS: APP.GOOGLE_ANALYTICS
    });
    APP.conditionalLoader = new ConditionalLoader({
        SITE_BASE_URL: APP.SITE_BASE_URL,
        DISCUSS_ID: APP.DISCUSS_ID,
        SHARE_BUTTONS_ID: APP.SHARE_BUTTONS_ID
    });
    APP.customSearch = new CustomSearch({
        GOOGLE_SEARCH_ID: APP.GOOGLE_SEARCH_ID
    });
}());