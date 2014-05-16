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
                template: '<div><ul class="tag-list">' +
                    '<li class="tag-item" ng-repeat="tag in tags">{{ tag }}<button ng-click="removeElement(tag)" class="icon btn very-small icon-close"></button></li>' +
                    '</ul><input list="tags" ng-model="current"/>' +
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
