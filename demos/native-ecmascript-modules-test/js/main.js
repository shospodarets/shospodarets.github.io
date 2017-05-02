var dynamicImportSupported = false;
try {
    Function('import("")');
    dynamicImportSupported = true;
} catch (err) {
}

if (dynamicImportSupported) {
    document.body.classList.add('dynamic-supported-yes');
} else {
    document.body.classList.add('dynamic-supported-no');
}