(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.markdown')
        .factory('Markdown', ['Post', '$cacheFactory', '$q', function (post, cacheFactory, q) {

            var cache = cacheFactory('markdown');

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
