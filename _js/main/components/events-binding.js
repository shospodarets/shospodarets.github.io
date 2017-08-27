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
    const postShorts = document.querySelectorAll('.post__short');
    [].slice.apply(postShorts).forEach(function (postShort) {
        postShort.addEventListener('click', this.onPostShortClick, true);
    }.bind(this));
};

// heading with ID click
EventsBinding.prototype.bindHeadingClick = function () {
    const headings = document.querySelectorAll('h1,h2,h3,h4,h5,h6');
    [].slice.apply(headings).forEach(function (heading) {

        const hash = heading.getAttribute('id');
        if (hash) {
            heading.addEventListener('click', () => {
                // Set window hash
                window.location.hash = hash
            });
        }

    }.bind(this));
};

// BIND EVENTS
EventsBinding.prototype.bindEvents = function () {
    this.bindPostClick();
    this.bindHeadingClick();
};

export default EventsBinding;