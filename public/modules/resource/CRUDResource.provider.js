(function (ng) {
    'use strict';
    ng.module('blog-it.resource').provider('CRUDResource', function () {

        var defaultConfig = {
            baseUrl: '/api/',
            allUrl: ''
        };

        this.setDefaultConfig = function (conf) {
            ng.extend(defaultConfig, conf);
        };

        this.$get = ['$http', '$cacheFactory', function (http, cacheFactory) {

            function invalidateCache() {
                var httpCache = cacheFactory.get('$http');
                httpCache.removeAll();
            }

            return function (overwriteConfig) {

                var config = {};
                ng.copy(defaultConfig, config);
                ng.extend(config, overwriteConfig);

                function Resource(data) {
                    ng.extend(this, data);
                }

                Resource.find = function find(params) {
                    var conf = {cache: true};
                    if (params) {
                        conf.params = params;
                    }
                    return http.get(config.baseUrl + config.allUrl, conf).then(function (response) {
                        var collection = [];
                        ng.forEach(response.data, function (value, key) {
                            collection.push(new Resource(value));
                        });
                        return collection;
                    });
                };

                Resource.findOne = function findOne(resourceId) {
                    return http.get(config.baseUrl + config.allUrl + '/' + resourceId, {cache: true}).then(function (response) {
                        return new Resource(response.data);
                    });
                };

                Resource.new = function addNewResource(resourceData) {
                    return http.post(config.baseUrl + config.allUrl, resourceData).then(function (response) {
                        invalidateCache();
                        return new Resource(response.data);
                    });
                };

                Resource.update = function (resource) {
                    return http.put(config.baseUrl + config.allUrl + '/' + resource._id, resource).then(function (response) {
                        invalidateCache();
                        return new Resource(response.data);
                    });
                };

                Resource.prototype.$save = function () {
                    invalidateCache();
                    if (this._id !== undefined) {
                        return Resource.update(this);
                    } else {
                        return Resource.new(this);
                    }
                };

                Resource.prototype.$remove = function () {
                    invalidateCache();
                    return http['delete'](config.baseUrl + config.allUrl + '/' + this._id);
                };

                Resource.invalidateCache = invalidateCache;

                return Resource;
            };
        }];
    });
})(angular);
