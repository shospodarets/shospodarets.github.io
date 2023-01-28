// DEPENDENCIES
// components
import Events from './components/events-binding.js';
import TalksData from './components/talks-data.js';
import ComponentForm from './components/component-form.js';
import './components/register-service-worker.js';// execute file without imports

// outer components
import Analytics from './outer_components/analytics.js';
import CustomSearch from './outer_components/custom-search.js';
import ConditionalLoader from './outer_components/conditional-loader.js';
import IncludeCss from './outer_components/include-css.js';

document.addEventListener('DOMContentLoaded', () => {
    // APP
    const APP = window.jekyllVariables;
    delete window.jekyllVariables;// cleaning

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

    APP.includeCss = new IncludeCss({
        isDefaultCssEnabled: APP.isDefaultCssEnabled,
        SITE_BASE_URL: APP.SITE_BASE_URL
    });

    // COMPONENTS
    APP.events = new Events();

    // talks data
    Array.from(document.querySelectorAll('.talks-data')).forEach((talksDataEl) => {
        // eslint-disable-next-line no-new
        new TalksData(talksDataEl, {
            SITE_BASE_URL: APP.SITE_BASE_URL,
            STATIC_RESOURCES_URL: APP.STATIC_RESOURCES_URL
        });// populate talks data
    });

    // contact form
    Array.from(document.querySelectorAll('.js-component-form')).forEach((componentFormEl) => {
        // eslint-disable-next-line no-new
        new ComponentForm({
            componentFormEl
        });
    });
});
