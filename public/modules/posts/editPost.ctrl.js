/**
 * controller used when editing/creating a post
 */
(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.posts')
        .controller('editPostCtrl', ['$scope', 'post', 'lrNotifier', '$location', 'Markdown', function (scope, post, notifier, location, markdown) {
            var channel = notifier('global');

            scope.post = post;
            scope.isEditorOpen = false;

            /**
             * open/close the markdown editor
             */
            scope.toggleEditor = function () {
                scope.isEditorOpen = !scope.isEditorOpen;
            };

            /**
             * update/save the post
             */
            scope.savePost = function savePost() {
                scope.post.$save().then(function () {
                    channel.success('the post has been saved successfully');
                    scope.post._id === undefined ? location.path('/dashboard')
                        : markdown.set(scope.post._id, scope.post.postContent);
                }, function (response) {
                    channel.error(response);
                });
            };
        }]);
})(angular);
