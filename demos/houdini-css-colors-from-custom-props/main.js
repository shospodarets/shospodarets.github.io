function setProp(prop, value) {
    document.documentElement.style.setProperty('--' + prop, Number(value));
}

const inputs = document.querySelectorAll('input[type="range"]');
const inputsArr = Array.prototype.slice.call(inputs);

inputsArr.forEach(function (input) {
    input.addEventListener('input', function (e) {
        setProp(e.target.name, e.target.value);
    });

    setProp(input.name, input.value);// init values
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
    let isValueGrowth = true; //boolean to indicate to add or minus the value

    const firstInput = inputsArr[0];

    setInterval(() => {
        const value = Number(firstInput.value);

        if (value === 255) {
            isValueGrowth = false;
        } else if (value === 0) {
            isValueGrowth = true;
        }

        if (isValueGrowth) {
            firstInput.value = value + 1;
        } else {
            firstInput.value = value - 1;
        }

        // trigger onchange
        const evt = document.createEvent("HTMLEvents");
        evt.initEvent("input", false, true);
        firstInput.dispatchEvent(evt);
    }, 5);
}

// OPTIMIZATIONS
if (options.optimizer) {
    // register props
    CSS.registerProperty({
        name: '--r',
        syntax: '<number>',
        initialValue: 0
    });

    CSS.registerProperty({
        name: '--g',
        syntax: '<number>',
        initialValue: 0
    });

    CSS.registerProperty({
        name: '--b',
        syntax: '<number>',
        initialValue: 0
    });
}