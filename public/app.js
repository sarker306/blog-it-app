/**
 * entry point of the angular application
 */
(function (ng, undefined) {
    'use strict';
    ng.module('app', [
        'blog-it.main',
        'blog-it.partials'
    ]);
})(angular);
