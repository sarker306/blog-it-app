/**
 * service is charge of the http calls related to the users collection
 */
(function (undefined) {
    'use strict';
    angular.module('blog-it.users')
        .factory('User', ['$http', function (http) {
            return {
                /**
                 *return the user related to the current cookie session
                 * @returns {Promise} a promise which should resolve with the user
                 */
                me: function me() {
                    return http.get('/api/users/me').then(function (response) {
                        return response.data;
                    });
                }
            };
        }]);
})();