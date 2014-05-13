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

    describe('blog dashboard controller', function () {

        var channelMock = {
            success: angular.noop,
            error: angular.noop
        };
        var postsSample = [
            {postTitle: 'postTitle1'},
            {postTitle: 'postTitle2'}
        ];
        var notifier = function (name) {
            channelMock.name = name;
            return channelMock;
        };
        var postMock = {};
        var ctrl;
        var scope;

        beforeEach(inject(function ($controller, $rootScope, $q) {
            var dependencies = {};
            scope = $rootScope.$new();
            postMock.all = function () {
                return $q.when(angular.copy(postsSample)).then(function (result) {
                    return result;
                });
            };

            dependencies.$scope = scope;
            dependencies.Post = postMock;
            dependencies.Notifier = notifier;
            ctrl = $controller('blogDashboardCtrl', dependencies);
        }));

        it('should init the data model', function () {
            expect(channelMock.name).toBe('global');
            expect(scope.posts).not.toBeDefined();
            scope.$apply();
            expect(scope.posts).toEqual(postsSample);
            expect(scope.selectedPost).toEqual(postsSample[0]);
        });

        it('should change the selected post', function () {
            scope.$apply();
            expect(scope.selectedPost).toEqual(scope.posts[0]);
            scope.select(scope.posts[1]);
            expect(scope.selectedPost).toEqual(scope.posts[1]);
        });

        it('should remove the selected post then call the notifier', inject(function ($q) {
            spyOn(channelMock, 'success');
            scope.$apply();
            angular.forEach(scope.posts, function (value, key) {
                value.$remove = function () {
                    var deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                }
            });
            scope.deletePost();
            expect(scope.posts.length).toBe(2);
            scope.$apply();
            expect(scope.posts.length).toBe(1);
            expect(channelMock.success).toHaveBeenCalledWith('post postTitle1 has been removed');
            expect(scope.selectedPost.postTitle).toEqual('postTitle2');
            scope.deletePost();
            scope.$apply();
            expect(scope.posts.length).toBe(0);
            expect(scope.selectedPost).toBe(null);
        }));

        it('should load more post', function () {

            spyOn(postMock, 'all').andCallThrough();

            scope.$apply();
            scope.loadMore();
            expect(scope.isLoading).toBe(true);
            expect(postMock.all.mostRecentCall.args[0]).toEqual({start: 2, end: 7});
            scope.$apply();
            expect(scope.isLoading).toBe(false);
            expect(scope.posts.length).toBe(4);
            scope.loadMore();
            expect(scope.isLoading).toBe(true);
            expect(postMock.all.mostRecentCall.args[0]).toEqual({start: 4, end: 9});
            scope.$apply();
            expect(scope.isLoading).toBe(false);
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
            ctrl = $controller('editPostCtrl', {$scope: scope, post: postMock, Notifier: function () {
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

        it('should update post content', function () {
            var postContent = '## some content';
            spyOn(NotifierMock, 'info');
            scope.saveContent(postContent);
            expect(scope.isEditorOpen).toBe(false);
            expect(scope.post.postContent).toEqual(postContent);
            expect(NotifierMock.info).toHaveBeenCalledWith('the post content has been updated');
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
            expect(locationMock.path).toHaveBeenCalledWith('/blog/admin');
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
            element = compile('<div lr-tags-collection="tags"/>')(scope);
        }));

        it('should replace by the proper markup', function () {
            expect(element.children()[0].nodeName).toEqual('UL');
            expect(element.children()[1].nodeName).toEqual('INPUT');
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
            ctrl = $controller('postListCtrl', {$scope: scope, Post: postMock});
        }));

        it('should init the scope', function () {
            expect(scope.posts).not.toBeDefined();
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


    });
});

