/**
 * module related to everything that deals with blog-post
 */

(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.posts', ['blog-it.resource', 'ngRoute', 'lrNotifier', 'ngAnimate'])
        .config(['$routeProvider', function (routeProvider) {

            function findPost(route, post) {
                var postId = route.current.params.post;
                return post.findOne(postId).then(function (result) {
                    return result;
                });
            }

            routeProvider.when('/posts', {
                controller: 'shortListCtrl',
                templateUrl: '/static/themes/default/view/blog.html'
            });

            routeProvider.when('/posts/:post', {
                controller: 'postCtrl',
                templateUrl: '/static/themes/default/view/post.html',
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
                            return Security.isAdmin() === true ? $q.when(new Post({postContent: '## This is a new post!\n\n click on the edit button to toggle the editor and start to fill this new post'})) : $q.reject('admin rights are required');
                        });
                    }]
                }
            });

        }]);
})(angular);
