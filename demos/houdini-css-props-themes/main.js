(() => {
    /**
     * Listen base color change and assign global CSS variables from it
     */

    const baseColorTransitionEl = document.querySelector('.absolute-hidden');

    function assignGlobalProp(name, value) {
        document.documentElement.style.setProperty(`--main-${name}`, value);
        document.documentElement.style.setProperty(`--is-in-light-half-${name}`, value > 126 ? 1 : -1);
    }

    baseColorTransitionEl.addEventListener("transitionend", function () {
        const baseColor = getComputedStyle(baseColorTransitionEl).backgroundColor;
        // expected color is rgb(r,g,b) or rgba(r,g,b,a)
        const rgbaArr = baseColor.split('(')[1].split(')')[0].split(',');

        assignGlobalProp('r', Number(rgbaArr[0]));
        assignGlobalProp('g', Number(rgbaArr[1]));
        assignGlobalProp('b', Number(rgbaArr[2]));
    });

    // OPTIONS
    const options = {};

    let optionEls = document.querySelectorAll('.options input');
    optionEls = [...optionEls];

    optionEls.forEach((optionEl) => {
        // use DOM classes as option names
        const optionName = optionEl.className;

        // INIT
        // checkbox state from localStorage
        const optionEnabled = localStorage[optionName] === 'true';
        optionEl.checked = optionEnabled;
        // option value
        options[optionName] = optionEnabled;

        // EVENTS
        optionEl.addEventListener('change', () => {
            localStorage[optionName] = optionEl.checked;
            window.location.reload();
        });
    });

    // AUTOCHANGER
    if (options.autochanger) {
        function autochangeProperty(propName) {
            let propValue = Number(getComputedStyle(document.documentElement).getPropertyValue(`--main-${propName}`).trim());
            let propIncrease = true;// indicates to increase or decrease in the next iteration

            setInterval(() => {
                if (propValue === 255) { /// boundaries
                    propIncrease = false;
                } else if (propValue === 0) {
                    propIncrease = true;
                }

                if (propIncrease) {
                    propValue++;
                } else {
                    propValue--;
                }

                assignGlobalProp(propName, propValue);
            }, 10);
        }

        autochangeProperty('r');
        autochangeProperty('g');
        autochangeProperty('b');
    }

    // OPTIMIZATIONS
    // register CSS variables types to improve performance
    if (options.optimizer) {
        ['--main-r', '--main-g', '--main-b'].forEach((name) => {
            CSS.registerProperty({
                name,
                syntax: '<number>',
                initialValue: 255
            })
        });

        ['--is-in-light-half-r', '--is-in-light-half-g', '--is-in-light-half-b'].forEach((name) => {
            CSS.registerProperty({
                name,
                syntax: '<number>',
                initialValue: 1
            });
        });
    }
})();