function setProp(prop, value) {
    document.documentElement.style.setProperty('--' + prop, Number(value));
}

var inputs = document.querySelectorAll('input[type="range"]');
var inputsArr = Array.prototype.slice.call(inputs);

inputsArr.forEach(function (input) {
    input.addEventListener('input', function (e) {
        setProp(e.target.name, e.target.value);
    });

    setProp(input.name, input.value);// init values
});