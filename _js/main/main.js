// DEPENDENCIES
// components
import Events from "./components/events-binding";
import TalksData from "./components/talks-data";
import ContactForm from "./components/contact-form";
import "./components/register-service-worker";// execute file without imports

// outer components
import Analytics from "./outer_components/analytics";
import CustomSearch from "./outer_components/custom-search";
import ConditionalLoader from "./outer_components/conditional-loader";
import IncludeCss from "./outer_components/include-css";

document.addEventListener("DOMContentLoaded", () => {
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
        new TalksData(talksDataEl);// populate talks data
    });

    // contact form
    Array.from(document.querySelectorAll('.js-contact-form')).forEach((contactFormEl) => {
        new ContactForm({
            contactFormEl,
            CONTACT_EMAIL: APP.CONTACT_EMAIL
        });
    });
});