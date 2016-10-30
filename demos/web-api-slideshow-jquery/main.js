/*** VARS ***/
const slides = Array.from(document.querySelectorAll('.images > *'));
const switchersWrapper = document.querySelector('.switchers');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

const ACTIVE_CLASS = 'active';
const LAST_SLIDES_NUMBER = slides.length - 1;
const CHANGE_INTERVAL = 3000;// ms
const CHANGE_SPEED = 600;// ms

const switchers = [];
let activeNumber = 0;
let currentInterval = NaN;

const ANIMATION = 'web-animations'; // 'jquery'|'web-animations'

/*** IMAGES ***/
function hideImages() {
    slides.forEach((slide) => {
        slide.style.display = 'none';
    });
}

function showImage(slideNumber) {
    const currentSlide = slides[slideNumber];

    switch (ANIMATION) {
        case 'web-animations': {
            currentSlide.style.display = '';
            currentSlide.animate([
                {opacity: 0},
                {opacity: 1}
            ], {
                // timing options
                duration: CHANGE_SPEED,
                easing: 'linear',
                fill: 'forwards'
            });
            break;
        }
        case 'jquery': {
            $(currentSlide)
                .show()
                .css({
                    opacity: 0
                })
                .animate({
                    opacity: 1
                }, {
                    duration: CHANGE_SPEED,
                    easing: 'linear'
                });
            break;
        }
    }
}

function hideImage(slideNumber) {
    const currentSlide = slides[slideNumber];

    switch (ANIMATION) {
        case 'web-animations': {
            currentSlide.animate([
                {opacity: currentSlide.style.opacity},
                {opacity: 0}
            ], {
                // timing options
                duration: CHANGE_SPEED,
                easing: 'linear',
                fill: 'forwards'
            }).finished.then(() => {
                currentSlide.style.display = 'none';
            });
            break;
        }
        case 'jquery': {
            $(currentSlide)
                .animate({
                    opacity: 0
                }, {
                    duration: CHANGE_SPEED,
                    easing: 'linear',
                    complete: () => {
                        $(currentSlide).hide();
                    }
                });
            break;
        }
    }
}

/*** SWITCHERS ***/
function fillSwitchers() {
    slides.forEach(() => {
        const switcher = document.createElement('div');
        switchersWrapper.appendChild(switcher);
        switchers.push(switcher);
    });
}

function activateSwitcher(slideNumber) {
    switchers[slideNumber].classList.add(ACTIVE_CLASS);
}

function resetSwitcher(slideNumber) {
    switchers[slideNumber].classList.remove(ACTIVE_CLASS);
}

/*** SLIDES (COMMON) ***/
function resetSlide(slideNumber) {
    resetSwitcher(slideNumber);
    hideImage(slideNumber);
}

function activateSlide(slideNumber) {
    activeNumber = slideNumber;

    // check the ranges
    if (activeNumber > LAST_SLIDES_NUMBER) {
        activeNumber = 0;
    } else if (activeNumber < 0) {
        activeNumber = LAST_SLIDES_NUMBER;
    }


    showImage(activeNumber);
    activateSwitcher(activeNumber);
}

function jumpToSlide(slideNumber) {
    resetSlide(activeNumber);
    activateSlide(slideNumber);
}

/*** EVENT LISTENERS ***/

/**
 * On click auto slider is stopped
 * after the jump function to the next slide is invoked
 * then auto slider is restarted
 */
function onClickJumpTo(slideNumber) {
    stopAutoplay();
    jumpToSlide(slideNumber);
    resetAutoplay();
}

function addEventListeners() {
    // buttons
    prevBtn.addEventListener('click', () => {
        onClickJumpTo(activeNumber - 1);
    });

    nextBtn.addEventListener('click', () => {
        onClickJumpTo(activeNumber + 1);
    });

    // switchers
    switchers.forEach((switcher, i) => {
        switcher.addEventListener('click', () => {
            onClickJumpTo(i);
        });
    });
}

/*** AUTO INTERVAL ***/
function stopAutoplay() {
    clearInterval(currentInterval);
}

function resetAutoplay() {
    currentInterval = setInterval(() => {
        jumpToSlide(activeNumber + 1);// activate next slides
    }, CHANGE_INTERVAL);
}


/*** INIT ***/
// COMMON INIT
hideImages();
fillSwitchers();

// SLIDES
activateSlide(activeNumber);

// EVENT LISTENERS
addEventListeners();

// AUTOPLAY
resetAutoplay();