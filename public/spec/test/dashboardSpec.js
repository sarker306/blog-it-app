describe('dashboard module', function () {

    beforeEach(module('blog-it.dashboard'));

    describe('dashboard controller', function () {

        function Post() {
        }

        var scope;
        var ctrl;
        var notifierMock = {
            success: angular.noop
        };
        var userMock;

        beforeEach(inject(function ($rootScope, $controller, $q) {
            scope = $rootScope;


            Post.prototype.$remove = function () {
                return $q.when('success');
            };
            Post.find = function () {
                return $q.when([]);
            };
            ctrl = $controller('dashboardCtrl', {Post: Post, lrNotifier: function () {
                return notifierMock;
            }, $scope: scope, user: userMock, $controller: $controller});
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

        it('should remove a post', inject(function ($q) {
            var postItem = new Post();
            scope.$apply();
            scope.posts = [postItem, new Post()];
            spyOn(postItem, '$remove').andCallThrough();
            spyOn(notifierMock, 'success').andCallThrough();

            scope.removePost(scope.posts[0]);

            expect(scope.posts.length).toBe(2);
            scope.$apply();
            expect(scope.posts.length).toBe(1);
            expect(postItem.$remove).toHaveBeenCalled();
            expect(notifierMock.success).toHaveBeenCalledWith('post has been removed');
        }));

    });
});
