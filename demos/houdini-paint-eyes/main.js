let paintEls = document.querySelectorAll('.cursor-follow-eyes ');
paintEls = [...paintEls];

// set origins
window.addEventListener('load', () => {
    paintEls.forEach((paintEl) => {
        const rect = paintEl.getBoundingClientRect();
        paintEl.style.setProperty('--origin-x', rect.left);
        paintEl.style.setProperty('--origin-y', rect.top);
    });
});

function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last,
        deferTimer;
    return function () {
        var context = scope || this;

        var now = +new Date,
            args = arguments;
        if (last && now < last + threshhold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                fn.apply(context, args);
            }, threshhold);
        } else {
            last = now;
            fn.apply(context, args);
        }
    };
}

window.addEventListener('mousemove', (event) => {
    const d= document.documentElement;
    const b= document.body;
    const mouseX = event.clientX+d.scrollLeft+ b.scrollLeft;
    const mouseY = event.clientY+d.scrollTop+ b.scrollTop;

    paintEls.forEach((paintEl) => {
        paintEl.style.setProperty('--mouse-x', mouseX);
        paintEl.style.setProperty('--mouse-y', mouseY);
    });
});


[
    '--origin-x',
    '--origin-y',
    '--mouse-x',
    '--mouse-y',
].forEach((name) => {
    CSS.registerProperty({
        name: name,
        syntax: '<number>',
        inherits: false,
        initialValue: '0',
    });
});

// add a paint Worklet
paintWorklet.addModule('cursor-follow-eyes.js');