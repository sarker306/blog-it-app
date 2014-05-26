var messages = require('../../messages.js');

/**
 * middleware which checks if the request is made by a authenticated user or send a http 401
 * @param req request
 * @param res response
 * @param next call to next middleware
 */
exports.requireAuthenticationMiddleWare = function (req, res, next) {
    if (req.user) {
        return next();
    } else {
        return res.json(401, {message: messages.authenticationRequired});
    }
};

/**
 * middleware which checks if the request is made by an admin user or send http 403
 * @param req
 * @param res
 * @param next
 */
exports.requireAdminMiddleWare = function (req, res, next) {
    if (req.user && req.user.profile === 'admin') {
        return next();
    } else {
        return res.json(403, {message: messages.forbidden});
    }
};


function bodyCheckMiddlewareFactory(array) {

    var parameters = array;

    return function (req, res, next) {
        var hasAll = parameters.every(function (key) {
            return req.body[key] !== undefined;
        });

        return hasAll === true ? next() : res.json(400, {message: messages.badRequest})
    };
}

exports.bodyCheckMiddlewareFactory = function () {

    var args = [].slice.call(arguments);
    var bodyCheck;

    //if we have an array
    if (args.length === 1 && Array.isArray(args[0])) {
        bodyCheck = bodyCheckMiddlewareFactory(args[0]);
    } else {
        bodyCheck = bodyCheckMiddlewareFactory.call(null, args);
    }

    return bodyCheck;
};