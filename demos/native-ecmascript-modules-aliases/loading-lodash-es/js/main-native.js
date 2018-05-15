console.log('----- Native JavaScript modules -----');

import _ from '/demos/native-ecmascript-modules-aliases/dist_node_modules/lodash-es/lodash.js';

console.log(`lodash version: ${_.VERSION}`); // e.g. 4.17.4

import map from '/demos/native-ecmascript-modules-aliases/dist_node_modules/lodash-es/map.js';

console.log(
    map([
        {'user': 'barney'},
        {'user': 'fred'}
    ], 'user')
); // ['barney', 'fred']

console.timeEnd('Executing of lodash-es (640 native JS modules):');