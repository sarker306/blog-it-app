/**
 * controller to handle a list of posts, a good base to extend for creating richer mixin.
 * see blog-it.dashboard#dashboardCtrl for example
 */

(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.posts')
        .controller('postListCtrl', ['$scope', 'Post', function (scope, Post) {

            /**
             * fetch a list of posts based on query parameters
             * @param queryObject an object to hold the query parameters
             * example : {start:2, end:7, tag:'blog'}
             * @returns {Promise} which should resolve with the post list corresponding to the query
             */
            function query(queryObject) {
                scope.isLoading = true;
                return Post.find(queryObject).then(function (result) {
                    scope.isLoading = false;
                    return result;
                });
            }

            scope.posts = [];

            query().then(function (result) {
                scope.posts = result;
            });

            /**
             * load more posts of the list and add them to the current list of posts
             * @param queryObj
             */
            scope.loadMore = function (queryObj) {
                var queryObject = ng.extend({start: scope.posts.length}, queryObj);
                query(queryObject).then(function (result) {
                    scope.posts = scope.posts.concat(result);
                });
            };

            scope.query = query;
        }]);
})(angular);
