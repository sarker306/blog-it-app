/**
 * service used to perform http calls related to the post collection
 *
 * refer to blog-it.resources for more information
 */
(function (ng) {
    'use strict';
    var module = ng.module('blog-it.posts');
    module.factory('Post', ['CRUDResource', '$http', function (resource, http) {
        var service = resource({allUrl: 'posts'});

        /**
         * added method on the service to fetch the list of available tags
         * @returns {*}
         */
        service.tagList = function () {
            return http.get('/api/posts/tags/all').then(function (result) {
                return result.data;
            });
        };
        return  service;
    }]);
})(angular);