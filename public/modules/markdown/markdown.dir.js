/**
 * directive in charge of rendering a post(ie convert its markdown content into html)
 * <pre>
 *      <code>
 *          <div markdown-content="postTitle" filter="selector"></div>
 *      </code>
 * </pre>
 *
 * where
 * -postTitle is a property of the current scope which should resolve into the title of the post to render within the div
 * you can also put the value into quotes so that the name won't be evaluated against the scope (same way than ngInclude directive)
 *
 * -selector (not mandatory) can be any selector supported by jqLite (or jquery if you have it included in your project). If you use a selector,
 * only the first matching element in the converted html will be rendered. It is interesting if you want to display post preview for example. If you don't put
 * any selector the whole post will be rendered
 *
 * Note: this is a one time rendering (at least one for each time the postTitle expression changes). So, the post content is not watched(for performance reason)
 * If you would like to have a dynamic rendering every time the post content change refer to blog-it.markdown#makeHtmlFilter
 */

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
        }]);
})(angular);

