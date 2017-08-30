// register custom props
[
    '--worklet-border-top-color',
    '--worklet-border-right-color',
    '--worklet-border-bottom-color',
    '--worklet-border-left-color',
].forEach((name) => {
    CSS.registerProperty({
        name: name,
        syntax: '<color>+',
        inherits: false,
        initialValue: 'currentcolor',
    });
});
[
    '--worklet-border-top-width',
    '--worklet-border-right-width',
    '--worklet-border-bottom-width',
    '--worklet-border-left-width',
].forEach((name) => {
    CSS.registerProperty({
        name: name,
        syntax: '<number>',
        inherits: false,
        initialValue: '0',
    });
});

// add a paint Worklet
CSS.paintWorklet.addModule('border-colors.js');