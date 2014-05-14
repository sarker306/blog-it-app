(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.security')
        .factory('Security', ['User', '$http', '$q', function (User, http, q) {

            var currentUser;

            function fetchUser() {
                return User.me().then(function (result) {
                    currentUser = result;
                });
            }

            fetchUser();

            function isAdmin() {
                if (currentUser === undefined) {
                    return false;
                }
                return currentUser.profile === 'admin';
            }

            function login(email, password) {
                return http.post('/api/login/local', {email: email, password: password}).then(function (response) {
                    currentUser = response.data;
                });
            }

            function getCurrentUser() {
                return currentUser === undefined ? fetchUser().then(function () {
                    return currentUser;
                }) : q.when(currentUser);

            }

            return {
                isAdmin: isAdmin,
                login: login,
                getCurrentUser: getCurrentUser
            };
        }]);
})(angular);
