"use strict";

var utl = {} || utl;

utl.sortBy = (array, filter) => {

    let f = filter ? filter : (a, b) => {
        return a === b;
    };

    if(array.length === 0) return [];

    let first = array[0];

    let indexed = array.filter((e) => {
        return f(e, first);
    });

    let unindexed = array.filter((e) => {
        return !f(e, first);
    });

    return [indexed].concat(utl.sortBy(unindexed, filter));
};