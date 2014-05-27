var UserDao = require('./user.js');
var userAPI = require('./userAPI.js');

/**
 * Bootstrap the user module by creating a higher level access to the db and attaching the relevant routes to
 * the express application
 *
 * @param express an express application
 * @param db a connected db
 */
module.exports = function (express, db) {
    var userDao = new UserDao(db);
    userAPI(express, userDao);
};
