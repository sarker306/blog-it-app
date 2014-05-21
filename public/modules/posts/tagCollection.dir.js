(function (ng, undefined) {
    'use strict';
    ng.module('blog-it.posts')
        .directive('blogItTagCollection', [function () {
            return {
                restrict: 'EA',
                replace: true,
                scope: {
                    tags: '=blogItTagCollection'
                },
                template: '<div>' +
                    '<input list="tags" ng-model="current"/>' +
                    '<ul class="tag-collection">' +
                    '<li class="tag-item btn" ng-repeat="tag in tags track by $index">{{ tag }}<button type="button" ng-click="removeElement(tag)" class="icon btn icon-close tool-item"></button></li>' +
                    '</ul>' +
                    '</div>',
                link: function (scope, element, attr) {

                    var input = ng.element(element.children()[1]);

                    scope.tags = scope.tags || [];

                    scope.removeElement = function (tag) {
                        var index = scope.tags.indexOf(tag);
                        if (index !== -1) {
                            scope.tags.splice(index, 1);
                        }
                    };

                    input.bind('keydown', function (event) {
                        if (event.which === 13) {
                            scope.$apply(function () {
                                scope.tags.push(scope.current);
                                scope.current = '';
                            });
                            event.preventDefault();
                        }
                    });
                }
            };
        }]);
})(angular);
