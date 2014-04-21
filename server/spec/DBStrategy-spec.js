var DBStrategy = require('../lib/security/DBStrategy');
var when = require('blog-it-stub').when;
var bcrypt = require('bcrypt-nodejs');


describe('DB strategy', function () {

    var userMock;
    var dbStrat;

    beforeEach(function () {
        userMock = {};
        dbStrat = new DBStrategy(userMock);
    });

    it('should have "local" as name', function () {
        expect(dbStrat.name).toEqual('local');
    });

    it('should send a message if the user can not be found', function (done) {
        var stub = when(userMock, 'findOneById').thenResolveWith(null);
        dbStrat._verify('whateverEmail', 'secret', function (err, result, args) {
            expect(err).toBeNull();
            expect(result).toBe(false);
            expect(args.message).toEqual('Incorrect username');
            done();
        });
        stub.flush();
    });

    it('should send a message if the userMock password is incorrect', function (done) {
        var stub = when(userMock, 'findOneById').thenResolveWith({
            email: 'userMock@valid.com',
            password: bcrypt.hashSync('correct')
        });
        dbStrat._verify('userMock@valid.com', 'incorrect', function (err, result, args) {
            expect(err).toBeNull();
            expect(result).toBe(false);
            expect(args.message).toEqual('Incorrect password');
            done();
        });

        stub.flush();
    });

    it('should return the proper userMock', function (done) {
        var user = {
            email: 'userMock@valid.com',
            password: bcrypt.hashSync('correct')
        };
        var stub = when(userMock, 'findOneById').thenResolveWith(user);
        dbStrat._verify('userMock@valid.com', 'correct', function (err, result, args) {
            expect(err).toBeNull();
            expect(result).toEqual(user);
            done();
        });

        stub.flush();
    });

    it('should reject the authentication', function (done) {

        var stub = when(userMock, 'findOneById').thenRejectWith('ERROR');

        dbStrat._verify('userMock@valid.com', 'correct', function (err, result, args) {
            expect(err).toEqual('ERROR');
            expect(result).not.toBeDefined();
            done();
        });

        stub.flush();

    });

});

