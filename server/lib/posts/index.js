var postDao = require('./post'),
    postAPI = require('./postAPI'),
    security = require('../security/security.js');

module.exports = function (express, db) {
    var dao = postDao(db);
    postAPI(express, dao, security);
};
