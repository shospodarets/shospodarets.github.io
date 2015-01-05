'use strict';

exports.triggerEvent = function (el, eventName) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent(eventName, true, true);
    event.eventName = eventName;
    el.dispatchEvent(event);
};
