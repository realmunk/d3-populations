"use strict";

var utl = {} || utl;

utl.sortBy = function (array, filter) {

    let f = filter ? filter : function (a, b) {
        return a === b;
    };

    if(array.length === 0) return [];

    let first = array[0];

    let indexed = array.filter(function (e) {
        return f(e, first);
    });

    let unindexed = array.filter(function (e) {
        return !f(e, first);
    });

    return [indexed].concat(utl.sortBy(unindexed, filter));
};

utl.translate = function (x, y) {
    return 'translate(' + x + ', ' + y + ')';
}