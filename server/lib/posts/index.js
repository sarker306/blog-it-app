var postDao = require('./post');
var postAPI = require('./postAPI');
var security = require('../security/security.js');

/**
 * Bootstrap the post module by creating a higher level access to the db and attaching the relevant routes to
 * the express application
 *
 * @param express an express application
 * @param db a connected db
 */
module.exports = function (express, db) {
    var dao = postDao(db);
    postAPI(express, dao, security);
};
