            import.meta usage example
// Test module, which can be used as:
// 1) node test.mjs - to run the test for package
// 2) import test from 'test.mjs'; - returns the test config
export function test(meta = import.meta){
    let testConfig = new URL('./test.json', import.meta.url);

    // 1) the module is not imported, called/inserted directly
    if (import.meta.entryUrl === import.meta.url) {
        // check if some configuration was passed via script
        // e.g. <script data-testConfig={}  />
        const testConfigFromScript =
    import.meta.scriptElement.dataset.testConfig;
        if(testConfigFromScript){
            testConfig = testConfigFromScript;
        }
        // run the test
        runTest(testConfig);
    } else {// 2) the module is imported by an another one
        return testConfig;
    }
}