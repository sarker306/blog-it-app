describe('markdown module', function () {

    describe('Markdown service', function () {

        var rootScope;
        var postMock;
        var markdown;
        var cache;
        var sectionResult = {_id: 'section-name', postContent: 'some markdown postContent'};

        beforeEach(module('blog-it.markdown', function ($provide) {

            $provide.factory('Post', ['$q', function ($q) {

                postMock = {
                    findOne: function (post) {
                        return $q.when(sectionResult);
                    }
                };
                return postMock;
            }]);
        }));

        beforeEach(inject(function ($rootScope, $cacheFactory, Markdown) {
            rootScope = $rootScope;
            markdown = Markdown;
            cache = $cacheFactory.get('markdown');
        }));

        afterEach(function () {
            cache.removeAll();
        });

        it('should fetch postContent from Post service and update cache', function () {
            var result;
            spyOn(postMock, 'findOne').andCallThrough();
            markdown.get('section-name').then(function (content) {
                result = content;
            });
            expect(result).not.toBeDefined();
            expect(cache.get('section-name')).not.toBeDefined();
            rootScope.$digest();
            expect(postMock.findOne).toHaveBeenCalledWith('section-name');
            expect(result).toEqual(sectionResult.postContent);
            expect(cache.get('section-name')).toEqual(result);
        });

        it('should not fetch from post but from cache', inject(function ($rootScope) {
            var result;
            spyOn(postMock, 'findOne');
            cache.put('section-name', sectionResult.postContent);
            markdown.get('section-name').then(function (content) {
                result = content;
            });
            expect(result).not.toBeDefined();
            $rootScope.$digest();
            expect(postMock.findOne).not.toHaveBeenCalled();
            expect(result).toEqual(sectionResult.postContent);
        }));

        it('should set the pair in the cache', function () {
            expect(cache.get('myKey')).not.toBeDefined();
            markdown.set('myKey', 'some content');
            expect(cache.get('myKey')).toEqual('some content');
        });

    });

    describe('make html', function () {

        beforeEach(module('blog-it.markdown'));

        it('should delegate to showdown', inject(function (makeHtmlFilter) {
            expect(makeHtmlFilter('Hello world')).toEqual('<p>Hello world</p>');
        }));

        it('should return empty string for falsy falue', inject(function (makeHtmlFilter) {
            expect(makeHtmlFilter(undefined)).toEqual('');
            expect(makeHtmlFilter(null)).toEqual('');
        }));
    });

    describe('markdown-postContent directive', function () {

        var md;
        var cache;

        beforeEach(module('blog-it.markdown'));

        beforeEach(inject(function ($cacheFactory, Markdown) {
            md = Markdown;
            cache = $cacheFactory.get('markdown');
        }));

        afterEach(function () {
            cache.removeAll();
        });

        it('should insert postContent through showdown', inject(function ($rootScope, $compile) {

            md.set('mysection', 'hello world');

            var element = $compile('<div markdown-content="\'mysection\'"></div>')($rootScope);
            $rootScope.$digest();

            expect(element.html()).toEqual('<p>hello world</p>');
        }));

        it('should resolve section name against scope first', inject(function ($rootScope, $compile) {

            $rootScope.mysection = 'fromScope';
            md.set('fromScope', 'hello world');

            var element = $compile('<div markdown-content="mysection"></div>')($rootScope);

            $rootScope.$digest();

            expect(element.html()).toEqual('<p>hello world</p>');
        }));

        it('should update section content when the bound expression changes', inject(function ($rootScope, $compile) {
            $rootScope.mysection = 'fromScope';
            md.set('fromScope', 'hello world');
            md.set('other', 'hello other');

            var element = $compile('<div markdown-content="mysection"></div>')($rootScope);
            $rootScope.$digest();
            expect(element.html()).toEqual('<p>hello world</p>');

            $rootScope.mysection = 'other';
            $rootScope.$digest();
            expect(element.html()).toEqual('<p>hello other</p>');
        }));

        it('should escape from scope when used with quotes', inject(function ($rootScope, $compile) {

            $rootScope.mysection = 'fromScope';
            md.set('fromScope', 'from scope');
            md.set('mysection', 'hello world');

            var element = $compile('<div markdown-content="\'mysection\'"></div>')($rootScope);

            $rootScope.$digest();
            expect(element.html()).toEqual('<p>hello world</p>');
        }));

        it('should take the fist matching element when selector is passed', inject(function ($compile, $rootScope) {

            md.set('mysection', 'hello [world](#)' +
                '[tape](#)');

            var element = $compile('<div markdown-selector="a" markdown-content="\'mysection\'"></div>')($rootScope);

            $rootScope.$digest();

            expect(element.html()).toEqual('<a href="#">world</a>');
        }));

        it('should be able to find matching on the root nodes', inject(function ($compile, $rootScope) {
            md.set('mysection', 'hello world');

            var element = $compile('<div markdown-selector="p" markdown-content="\'mysection\'"></div>')($rootScope);

            $rootScope.$digest();

            expect(element.html()).toEqual('<p>hello world</p>');
        }));


    });
});




