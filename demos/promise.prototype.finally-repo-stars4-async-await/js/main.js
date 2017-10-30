// HELPERS
async function getStarsNumber(username, reponame) {
    try {
        startLoadingAnimation();

        const res = await fetch(`https://api.github.com/repos/${username}/${reponame}`);
        const data = await res.json();
        return data.stargazers_count;
    } catch (err) {
        return `Couldn't get the stars number`;
    } finally {
        stopLoadingAnimation();
    }
}

// EVENTS
formEl.addEventListener("submit", async function (e) {
    e.preventDefault();

    starsNumberEl.innerHTML = "";

    starsNumberEl.innerHTML = await getStarsNumber(usernameEl.value, reponameEl.value);
});