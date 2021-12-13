"use strict";
const n = parseInt(process.argv[2]);

process.send(fibo(n));


function fibo(n){
    if (n <= 1) {
        return n;
    } else {
        return fibo(n - 1) + fibo(n - 2);
    }
}