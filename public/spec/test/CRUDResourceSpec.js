describe('Resource module', function () {

    beforeEach(module('blog-it.resource', function (CRUDResourceProvider) {
        CRUDResourceProvider.setDefaultConfig({baseUrl: '/base', allUrl: '/collection'});
    }));

    describe('CRUDResource', function () {

        var http;
        var resource;
        var collection = [
            {resourceTitle: 'item1', _id: 'item1'},
            {resourceTitle: 'item2', _id: 'item2'}
        ];


        beforeEach(inject(function ($httpBackend, CRUDResource) {
            http = $httpBackend;
            resource = CRUDResource();
        }));

        afterEach(function () {
            http.verifyNoOutstandingExpectation();
            http.verifyNoOutstandingRequest();
        });

        it('should have set the default configuration', function () {
            http.expectGET('/base/collection').respond(200, collection);
            resource.find();
            http.flush();
        });

        it('should return a promise that resolve with all collection item', function () {
            http.expectGET('/base/collection').respond(200, collection);
            var collectionResult;
            resource.find().then(function (result) {
                collectionResult = result;
            });
            expect(collectionResult).not.toBeDefined();
            http.flush();
            expect(collectionResult).toEqual([new resource(collection[0]), new resource(collection[1])]);
        });

        it('should support url params', function () {
            http.expectGET('/base/collection?param=value').respond(200, collection);
            resource.find({param: 'value'}).then(angular.noop);
            http.flush();
        });


        it('should return a promise that resolve only one item based on its id', function () {
            var singleItem;
            http.expectGET('/base/collection/item1').respond(200, collection[0]);
            resource.findOne('item1').then(function (result) {
                singleItem = result;
            });
            expect(singleItem).not.toBeDefined();
            http.flush();
            expect(singleItem).toEqual(new resource(collection[0]));
        });

        it('should add a new item', function () {
            var newItem = {resourceTitle: 'new item'};
            var resultItem;
            http.expectPOST('/base/collection', newItem).respond(201, newItem);
            resource.new(newItem).then(function (result) {
                resultItem = result;
            });
            expect(resultItem).not.toBeDefined();
            http.flush();
            expect(resultItem).toEqual(new resource(newItem));
        });

        it('should update an existing item', function () {
            var toUpdate = new resource(collection[0]);
            toUpdate.resourceTitle = 'new title';
            http.expectPUT('/base/collection/' + collection[0]._id, toUpdate).respond(200);
            resource.update(toUpdate);
            http.flush()
        });

        it('should add new instance as the resource has no id', function () {
            var newItem = new resource({resourceTitle: 'new item'});
            var resultItem;
            http.expectPOST('/base/collection', newItem).respond(201, newItem);
            newItem.$save().then(function (result) {
                resultItem = result;
            });
            expect(resultItem).not.toBeDefined();
            http.flush();
            expect(resultItem).toEqual(newItem);
        });

        it('should update an existing item as it has an _id', function () {
            var toUpdate = new resource(collection[0]);
            http.expectPUT('/base/collection/' + collection[0]._id, toUpdate).respond(200);
            toUpdate.$save();
            http.flush();
        });

        it('should delete an existing item', function () {
            var toDelete = new resource(collection[0]);
            http.expectDELETE('/base/collection/' + collection[0]._id).respond(200);
            toDelete.$remove();
            http.flush();
        });
    });
});