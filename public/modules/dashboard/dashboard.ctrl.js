(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.dashboard')
        .controller('dashboardCtrl', ['$scope', function (scope) {
            scope.selectPost = function (post) {
                scope.selectedPost = post;
            };
        }]);
})(angular);
