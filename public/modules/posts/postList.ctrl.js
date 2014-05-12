(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.posts')
        .controller('postListCtrl', ['$scope', 'Post', function (scope, Post) {
            Post.find().then(function (posts) {
                scope.posts=posts;
            });
        }]);
})(angular);
