(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.markdown')
        .factory('Markdown', ['Post', '$cacheFactory', '$q', function (post, cacheFactory, q) {

            var cache = cacheFactory('markdown');


            /**
             * get markdown postContent base on a section name
             * @param postName the key which refer to a section (in practice it refers to a blog post)
             * @returns {*}
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
             * set a key/value pair in the cache
             * @param key the key to set
             * @param content the content related to the key
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
