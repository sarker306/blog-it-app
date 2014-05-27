/**
 * service to help with security matters
 */
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

            /**
             * tells whether the user has admin role
             * @returns {boolean} true if user has admin role
             */
            function isAdmin() {
                if (currentUser === undefined) {
                    return false;
                }
                return currentUser.profile === 'admin';
            }

            /**
             * try to log in base on (email, password) tuple
             * @param email the user email
             * @param password the user password
             * @returns {Promise} which should resolve with a user if the login is successful
             */
            function login(email, password) {
                return http.post('/api/login/local', {email: email, password: password}).then(function (response) {
                    currentUser = response.data;
                });
            }

            /**
             * get the user related with the current cookie session
             * @returns {Promise} which should resolve with the user related to the current cookie session
             */
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
