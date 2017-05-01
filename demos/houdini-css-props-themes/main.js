(() => {
    /**
     * Listen base color change and assign global CSS variables from it
     */

    function assignGlobalProp(name, value) {
        document.documentElement.style.setProperty(`--main-${name}`, value);
        document.documentElement.style.setProperty(`--is-in-light-half-${name}`, value > 126 ? 1 : -1);
    }

    const baseColorInput = document.querySelector('.base-color');

    baseColorInput.addEventListener("input", function () {
        changeMainColors(baseColorInput.value);
    });


    function changeMainColors(baseColorHex) {
        // expected color is rgb(r,g,b) or rgba(r,g,b,a)
        const r = parseInt(baseColorHex.substring(1, 3), 16);
        const g = parseInt(baseColorHex.substring(3, 5), 16);
        const b = parseInt(baseColorHex.substring(5, 7), 16);

        assignGlobalProp('r', r);
        assignGlobalProp('g', g);
        assignGlobalProp('b', b);
    }

    // INIT
    changeMainColors(baseColorInput.value);

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