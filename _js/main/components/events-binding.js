/**
 * @constructor
 */

var EventsBinding = function () {
    this.bindEvents();
};

// unload
EventsBinding.prototype.onUnload = function () {
    var unloadingClass = 'unloading';

    document.body.classList.add(unloadingClass);
    // timeout in case of problem (e.g. page stuck after mailto: click on mac)
    setTimeout(function () {
        document.body.classList.remove(unloadingClass);
    }, 5000);
};

// post click
EventsBinding.prototype.onPostShortClick = function (e) {
    // Open post content on post-short click
    if (e.target.tagName.toLowerCase() === 'a')  return;// leave links click

    var href = this.querySelector('.post-title a').getAttribute('href');
    if (href) {
        window.location = href;
    }
};

EventsBinding.prototype.bindPostClick = function () {
    var postShorts = document.querySelectorAll('.post-short');
    [].slice.apply(postShorts).forEach(function (postShort) {
        postShort.addEventListener('click', this.onPostShortClick);
    }.bind(this));
};

// heading click
EventsBinding.prototype.onHeadingClick = function (e) {
    // Set window hash
    var hash = e.target.getAttribute('id');
    if (hash) {
        window.location.hash = hash;
    }
};

EventsBinding.prototype.bindHeadingClick = function () {
    var headings = document.querySelectorAll('h1,h2,h3,h4,h5,h6');
    [].slice.apply(headings).forEach(function (heading) {
        heading.addEventListener('click', this.onHeadingClick);
    }.bind(this));
};

// BIND EVENTS
EventsBinding.prototype.bindEvents = function () {
    window.addEventListener('beforeunload', this.onUnload);
    window.addEventListener('unload', this.onUnload);

    this.bindPostClick();
    this.bindHeadingClick();
};

exports.EventsBinding = EventsBinding;