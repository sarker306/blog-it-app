(function (ng, hljs, undefined) {

    'use strict';
    ng.module('blog-it.markdown')

        .factory('highlights', function () {
            return hljs.highlightBlock;
        })
        .directive('markdownHighlighter', ['$parse', '$filter', 'highlights', 'Markdown', '$q', function ($parse, filter, hl, md, q) {

            var makeHtml = filter('makeHtml');

            return{
                restrict: 'C',
                scope: {
                    markdownText: '@'
                },
                link: function (scope, element, attr) {
                    //this can be a performance bottleneck
                    scope.$watch('markdownText', function (newValue, oldValue) {
                        element.text(newValue);
                        element.removeClass('hljs');
                        hl(element[0]);
                    });
                }
            };
        }])
        // a hack for textarea which does not seem to grow with container size
        .directive('extensible', ['$timeout', function (timeout) {
            return {
                restrict: 'C',
                link: function (scope, element, attr) {

                    function increaseSize() {
                        if (element[0].scrollHeight > element[0].offsetHeight) {
                            element.css('height', element[0].scrollHeight + 40 + 'px');
                        }
                    }

                    //need to wait for the transition to complete
                    timeout(increaseSize, 1100);

                    element.bind('input', increaseSize);
                }

            };
        }]);
})(angular, hljs);
