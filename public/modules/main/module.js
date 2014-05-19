(function (ng, undefined) {
    'use strict';
    var baseUrl = '/api/';
    ng.module('blog-it.main', [
        'ngRoute',
        'ngAnimate',
        'blog-it.resource',
        'blog-it.posts',
        'blog-it.markdown',
        'blog-it.dashboard',
        'lrInfiniteScroll'
    ])
        .constant('baseUrl', baseUrl)
        .config(['CRUDResourceProvider', '$routeProvider', '$locationProvider', function (resourceProvider, routeProvider, locationProvider) {
            routeProvider.when('/', {templateUrl: '/static/view/blog.html', controller: 'postListCtrl'});
            routeProvider.when('/about', {templateUrl: '/static/view/about.html'});
            routeProvider.otherwise({redirect: '/'});
            locationProvider.html5Mode(true);
            resourceProvider.setDefaultConfig({baseUrl: baseUrl})
        }])
        .directive('lrStopPropagation', function () {
            return {
                link: function (scope, element, attr) {
                    var event = attr.lrStopPropagation;
                    if (event) {
                        element.bind(event, function (e) {
                            e.stopPropagation();
                            e.preventDefault();
                        });
                    }
                }
            }
        });
})(angular);
