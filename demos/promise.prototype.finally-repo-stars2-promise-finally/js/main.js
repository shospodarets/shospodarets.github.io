// HELPERS
function getStarsNumber(username, reponame) {
    startLoadingAnimation();

    return fetch(`https://api.github.com/repos/${username}/${reponame}`)
        .then(res => res.json())
        .then(data => data.stargazers_count)
        .catch(() => `Couldn't get the stars number`)
        .finally(stopLoadingAnimation);
}

// EVENTS
formEl.addEventListener("submit", e => {
    e.preventDefault();

    starsNumberEl.innerHTML = "";

    getStarsNumber(usernameEl.value, reponameEl.value)
        .then((starsNumber) => {
            starsNumberEl.innerHTML = starsNumber;
        });
});
