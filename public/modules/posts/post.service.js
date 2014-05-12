(function (ng) {
    'use strict';
    var module = ng.module('blog-it.posts');
    module.factory('Post', ['CRUDResource', '$http', function (resource, http) {
        var service = resource({allUrl: 'posts'});
        service.tagList = function () {
            return http.get('/api/posts/tags/all').then(function (result) {
                return result.data;
            });
        };
        return  service;
    }]);
})(angular);