const componentLoadingClass = "component-loading";
const componentEl = document.querySelector(".component");
const usernameEl = componentEl.querySelector("#username");
const reponameEl = componentEl.querySelector("#reponame");
const formEl = componentEl.querySelector("form");
const starsNumberEl = componentEl.querySelector(".stars-number");

function startLoadingAnimation() {
    componentEl.classList.add(componentLoadingClass);
}

function stopLoadingAnimation() {
    componentEl.classList.remove(componentLoadingClass);
}

// HELPERS

// EVENTS
formEl.addEventListener("submit", async function (e) {
    e.preventDefault();

    starsNumberEl.innerHTML = "";
    startLoadingAnimation();

    try {
        const starsNumber = await fetch(
            `https://api.github.com/repos/${usernameEl.value}/${reponameEl.value}`
        )
            .then(res => res.json())
            .then(data => data.stargazers_count);

        starsNumberEl.innerHTML = starsNumber;
    } catch (err) {
        starsNumberEl.innerHTML = "Couldn't get the stars number";
    } finally {
        stopLoadingAnimation();
    }
});