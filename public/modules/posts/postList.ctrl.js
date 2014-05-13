(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.posts')
        .controller('postListCtrl', ['$scope', 'Post', function (scope, Post) {

            function query(query) {
                scope.isLoading = true;
                return Post.find(query).then(function (result) {
                    scope.isLoading = false;
                    return result;
                });
            }

            query({end: 7}).then(function (result) {
                scope.posts = result;
            });

            scope.loadMore = function () {
                query({start: scope.posts.length}).then(function (result) {
                    scope.posts = scope.posts.concat(result);
                });
            };


        }]);
})(angular);
