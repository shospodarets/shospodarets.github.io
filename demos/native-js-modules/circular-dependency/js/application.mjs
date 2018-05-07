// https://github.com/esnext/es6-module-transpiler/tree/master/test/examples/cycles-immediate
// https://github.com/babel/babel/issues/30

import {nextEven, isEven} from './evens.mjs';
import {nextOdd, isOdd} from './odds.mjs';

// "true" output is expected for all the following
console.log(nextEven(1) === 2);
console.log(nextOdd(1) === 3);
console.log(isOdd(1));
console.log(!isOdd(0));
console.log(isEven(0));
console.log(!isEven(1));