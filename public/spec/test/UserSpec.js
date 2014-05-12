describe('user module', function () {

    beforeEach(module('blog-it.users'));

    describe('user service', function () {
        var http;
        var user;
        var defaultUser = {
            profile: 'guest'
        };

        beforeEach(inject(function ($httpBackend, User) {
            http = $httpBackend;
            user = User;
        }));

        afterEach(function () {
            http.verifyNoOutstandingExpectation();
            http.verifyNoOutstandingRequest();
        });

        it('should get the current logged in user', function () {
            var me;
            http.expectGET('/api/users/me').respond(200, defaultUser);
            user.me().then(function (loggedUser) {
                me = loggedUser;
            });
            expect(me).not.toBeDefined();
            http.flush();
            expect(me).toEqual(defaultUser);
        });
    });
});