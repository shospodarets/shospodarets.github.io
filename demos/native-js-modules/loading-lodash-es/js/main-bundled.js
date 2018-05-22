console.log('----- Bundled JavaScript modules -----');

import _ from 'lodash';

console.log(`lodash version: ${_.VERSION}`); // e.g. 4.17.4

import map from 'lodash/map';

console.log(
    map([
        {'user': 'barney'},
        {'user': 'fred'}
    ], 'user')
); // ['barney', 'fred']

console.timeEnd('Executing of 1 bundled JS file:');