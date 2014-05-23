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
