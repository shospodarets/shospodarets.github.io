describe('module script', () => {
    const moduleScript = wrapper.find('script[type=module]');

    function listenScriptLoad(script) {
        return new Promise((success, error) => {
            script.onload = success;
            script.onerror = error;
            script.onabort = error;
        });
    }

    it('is loaded without errors', (done) => {
        listenScriptLoad(moduleScript)
            .then(() => {
                // TESTS SHOULD BE EITHER DEFERRED
                // or RAN HERE, WHEN MODULE SCRIPT IS LOADED
                done();
            })
            .catch((err) => {
                console.error('script load error', err);
                done(err);
            });
    });
});