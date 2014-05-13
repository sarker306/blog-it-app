describe('dashboard module', function () {

    beforeEach(module('blog-it.dashboard'));

    describe('dashboard controller', function () {

        var scope;
        var ctrl;

        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope;
            ctrl = $controller('dashboardCtrl', {$scope: scope});
        }));

        it('should select a post', function () {
            expect(scope.selectedPost).not.toBeDefined();
            scope.selectPost({});
            expect(scope.selectedPost).toBeDefined();
        });
    });
});
