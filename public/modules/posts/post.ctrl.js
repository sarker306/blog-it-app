/**
 * controller when reading a single post
 */
(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.posts')
        .controller('postCtrl', ['$scope', 'post', function (scope, post) {
            scope.post = post;
        }]);
})(angular);
