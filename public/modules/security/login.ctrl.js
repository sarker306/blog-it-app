(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.security')
        .controller('loginCtrl', ['$scope', 'Security', 'lrNotifier', '$location', function (scope, Security, notifier, location) {

            var channel = notifier('global');

            scope.credentials = {};

            scope.submit = function submit() {
                Security.login(scope.credentials.email, scope.credentials.password).then(function () {
                    var redirect = location.search().red || '';
                    channel.success('login successful!');
                    location.path('/' + redirect).search({});
                }, function () {
                    channel.error('authentication failed, please check your credentials');
                });
            };
        }]);
})(angular);
