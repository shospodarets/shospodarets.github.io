/**
 * Babel Polyfill (to include Promise etc.)
 *
 * https://babeljs.io/docs/usage/polyfill/
 */
import 'babel-polyfill';

// DEPENDENCIES
// components
import Events from "./components/events-binding";
import "./components/register-service-worker";// execute file without imports

// outer components
import Analytics from "./outer_components/analytics";
import CustomSearch from "./outer_components/custom-search";
import ConditionalLoader from "./outer_components/conditional-loader";

document.addEventListener("DOMContentLoaded", () =>{
    // APP
    const APP = window.jekyllVariables;
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
        PAGE_URL: APP.PAGE_URL,
        PAGE_IDENTIFIER: APP.PAGE_IDENTIFIER
    });
    APP.customSearch = new CustomSearch({
        GOOGLE_SEARCH_ID: APP.GOOGLE_SEARCH_ID
    });
});