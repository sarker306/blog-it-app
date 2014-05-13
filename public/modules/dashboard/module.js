(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.dashboard', ['blog-it.posts', 'blog-it.security', 'ngRoute']).config(function ($routeProvider) {
        $routeProvider.when('/dashboard', {
            templateUrl: '/static/modules/dashboard/dashboard.html',
            controller: 'dashboardCtrl'
        });
    });
})(angular);
