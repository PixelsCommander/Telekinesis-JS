/**
 * Initialization of namespace
 * @namespace tsjs
 */


//Creating window.kraken namespace if we are not in Node JS module
if (typeof exports === 'undefined') {
    this.tsjs = {};
} else {
    exports.gameClasses = {};
}