(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.posts').controller('blogDashboardCtrl', ['$scope', 'Post', 'Notifier', function (scope, post, notifier) {

        var channel = notifier('global');
        var sampleSize = 5;

        function selectNext() {
            scope.selectedPost = scope.posts.length > 0 ? scope.posts[0] : null;
        }

        post.all().then(function (posts) {
            scope.posts = posts;
            selectNext();
        });

        scope.deletePost = function deleteSelectedPost() {
            if (scope.selectedPost && ng.isFunction(scope.selectedPost.$remove)) {
                scope.selectedPost.$remove().then(function () {
                    var index = scope.posts.indexOf(scope.selectedPost);
                    if (index !== -1) {
                        scope.posts.splice(index, 1);
                        channel.success('post ' + scope.selectedPost.postTitle + ' has been removed');
                        selectNext();
                    }
                });
            }
        };

        scope.select = function select(post) {
            scope.selectedPost = post;
        };

        scope.loadMore = function () {
            var start = scope.posts.length;
            scope.isLoading = true;
            post.all({start: start, end: start + sampleSize}).then(function (result) {
                scope.posts = scope.posts.concat(result);
                scope.isLoading = false;
            });
        }
    }]);
})(angular);
