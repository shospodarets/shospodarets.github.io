(function () {
    // VARS
    const logBox = document.getElementById('log-box');
    // type: output color
    const types = {
        'log': 'white',
        'warn': 'yellow',
        'error': 'red'
    };

    // save console references for future
    const old_console = {};

    Object.keys(types).forEach(function (type) {
        old_console[type] = console[type];
    });

    // Passes console.log output to html
    const log = function (type, message) {
        old_console[type].call(console, message);// show messages to developer console as previously
        message = typeof message === 'object' ? JSON.stringify(message) : message;

        logBox.innerHTML += '<span class="console-' + type + '">>> ' + message + '<span><br />';
    };

    // reassign original console methods to custom
    Object.keys(types).forEach(function (type) {
        console[type] = log.bind(null, type);
    });
}());