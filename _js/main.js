'use strict';

(function () {
    // dependencies
    var CustomSearch = require('./components/custom-search').CustomSearch;
    var Events = require('./components/events-binding').EventsBinding;

    // APP
    var APP = {};

    APP.customSearch = new CustomSearch();
    APP.events = new Events();
}());