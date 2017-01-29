(() => {
    const webShareTestEl = document.querySelector('.web-share-test');

    if (!navigator.share) {
        webShareTestEl.children[0].innerText = 'error';
        return;
    }

    let resetTimeout;

    const resetButton = () => {
        clearTimeout(resetTimeout);
        resetTimeout = setTimeout(() => {
            webShareTestEl.children[0].innerText = 'share';
        }, 1000);
    };

    const sharePage = () => {
        navigator.share({
            title: document.title,
            text: "Here is the Web Share demo Text",
            url: window.location.href
        }).then(() => {
            webShareTestEl.children[0].innerText = 'done';
            resetButton();
        })
            .catch(error => {
                console.log('Error sharing:', error);

                webShareTestEl.children[0].innerText = 'error';
                resetButton();
            });
    };

    webShareTestEl.addEventListener('click', sharePage);
})();