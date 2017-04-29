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

    // register CSS variables types to improve performance
    const optimizationOn = true;
    if (optimizationOn) {
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

    // auto changer
    const autochangerOn = false;
    if (autochangerOn) {
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
})();