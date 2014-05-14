(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.main')
        .controller('mainCtrl', ['$rootScope', '$location', function (scope, location) {
            scope.name = 'Blog IT';

            scope.$on('$routeChangeError', function (event, current, previous, rejection) {

                console.log(current);

                if (rejection.code === 403) {
                    location.path('/login').search({red: current.$$route.originalPath.replace('/', '')});
                }
            });
        }]);
})(angular);
