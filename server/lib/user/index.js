var UserDao = require('./user.js'),
    userAPI = require('./userAPI.js');

module.exports = function (express, db) {
    var userDao = new UserDao(db);
    userAPI(express, userDao);
};
