(function (ng, undefined) {
    'use strict';
    var baseUrl = '/api/';
    ng.module('blog-it.main', [
        'ngRoute',
        'blog-it.resource',
        'blog-it.posts',
        'blog-it.markdown'
    ])
        .constant('baseUrl', baseUrl)
        .config(['CRUDResourceProvider', '$routeProvider', '$locationProvider', function (resourceProvider, routeProvider, locationProvider) {
            routeProvider.when('/', {templateUrl: '/static/view/home.html', controller: 'postListCtrl'});
            routeProvider.when('/about', {templateUrl: '/static/view/about.html'});
            routeProvider.otherwise({redirect: '/'});
            locationProvider.html5Mode(true);
            resourceProvider.setDefaultConfig({baseUrl: baseUrl})
        }]);
})(angular);
