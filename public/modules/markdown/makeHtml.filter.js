/**
 * This filter takes a markdown string and convert it to html. If you want to set up a binding which does not escape the result use ngBindHtml (uses Showdown)
 */
(function (ng, sd, undefined) {
    'use strict';
    ng.module('blog-it.markdown')
        .filter('makeHtml', function () {
            var converter = new sd.converter();
            return function (val) {
                return val ? converter.makeHtml(val) : '';
            };
        });
})(angular, Showdown);
