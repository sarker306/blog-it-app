var security = require('../lib/security/security.js');

describe('security middlewares', function () {

    var req = {};
    var res = {
        json: function (status, message) {
        }};
    var next = {
        next: function () {

        }
    };

    beforeEach(function () {
        spyOn(res, 'json');
        spyOn(next, 'next');
    });

    it('should send 401 with appropriate message', function () {
        security.requireAuthenticationMiddleWare(req, res, function () {
            expect(true).toBe(false);//should not get here
        });
        expect(res.json).toHaveBeenCalled();
        expect(res.json.mostRecentCall.args[0]).toBe(401);
    });

    it('should process the next middleware', function () {
        security.requireAuthenticationMiddleWare({user: {}}, res, next.next);
        expect(res.json).not.toHaveBeenCalled();
        expect(next.next).toHaveBeenCalled();
    });

    it('should send a 403 with appropriate message', function () {
        security.requireAdminMiddleWare({user: {profile: 'guest'}}, res, function () {
            expect(true).toBe(false);//should not get here
        });
        expect(res.json).toHaveBeenCalled();
        expect(res.json.mostRecentCall.args[0]).toBe(403);
    });

    it('should process the next middleware', function () {
        security.requireAdminMiddleWare({user: {profile: 'admin'}}, res, next.next);
        expect(res.json).not.toHaveBeenCalled();
        expect(next.next).toHaveBeenCalled();
    });

    it('should process the next middleware if all required field are there when called with an array', function () {

        var middleware = security.bodyCheckMiddlewareFactory(['param1', 'param2']);

        req.body = {
            param1: 'value1',
            param2: 'value2'
        };

        middleware(req, res, next.next);
        expect(res.json).not.toHaveBeenCalled();
        expect(next.next).toHaveBeenCalled();
    });

    it('should process the next middleware if all required field are there when called with a list of arguments', function () {

        var middleware = security.bodyCheckMiddlewareFactory('param1', 'param2');

        req.body = {
            param1: 'value1',
            param2: 'value2'
        };

        middleware(req, res, next.next);
        expect(res.json).not.toHaveBeenCalled();
        expect(next.next).toHaveBeenCalled();
    });

    it('should send a bad request saying there are some missing parameters', function () {
        var middleware = security.bodyCheckMiddlewareFactory(['param1', 'param2']);

        req.body = {
            param1: 'value1'
        };

        middleware(req, res, next.next);
        expect(next.next).not.toHaveBeenCalled();
        expect(res.json.mostRecentCall.args[0]).toBe(400);
    });


});

