console.log('first in the code');

forEach(['for', 'each'],
    (val) => console.log(val));

import forEach
    from './node_modules/lodash-es/forEach.js';

import './js/console.log("second-import").js';

import './js/vendor/fetch-polyfill.js';

// will have fetch polyfilled
import './js/import-uses-fetch.js';

console.log('last in the code');


/*
if (!self.fetch) {
    // error, module won't be executed at all
    // 'import' and 'export' may only appear
    // at the top level
    import './vendor/fetch-polyfill.js';
}
*/