(function () {
    var isScrollSnapSupported = 'scrollSnapType' in document.documentElement.style ||
        'webkitScrollSnapType' in document.documentElement.style;

    if (isScrollSnapSupported) return;


    /*----- USE SCROLLIFY -----*/
    var scrollBoxesQuery = '.box';
    var $boxes = $(scrollBoxesQuery);

    // REMOVE IDs TO PREVENT AN AUTOMATIC BROWSER SCROLLING
    $boxes.removeAttr('id');

    // SCROLLIFY
    $.scrollify({
        section: scrollBoxesQuery
    });

    // SCROLL TO
    $(".scrollTo").click(function (e) {
        e.preventDefault();
        $.scrollify("move", $(this).attr("href"));
    });

    // SET HEIGHT FOR BROWSERS WITHOUT "height: 100vh;" CSS UNITS SUPPORT
    $boxes.css({"height": $(window).height()});
    var timer;

    $(window).resize(function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            $boxes.css({"height": $(window).height()});
        }, 40);
    });
}());