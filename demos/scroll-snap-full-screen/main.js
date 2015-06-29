(function () {
    var isScrollSnapSupported = 'scrollSnapType' in document.documentElement.style ||
        'webkitScrollSnapType' in document.documentElement.style;

    if (isScrollSnapSupported) return;

    // USE SCROLLIFY
    $.scrollify({
        section: ".box"
    });
}());