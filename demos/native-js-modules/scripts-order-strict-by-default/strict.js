"use strict"; // isn't needed, applied by default

function checkforthis(){
    console.log(this); //will print undefined.
}

// Throw exceptions for the following

a = 12; // prevent uncontrolled global variables

function print(value, value) {} // duplicate params

const eval = function evil(){}; // in non-strict is overwritten