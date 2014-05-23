(function (undefined) {
    'use strict';
    angular.module('blog-it.users')
        .factory('User', ['$http', function (http) {
            return {
                me: function me() {
                    return http.get('/api/users/me').then(function (response) {
                        return response.data;
                    });
                }
            };
        }]);
})();