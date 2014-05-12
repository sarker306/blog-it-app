(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.security')
        .controller('loginCtrl', ['$scope', 'Security', 'Notifier', function (scope, Security, notifier) {

            var channel = notifier('global');

            scope.credentials = {};

            scope.submit = function submit() {
                Security.login(scope.credentials.email, scope.credentials.password).then(function () {
                    channel.success('login successful!');
                }, function () {
                    channel.error('authentication failed, please check your credentials');
                });
            };
        }]);
})(angular);
