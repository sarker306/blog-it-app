(function (ng, sd, undefined) {
    'use strict';
    ng.module('blog-it.markdown')
        .filter('makeHtml', function () {
            var converter = new sd.converter();
            return function (val) {
                return val ? converter.makeHtml(val) : '';
            }
        });
})(angular, Showdown);
