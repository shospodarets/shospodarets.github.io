'use strict';

(function () {
    // Open post content on post-short click
    $(document).on('click', '.post-short', function () {
        var href = $(this).find('.post-title a').attr('href');
        if (href) {
            window.location = href;
        }
    });

    // add effect on content on before page unload
    $(window)
        .on('beforeunload unload', function () {
            var $body = $('body');
            var unloadingClass = 'unloading';

            $body.addClass(unloadingClass);
            // timeout in case of problem (e.g. page stuck after mailto: click on mac)
            setTimeout(function () {
                $body.removeClass(unloadingClass);
            }, 5000);
        });
}());