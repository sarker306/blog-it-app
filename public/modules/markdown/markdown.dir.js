(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.markdown')
        .directive('markdownContent', ['$filter', 'Markdown', function (filter, markdown) {

            var convert = filter('makeHtml');

            return {
                link: function (scope, element, attr) {
                    var srcExp = attr.markdownContent;

                    scope.$watch(srcExp, function (value) {

                        markdown.get(value).then(function (md) {
                            var htmlString = convert(md);
                            var inner = ng.element('<div>' + htmlString + '</div>');
                            var selector = attr.markdownSelector;

                            if (selector) {
                                //clean
                                element.html();
                                //insert node
                                element.append(inner.find(selector)[0]);
                            } else {
                                element.html(htmlString);
                            }
                        });
                    });
                }
            };
        }])
})(angular);

