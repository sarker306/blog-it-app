/**
 * module related to the user dashboard
 */
(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.dashboard', ['blog-it.posts', 'blog-it.security', 'ngRoute', 'lrNotifier'])
        .config(function ($routeProvider) {

            $routeProvider.when('/dashboard', {
                templateUrl: '/static/modules/dashboard/dashboard.html',
                controller: 'dashboardCtrl',
                resolve: {
                    user: ['$route', '$q', 'Security', function ($route, $q, Security) {
                        return Security.getCurrentUser().then(function (user) {
                            return Security.isAdmin() === true ? $q.when(user) : $q.reject({code: 403});
                        });
                    }]
                }
            });
        });
})(angular);
