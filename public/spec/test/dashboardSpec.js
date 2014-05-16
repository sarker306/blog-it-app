describe('dashboard module', function () {

    beforeEach(module('blog-it.dashboard'));

    describe('dashboard controller', function () {

        var scope;
        var ctrl;

        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope;
            ctrl = $controller('dashboardCtrl', {$scope: scope, user: {}, $controller: $controller});
        }));

        it('should be a mixin with postList controller', function () {
            expect(scope.posts).toBeDefined();
            expect(scope.loadMore).toBeDefined();
        });


        it('should select a post', function () {
            expect(scope.selectedPost).not.toBeDefined();
            scope.selectPost({});
            expect(scope.selectedPost).toBeDefined();
        });
    });
});
