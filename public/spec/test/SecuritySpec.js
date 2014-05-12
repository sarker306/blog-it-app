describe('security module', function () {

    var loggedUser = {};

    //mock
    beforeEach(module('blog-it.users', function ($provide) {
        $provide.factory('User', ['$q', function (q) {
            return {
                me: function () {
                    return q.when(loggedUser);
                }
            }
        }]);
    }));

    beforeEach(module('blog-it.security'));

    describe('security service', function () {
        var security;
        var root;
        var http;

        beforeEach(inject(function (Security, $rootScope, $httpBackend) {
            security = Security;
            root = $rootScope;
            http = $httpBackend;
            loggedUser.profile = 'guest';
        }));

        afterEach(function () {
            http.verifyNoOutstandingExpectation();
            http.verifyNoOutstandingRequest();
        });

        it('should return the current user', function () {
            var currentUser;
            security.getCurrentUser().then(function (user) {
                currentUser = user;
            });
            expect(currentUser).not.toBeDefined();
            root.$digest();
            expect(currentUser).toEqual(loggedUser);
        });


        it('should say the user is not admin', function () {
            expect(security.isAdmin()).toBe(false);
            root.$digest();
            expect(security.isAdmin()).toBe(false);
        });

        it('should say the user is admin', function () {
            loggedUser.profile = 'admin';
            root.$digest();
            expect(security.isAdmin()).toBe(true);
        });

        it('should update the current user', function () {
            var userToLog = {
                email: 'email',
                password: 'pass',
                profile: 'admin'
            };
            var currentUser;
            http.expectPOST('/api/login/local', {email: userToLog.email, password: userToLog.password}).respond(200, userToLog);
            security.getCurrentUser().then(function (user) {
                currentUser = user;
            });
            root.$digest();
            expect(currentUser).toEqual(loggedUser);
            security.login(userToLog.email, userToLog.password);
            http.flush();
            security.getCurrentUser().then(function (user) {
                currentUser = user;
            });
            root.$digest();
            expect(currentUser).toEqual(userToLog);
        });
    });

    describe('loginCtrl', function () {
        var channelMock = {
            success: angular.noop,
            error: angular.noop
        };
        var notifier = function (name) {
            channelMock.name = name;
            return channelMock;
        };
        var securityMock = {
            shouldSucceed: true,
            isAdmin: angular.noop
        };
        var ctrl;
        var scope;

        beforeEach(inject(function ($rootScope, $controller, $q) {
            var dependencies = {};
            scope = $rootScope;
            securityMock.login = function (email, password) {
                var deferred = $q.defer();
                this.shouldSucceed === true ? deferred.resolve() : deferred.reject();
                return deferred.promise;
            };

            dependencies.$scope = scope;
            dependencies.Security = securityMock;
            dependencies.Notifier = notifier;
            ctrl = $controller('loginCtrl', dependencies);
        }));

        it('should have set default values', function () {
            expect(scope.credentials).toEqual({});
            expect(channelMock.name).toBe('global');
        });

        it('should notify whether login was a success', function () {
            spyOn(channelMock, 'success');
            spyOn(channelMock, 'error');
            spyOn(securityMock, 'login').andCallThrough();
            scope.$digest();
            scope.credentials = {email: 'email', password: 'password'};
            scope.submit();
            scope.$digest();
            expect(securityMock.login).toHaveBeenCalledWith('email', 'password');
            expect(channelMock.success).toHaveBeenCalledWith('login successful!');
            expect(channelMock.error).not.toHaveBeenCalled();
        });

        it('should notify whether login was an error', function () {
            spyOn(channelMock, 'success');
            spyOn(channelMock, 'error');
            spyOn(securityMock, 'login').andCallThrough();
            securityMock.shouldSucceed = false;
            scope.$digest();
            scope.credentials = {email: 'email', password: 'password'};
            scope.submit();
            scope.$digest();
            expect(securityMock.login).toHaveBeenCalledWith('email', 'password');
            expect(channelMock.error).toHaveBeenCalledWith('authentication failed, please check your credentials');
            expect(channelMock.success).not.toHaveBeenCalled();
        });

    });
});
