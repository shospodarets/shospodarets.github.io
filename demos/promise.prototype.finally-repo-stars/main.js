const componentLoadingClass = "loading";
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
formEl.addEventListener("submit", e => {
    e.preventDefault();

    starsNumberEl.innerHTML = "";
    startLoadingAnimation();

    fetch(`https://api.github.com/repos/${usernameEl.value}/${reponameEl.value}`)
        .then(res => res.json())
        .then(data => {
            starsNumberEl.innerHTML = data.stargazers_count;
        })
        .finally(stopLoadingAnimation);
});
