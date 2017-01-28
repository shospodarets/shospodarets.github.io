(function () {
    function onWindowsLoaded() {
        setTimeout(function () {
            console.log('----- Common -----');

            // https://www.html5rocks.com/en/tutorials/webperformance/basics/
            const t = performance.timing;
            const pageLoadTime = t.loadEventEnd - t.responseEnd;
            console.log(`Page Is Loaded in: ${pageLoadTime / 1000} s.`);
        }, 0);
    }

    window.addEventListener('load', onWindowsLoaded);
}());