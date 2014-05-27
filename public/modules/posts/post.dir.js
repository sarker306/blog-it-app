/**
 * directive to avoid repetition in markup when dealing with blog post(some sort of placeholder)
 */
(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.posts').directive('blotItPost', function () {
        return {
            replace: true,
            templateUrl: '/static/themes/default/view/post.html',
            scope: {post: '='}
        };
    });
})(angular);
