(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.posts', ['blog-it.resource', 'ngRoute', 'lrNotifier'])
        .config(['$routeProvider', function (routeProvider) {

            function findPost(route, post) {
                var postId = route.current.params.post;
                return post.findOne(postId).then(function (result) {
                    return result;
                });
            }

            routeProvider.when('/posts/:post', {
                controller: 'postCtrl',
                templateUrl: '/static/modules/posts/post.html',
                resolve: {
                    post: ['$route', 'Post', function (route, post) {
                        return findPost(route, post);
                    }]
                }
            });

            routeProvider.when('/posts/edit/:post', {
                controller: 'editPostCtrl',
                templateUrl: '/static/modules/posts/editPost.html',
                resolve: {
                    post: ['$route', '$q', 'Post', 'Security', function ($route, $q, Post, Security) {
                        return Security.getCurrentUser().then(function () {
                            return Security.isAdmin() === true ? findPost($route, Post) : $q.reject('admin rights are required');
                        });
                    }]
                }
            });

            routeProvider.when('/posts/create/new', {
                controller: 'editPostCtrl',
                templateUrl: '/static/modules/posts/editPost.html',
                resolve: {
                    post: ['$q', 'Post', 'Security', function ($q, Post, Security) {
                        return Security.getCurrentUser().then(function () {
                            return Security.isAdmin() === true ? $q.when(new Post()) : $q.reject('admin rights are required');
                        });
                    }]
                }
            });

        }]);
})(angular);
