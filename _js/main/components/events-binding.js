/**
 * @constructor
 */

const EventsBinding = function () {
    this.bindEvents();
};

// post click
EventsBinding.prototype.onPostShortClick = function (e) {
    // Open post content on post-short click
    if (e.target.tagName.toLowerCase() === 'a')  return;// leave links click

    const href = this.querySelector('.post-title a').getAttribute('href');
    if (href) {
        window.location = href;
    }
};

EventsBinding.prototype.bindPostClick = function () {
    const postShorts = document.querySelectorAll('.post-short');
    [].slice.apply(postShorts).forEach(function (postShort) {
        postShort.addEventListener('click', this.onPostShortClick);
    }.bind(this));
};

// heading click
EventsBinding.prototype.onHeadingClick = function (e) {
    // Set window hash
    const hash = e.target.getAttribute('id');
    if (hash) {
        window.location.hash = hash;
    }
};

EventsBinding.prototype.bindHeadingClick = function () {
    const headings = document.querySelectorAll('h1,h2,h3,h4,h5,h6');
    [].slice.apply(headings).forEach(function (heading) {
        heading.addEventListener('click', this.onHeadingClick);
    }.bind(this));
};

// BIND EVENTS
EventsBinding.prototype.bindEvents = function () {
    this.bindPostClick();
    this.bindHeadingClick();
};

export default EventsBinding;