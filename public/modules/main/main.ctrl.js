(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.main')
        .controller('mainCtrl', ['$rootScope', '$location', 'Post', function (scope, location, post) {

            scope.name = 'Blog IT';

            post.tagList().then(function (tags) {
                scope.tags = tags;
            });

            scope.$on('$routeChangeError', function (event, current, previous, rejection) {

                console.log(current);

                if (rejection.code === 403) {
                    location.path('/login').search({red: current.$$route.originalPath.replace('/', '')});
                }
            });
        }]);
})(angular);
