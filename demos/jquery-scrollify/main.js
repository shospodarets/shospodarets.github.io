(function () {
    var scrollBoxesQuery = '.box';
    var $boxes = $(scrollBoxesQuery);

    /*----- Provide Easing -----*/
    var easings = [];
    for (var x in jQuery.easing) {
        easings.push(x);
    }
    var $easing = $('.js-easing');
    easings.forEach(function (easing) {
        if (easing === 'def') return;// skip
        $easing.append('<option value="' + easing + '">' + easing + '</option>');
    });
    var appliedEasing = 'easeOutExpo';//default
    // START APPLY OPTION FROM URL
    var _appliedEasing = localStorage.getItem('appliedEasing');
    if (_appliedEasing) {
        appliedEasing = _appliedEasing;
    }
    // END APPLY OPTION FROM URL
    $easing
        .val(appliedEasing)// set selected option
        .on('change', function () {// events
            localStorage.setItem('appliedEasing', $easing.val());
            window.location.reload(true);
        });

    /*----- Scroll Speed -----*/
    var durations = [];
    for (var duration = 0; duration <= 5000; duration += 500) {
        durations.push(duration);
    }
    var $duration = $('.js-scroll-speed');
    durations.forEach(function (duration) {
        $duration.append('<option value="' + duration + '">' + duration + '</option>');
    });
    var appliedScrollSpeed = '1000';//default
    // APPLY OPTION FROM URL
    var _appliedScrollSpeed = localStorage.getItem('appliedScrollSpeed');
    if (_appliedScrollSpeed) {
        appliedScrollSpeed = _appliedScrollSpeed;
    }
    // END APPLY OPTION FROM URL
    $duration
        .val(appliedScrollSpeed)// set selected option
        .on('change', function () {// events
            localStorage.setItem('appliedScrollSpeed', $duration.val());
            window.location.reload(true);
        });


    // REMOVE IDs TO PREVENT AN AUTOMATIC BROWSER SCROLLING
    $boxes.removeAttr('id');

    // SCROLLIFY
    $.scrollify({
        section: scrollBoxesQuery,
        easing: appliedEasing,
        scrollSpeed: appliedScrollSpeed
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