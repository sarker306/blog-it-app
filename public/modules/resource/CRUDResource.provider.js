/**
 * abstract resource to handle http calls
 * The goal is to create a service to perform the http calls related to a given type of resource,
 * but it also can be used as a constructor so that some operation will be per instance.
 *
 * <pre>
 *     <code>
 *         //assuming CRUDResource has been injected
 *         var Post=CRUDResource({allUrl:'posts});
 *
 *         //the service can be used as http interface
 *         Post.update({_id:'postid', postContent:'post content'});
 *
 *         //or as a constructor
 *         var myPost=new Post({_id:'postid', postContent:'post content'});
 *         myPost.$save();
 *     <code>
 * </pre>
 *
 * you can have a look at the chapter 3 of this <a href="http://www.packtpub.com/angularjs-web-application-development/book?tag=dp/masteringwebwithangularjs-abr1/0913">book</a>
 * for more information
 */
(function (ng) {
    'use strict';
    ng.module('blog-it.resource').provider('CRUDResource', function () {

        var defaultConfig = {
            baseUrl: '/api/',
            allUrl: ''
        };

        /**
         * used at config time to overwrite default config
         * @param conf configuration object
         */
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

                /**
                 * abstract resource
                 * @param data
                 * @constructor
                 */
                function Resource(data) {
                    ng.extend(this, data);
                }

                /**
                 * find a list of resources instance based on parameters
                 * @param params object which holds the parameters
                 * @returns {Promise} should resolve with a list of instance of the Resource
                 */
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

                /**
                 * find a resource based on its id
                 * @param resourceId
                 * @returns {Promise} should resolve with an instance of the Resource
                 */
                Resource.findOne = function findOne(resourceId) {
                    return http.get(config.baseUrl + config.allUrl + '/' + resourceId, {cache: true}).then(function (response) {
                        return new Resource(response.data);
                    });
                };

                /**
                 * save a new resource on the backend
                 * @param resourceData the content of the resource
                 * @returns {Promise} should resolve to an instance of the newly created Resource
                 */
                Resource.new = function addNewResource(resourceData) {
                    return http.post(config.baseUrl + config.allUrl, resourceData).then(function (response) {
                        invalidateCache();
                        return new Resource(response.data);
                    });
                };

                /**
                 * udpate a Resource based on parameters
                 * @param resource the resource to update (must contain the _id field to be able to identify the resource)
                 * @returns {Promise} should resolve to an instance of the updated Resource
                 */
                Resource.update = function (resource) {
                    return http.put(config.baseUrl + config.allUrl + '/' + resource._id, resource).then(function (response) {
                        invalidateCache();
                        return new Resource(response.data);
                    });
                };

                /**
                 * instance version of Resource#save or Resource#update depending if it is a new Resource or an existing one (based on _id property)
                 * @returns {Promise|*} should resolve to an instance of the saved Resource
                 */
                Resource.prototype.$save = function () {
                    invalidateCache();
                    if (this._id !== undefined) {
                        return Resource.update(this);
                    } else {
                        return Resource.new(this);
                    }
                };

                /**
                 * instance method to remove the resource from the backend collection
                 * @returns {Promise} should resolve with the result of the http call performed
                 */
                Resource.prototype.$remove = function () {
                    invalidateCache();
                    return http['delete'](config.baseUrl + config.allUrl + '/' + this._id);
                };

                /**
                 * invalidate $http cache
                 * @type {invalidateCache}
                 */
                Resource.invalidateCache = invalidateCache;

                return Resource;
            };
        }];
    });
})(angular);
