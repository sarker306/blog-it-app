(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.main')
        .controller('mainCtrl', ['$scope', function (scope) {
            scope.name = 'Blog IT';
        }]);
})(angular);
