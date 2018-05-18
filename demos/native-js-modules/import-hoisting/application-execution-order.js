// 1. 'imports' are hoisted
// 2. 'imports' are executed in oder
// 3. 'imports'/'exports'
//    can be used only at top level

import forEach
    from './node_modules/lodash-es/forEach.js';

import './js/console.log("second-import").js';

import './js/vendor/fetch-polyfill.js';

// will have fetch polyfilled
import './js/import-uses-fetch.js';

console.log('first in the code');

forEach(['for', 'each'],
    (val) => console.log(val));

console.log('last in the code');