/**
 * dashboard controller (mixin with blog-it.posts#postListCtrl)
 */
(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.dashboard')
        .controller('dashboardCtrl', ['$scope', 'Post', 'user', '$controller', 'lrNotifier', function (scope, post, user, controller, notifier) {

            var channel = notifier('dashboard');

            ng.extend(this, controller('postListCtrl', {$scope: scope, Post: post}));

            scope.user = user;

            /**
             * select a post in the dashboard
             * @param post post to select
             */
            scope.selectPost = function (post) {
                scope.selectedPost = post;
            };

            /**
             * remove a post (permanently ie call backend)
             * @param post the post to remove
             */
            scope.removePost = function (post) {
                var index = scope.posts.indexOf(post);
                if (index !== -1) {
                    post.$remove().then(function () {
                        scope.posts.splice(index, 1);
                        if (scope.selectedPost === post) {
                            scope.selectedPost = undefined;
                        }
                        channel.success('post has been removed');
                    });
                }
            };
        }]);
})(angular);
