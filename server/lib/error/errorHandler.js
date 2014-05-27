var messages = require('../../messages.js');

/**
 * simple error handler
 * @param req http request
 * @param res http response
 * @returns {Function}
 */
module.exports = function errorHandler(req, res) {
    return function (err) {
        console.error(err);
        //db conflict
        if (err.code === 11000) {
            res.json(409, {message: messages.conflict});
        } else {
            res.json(500, {message: messages.internalError});
        }
    };
};
