import {isEven} from './evens.mjs';

export function nextOdd(n) {
    return isEven(n) ? n + 1 : n + 2;
}

export function isOdd(n) {
    return !isEven(n);
}