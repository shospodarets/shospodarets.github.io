'use strict';

/**
 * @constructor
 */

var EventsBinding = function () {
    this.bindEvents();
};

// METHODS
EventsBinding.prototype.onUnload = function () {
    var unloadingClass = 'unloading';

    document.body.classList.add(unloadingClass);
    // timeout in case of problem (e.g. page stuck after mailto: click on mac)
    setTimeout(function () {
        document.body.classList.remove(unloadingClass);
    }, 5000);
};

EventsBinding.prototype.onPostShortClick = function (e) {
    // Open post content on post-short click
    if (e.target.tagName.toLowerCase() === 'a')  return;// leave links click

    var href = this.querySelector('.post-title a').getAttribute('href');
    if (href) {
        window.location = href;
    }
};

// BIND EventsBinding
EventsBinding.prototype.bindEvents = function () {
    window.addEventListener('beforeunload', this.onUnload);
    window.addEventListener('unload', this.onUnload);


    var postShorts = document.querySelectorAll('.post-short');
    [].slice.apply(postShorts).forEach(function (postShort) {
        postShort.addEventListener('click', this.onPostShortClick);
    }.bind(this));
};

exports.EventsBinding = EventsBinding;