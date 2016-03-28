(function () {
    var linkEl = document.querySelector('.link-element');
    var setsBtns = document.querySelectorAll('.sets button');
    var setsBtnsArr = Array.prototype.slice.call(setsBtns);
    setsBtnsArr.forEach(function (btn) {
        btn.addEventListener('click', addListener);
    });

    function addListener(e) {
        var btn = e.target;
        var set = btn.dataset.set;

        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('class', 'link-element');
        link.setAttribute('href', './' + set + '.css');
        linkEl.parentNode.replaceChild(link, linkEl);
        linkEl = link;
    }
}());