var bcrypt = require('bcrypt-nodejs');
var daoFactory = require('blog-it-dao');
var promise = require('es6-promise').Promise;


function createUserDAO(db) {
    var userService = daoFactory(db, 'users');
    var standardInsert = userService.insert;

    function createUser(email, password) {
        // Generate password hash
        var salt = bcrypt.genSaltSync();
        var password_hash = bcrypt.hashSync(password, salt);

        // Create user document
        var user = {'_id': email, email: email, 'password': password_hash};


        return standardInsert(user, {w: 1});
    }

    userService.insert = createUser;

    return  userService;
}

module.exports = createUserDAO;
