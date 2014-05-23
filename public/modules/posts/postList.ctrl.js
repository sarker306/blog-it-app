(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.posts')
        .controller('postListCtrl', ['$scope', 'Post', function (scope, Post) {

            function query(queryObject) {
                scope.isLoading = true;
                return Post.find(queryObject).then(function (result) {
                    scope.isLoading = false;
                    return result;
                });
            }

            scope.posts = [];

            query().then(function (result) {
                scope.posts = result;
            });

            scope.loadMore = function (queryObj) {
                var queryObject = ng.extend({start: scope.posts.length}, queryObj);
                query(queryObject).then(function (result) {
                    scope.posts = scope.posts.concat(result);
                });
            };

            scope.query = query;
        }]);
})(angular);
