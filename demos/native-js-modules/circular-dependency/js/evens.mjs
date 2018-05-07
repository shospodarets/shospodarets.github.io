import {isOdd} from './odds.mjs';

export function nextEven(n) {
    return isOdd(n) ? n + 1 : n + 2;
}

export function isEven(n) {
    return n % 2 === 0;
}