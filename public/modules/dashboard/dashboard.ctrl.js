(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.dashboard')
        .controller('dashboardCtrl', ['$scope', 'user', function (scope, user) {

            scope.user = user;

            scope.selectPost = function (post) {
                scope.selectedPost = post;
            };
        }]);
})(angular);
