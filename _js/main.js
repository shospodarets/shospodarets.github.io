'use strict';

(function () {
    window.console.log = function () {
        // to keep console clear
    };

    // Open post content on post-short click
    $(document).on('click', '.post-short', function (e) {
        if (e.target.tagName.toLowerCase() === 'a')  return;// leave links click

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

    // GOOGLE CUSTOM SEARCH- apply placeholder actions to original
    var $googlePlaceholderForm = $('.google-custom-search-placeholder');
    var $googlePlaceholderInput = $googlePlaceholderForm.find('input');
    var $googleOriginalInput;
    var $googleOriginalSubmit;

    function defineGoogleOriginalElements() {
        if (!$googleOriginalInput) {
            $googleOriginalInput = $('.gsc-input');
        }
        if (!$googleOriginalSubmit) {
            $googleOriginalSubmit = $('.gsc-search-button');
        }
    }

    $googlePlaceholderForm.on('submit', function (e) {
        e.preventDefault();

        defineGoogleOriginalElements();
        $googleOriginalInput.val($googlePlaceholderInput.val());
        $googleOriginalSubmit.trigger('click');
    });
}());