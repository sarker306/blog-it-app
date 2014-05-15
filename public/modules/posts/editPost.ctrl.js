(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.posts')
        .controller('editPostCtrl', ['$scope', 'post', 'lrNotifier', '$location', 'Markdown', function (scope, post, notifier, location, markdown) {
            var channel = notifier('global');

            scope.post = post;
            scope.isEditorOpen = false;

            scope.toggleEditor = function () {
                scope.isEditorOpen = !scope.isEditorOpen;
            };

            scope.saveContent = function (content) {
                scope.post.postContent = content;
                scope.isEditorOpen = false;
                channel.info('the post content has been updated');
            };

            scope.savePost = function savePost() {
                scope.post.$save().then(function () {
                    channel.success('the post has been saved successfully');
                    if (scope.post._id === undefined) {
                        location.path('/blog/admin');
                    } else {
                        markdown.set(scope.post._id, scope.post.postContent);
                    }
                }, function (response) {
                    channel.error(response);
                });
            };
        }]);
})(angular);
