(function () {
    // VARS
    const currentScript = document.currentScript;

    const esModulesSupportedClass = 'esmodules';
    const esModulesNotSupportedClass = 'no-esmodules';
    const isAddGlobalClassSet = currentScript.hasAttribute('add-global-class');

    // METHODS
    function checkJsModulesSupport() {
        // create an empty ES module
        const scriptAsBlob = new Blob([''], {
            type: 'application/javascript'
        });
        const srcObjectURL = URL.createObjectURL(scriptAsBlob);

        // insert the ES module and listen events on it
        const script = document.createElement('script');
        script.type = 'module';
        document.head.appendChild(script);

        // return the loading script Promise
        return new Promise((resolve, reject) => {
            // HELPERS
            let isFulfilled = false;

            function triggerResolve() {
                if (isFulfilled) return;
                isFulfilled = true;

                resolve();
                onFulfill();
            }

            function triggerReject() {
                if (isFulfilled) return;
                isFulfilled = true;

                reject();
                onFulfill();
            }

            function onFulfill() {
                // cleaning
                URL.revokeObjectURL(srcObjectURL);
                script.parentNode.removeChild(script)
            }

            // EVENTS
            script.onload = triggerResolve;
            script.onerror = triggerReject;
            setTimeout(triggerReject, 300); // reject on timeout

            // start loading the script
            script.src = srcObjectURL;
        });
    }

    function insertJs({src, isModule, async, defer}) {
        const script = document.createElement('script');

        if (isModule) {
            script.type = 'module';
        } else {
            script.type = 'application/javascript';
        }

        if (async) {
            script.setAttribute('async', '');
        }
        if (defer) {
            script.setAttribute('defer', '');
        }

        document.head.appendChild(script);

        return new Promise((success, error) => {
            script.onload = success;
            script.onerror = error;
            script.src = src;// start loading the script
        });
    }

    // INIT
    checkJsModulesSupport().then(
        () => {
            insertJs({
                src: currentScript.getAttribute('es'),
                isModule: true
            });
            if (isAddGlobalClassSet) {
                document.documentElement.classList.add(esModulesSupportedClass);
            }
        },
        () => {
            insertJs({
                src: currentScript.getAttribute('js')
            });

            if (isAddGlobalClassSet) {
                document.documentElement.classList.add(esModulesNotSupportedClass);
            }
        }
    );
}());