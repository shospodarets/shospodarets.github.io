const componentLoadingClass = "component-loading";
const componentEl = document.querySelector(".component");
const usernameEl = componentEl.querySelector("#username");
const reponameEl = componentEl.querySelector("#reponame");
const formEl = componentEl.querySelector("form");
const starsNumberEl = componentEl.querySelector(".stars-number");
const componentTitleEl = componentEl.querySelector(".component-title");

componentTitleEl.innerHTML = document.title;

// ANIMATION
function startLoadingAnimation() {
    componentEl.classList.add(componentLoadingClass);
}

function stopLoadingAnimation() {
    componentEl.classList.remove(componentLoadingClass);
}