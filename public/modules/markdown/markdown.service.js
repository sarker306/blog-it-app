/**
 * service which fetch and hold markdown content base on post title
 */

(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.markdown')
        .factory('Markdown', ['Post', '$cacheFactory', '$q', function (post, cacheFactory, q) {

            var cache = cacheFactory('markdown');

            /**
             * get the markdown content related to the post identified by the postName
             * it goes first in the cache otherwise call the backend(http request)
             * @param postName the post title
             * @returns {*} promise which is supposed to resolve with the post content (ie a markdown string)
             */
            function get(postName) {

                var returnPromise;
                var markdownSection = cache.get(postName);

                if (markdownSection !== undefined) {
                    returnPromise = q.when(markdownSection);
                } else {
                    returnPromise = post.findOne(postName).then(function (postResult) {
                        set(postName, postResult.postContent);
                        return postResult.postContent;
                    });
                }
                return returnPromise;
            }

            /**
             * put in cache content related to the post identified by key
             * @param key post identifier (title)
             * @param content post content (markdown string)
             */
            function set(key, content) {
                if (key) {
                    cache.put(key, content);
                }
            }

            return {
                get: get,
                set: set
            };
        }]);
})(angular);
