describe('posts module', function () {

    beforeEach(module('blog-it.posts'));

    describe('post service', function () {

        var http;
        var post;

        beforeEach(inject(function ($httpBackend, Post) {
            http = $httpBackend;
            post = Post;
        }));

        afterEach(function () {
            http.verifyNoOutstandingExpectation();
            http.verifyNoOutstandingRequest();
        });

        it('should fetch the tag list', function () {
            var tagList = ['tag1', 'tag2'];
            var actual;
            http.expectGET('/api/posts/tags/all').respond(200, tagList);
            post.tagList().then(function (result) {
                actual = result;
            });
            expect(actual).not.toBeDefined();
            http.flush();
            expect(actual).toEqual(tagList);
        });

    });

    describe('postListCtrl', function () {
        var ctrl;
        var scope;
        var posts = [
            {postTitle: 'post1'},
            {postTitle: 'post1'}
        ];
        var postMock = {};

        beforeEach(inject(function ($controller, $rootScope, $q) {
            scope = $rootScope;
            postMock.find = function () {
                return $q.when(posts).then(function (posts) {
                    return posts;
                });
            };
            ctrl = $controller('postListCtrl', {$scope: scope, Post: postMock, tag: ''});
        }));

        it('should init the scope', function () {
            expect(scope.posts).toEqual([]);
            scope.$apply();
            expect(scope.posts).toEqual(posts);
        });

        it('should load more', function () {
            scope.$apply();
            spyOn(postMock, 'find').andCallThrough();
            expect(scope.posts.length).toBe(2);
            scope.loadMore();
            expect(scope.isLoading).toBe(true);
            scope.$apply();
            expect(scope.isLoading).toBe(false);
            expect(scope.posts.length).toBe(4);
            expect(postMock.find).toHaveBeenCalledWith({start: 2});
        });

        it('should exec a query', function () {
            scope.$apply();
            spyOn(postMock, 'find').andCallThrough();
            scope.query({prop: 'value'});
            expect(scope.isLoading).toBe(true);
            scope.$apply();
            expect(scope.isLoading).toBe(false);
            expect(postMock.find).toHaveBeenCalledWith({prop: 'value'});
        })
    });

    describe('short post list controller', function () {

        var postsSample = [
            {postTitle: 'postTitle1'},
            {postTitle: 'postTitle2'}
        ];
        var postMock = {};
        var ctrl;
        var scope;
        var location;

        beforeEach(inject(function ($controller, $rootScope, $q, $location) {
            var dependencies = {};
            scope = $rootScope;
            location = $location;
            postMock.find = function () {
                return $q.when(angular.copy(postsSample)).then(function (result) {
                    return result;
                });
            };

            dependencies.$scope = scope;
            dependencies.Post = postMock;
            dependencies.$controller = $controller;
            dependencies.$location = $location;

            spyOn(postMock, 'find').andCallThrough();
            location.path('/what').search({tag: 'test'});

            ctrl = $controller('shortListCtrl', dependencies);
        }));

        it('should be a mixin of postListController', function () {
            expect(scope.query).toBeDefined();
            expect(scope.loadMore).toBeDefined();
        });

        it('should init the scope', function () {
            scope.$apply();
            expect(postMock.find.calls[postMock.find.calls.length - 1].args).toEqual([
                {tag: 'test'}
            ]);
        });

        it('should keep track of query parameters when loading more', function () {
            scope.$apply();
            scope.loadMore();
            scope.$apply();
            expect(postMock.find.calls[postMock.find.calls.length - 1].args).toEqual([
                {tag: 'test', start: 2}
            ]);
        });


    });

    describe('blog edit post controller', function () {
        var
            scope,
            ctrl,
            NotifierMock = {
                info: angular.noop,
                success: angular.noop,
                error: angular.noop
            },
            markdownMock = {
                set: function (key, value) {

                }
            },
            locationMock = {
                path: angular.noop
            },
            postMock = {};

        beforeEach(inject(function ($rootScope, $controller, $q) {
            postMock.$save = function () {
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            };
            scope = $rootScope;
            ctrl = $controller('editPostCtrl', {$scope: scope, post: postMock, lrNotifier: function () {
                return NotifierMock;
            }, $location: locationMock, Markdown: markdownMock});
        }));

        it('should init the scope', function () {
            expect(scope.post).toBe(postMock);
            expect(scope.isEditorOpen).toBe(false);
        });

        it('should toggle the isEditorOpen value', function () {
            expect(scope.isEditorOpen).toBe(false);
            scope.toggleEditor();
            expect(scope.isEditorOpen).toBe(true);
            scope.toggleEditor();
            expect(scope.isEditorOpen).toBe(false);
        });

        it('should save a new post', function () {
            spyOn(NotifierMock, 'success');
            spyOn(postMock, '$save').andCallThrough();
            spyOn(locationMock, 'path');
            scope.savePost();
            expect(NotifierMock.success).not.toHaveBeenCalled();
            expect(locationMock.path).not.toHaveBeenCalled();
            expect(postMock.$save).toHaveBeenCalled();
            scope.$apply();
            expect(NotifierMock.success).toHaveBeenCalledWith('the post has been saved successfully');
            expect(locationMock.path).toHaveBeenCalledWith('/dashboard');
        });

        it('should save an existing post', function () {
            spyOn(NotifierMock, 'success');
            spyOn(postMock, '$save').andCallThrough();
            spyOn(locationMock, 'path');
            spyOn(markdownMock, 'set').andCallThrough();
            scope.post._id = 'existing post';
            scope.post.postContent = 'new content';
            scope.savePost();
            expect(NotifierMock.success).not.toHaveBeenCalled();
            expect(locationMock.path).not.toHaveBeenCalled();
            expect(postMock.$save).toHaveBeenCalled();
            scope.$apply();
            expect(NotifierMock.success).toHaveBeenCalledWith('the post has been saved successfully');
            expect(markdownMock.set).toHaveBeenCalledWith('existing post', 'new content');
            expect(locationMock.path).not.toHaveBeenCalled();
        });
    });

    describe('tag input directive', function () {

        var compile;
        var element;
        var scope;
        var root;

        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope;
            root = $rootScope;
            compile = $compile;
            scope.tags = [];
            element = compile('<div blog-it-tag-collection="tags"/>')(scope);
        }));

        it('should replace by the proper markup', function () {
            expect(element.children()[1].nodeName).toEqual('UL');
            expect(element.children()[0].nodeName).toEqual('INPUT');
        });

        it('should bind a new li element for every tag in the bound collection', function () {

            var lis;

            root.tags = ['first', 'second'];
            scope.$apply();
            lis = element.find('li');
            expect(lis.length).toEqual(2);
            expect(lis[0].innerText).toEqual('first');
            expect(lis[1].innerText).toEqual('second');
        });

        it('should remove li element and model bound when clicking on the button', function () {

            var buttons;
            var lis;

            root.tags = ['first', 'second'];
            scope.$apply();

            buttons = element.find('button');

            $(buttons[1]).click();
            expect(root.tags.length).toBe(1);
            expect(root.tags[0]).toEqual('first');
            lis = element.find('li');
            expect(lis.length).toEqual(1);
            expect(lis[0].innerText).toEqual('first');
        });
    });
});

