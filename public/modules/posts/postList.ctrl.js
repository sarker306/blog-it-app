(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.posts')
        .controller('postListCtrl', ['$scope', 'Post', function (scope, Post) {
            Post.find().then(function (posts) {
                scope.posts = posts;
            });

            scope.loadMore = function () {
                Post.find({start: scope.posts.length}).then(function (result) {
                    scope.isLoading = false;
                    scope.posts = scope.posts.concat(result);
                });
                scope.isLoading = true;
            };
        }]);
})(angular);
