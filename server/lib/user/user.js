var bcrypt = require('bcrypt-nodejs');
var daoFactory = require('blog-it-dao');
var promise = require('es6-promise').Promise;

/**
 * Create a service to access the users collection.
 * Return a service with the following interface
 * return {
        findOne: {promise},
        findById: {promise},
        find: {promise},
        insert: {promise},
        remove: {promise},
        removeById: {promise},
        save: {promise},
        update: {promise},
        updateById: {promise}
    };
 * see <a href="https://www.npmjs.org/package/blog-it-dao">blog-it-dao</a> for more information
 * @param db a connected db
 * @returns {*}
 */
function createUserDAO(db) {
    var userService = daoFactory(db, 'users');
    var standardInsert = userService.insert;

    function createUser(email, password) {
        // Generate password hash
        var salt = bcrypt.genSaltSync();
        var passwordHash = bcrypt.hashSync(password, salt);

        // Create user document
        var user = {'_id': email, email: email, 'password': passwordHash};


        return standardInsert(user, {w: 1});
    }

    userService.insert = createUser;

    return  userService;
}

module.exports = createUserDAO;
