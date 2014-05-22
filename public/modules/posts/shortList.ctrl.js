(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.posts')
        .controller('shortListCtrl', ['$scope', 'Post', '$location', '$controller', function (scope, post, location, controller) {
            var query = location.search();

            ng.extend(this, controller('postListCtrl', {$scope: scope, Post: post}));

            scope.query(query).then(function (result) {
                scope.posts = result;
            });

            scope.loadMore = ng.bind(this, scope.loadMore, query);
        }]);
})(angular);