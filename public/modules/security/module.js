(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.security', ['blog-it.users', 'lrNotifier', 'ngRoute']).config(function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: '/static/modules/security/login.html',
            controller: 'loginCtrl'
        });
    });


})(angular);
