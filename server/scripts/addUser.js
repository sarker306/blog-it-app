var MongoClient = require('mongodb').MongoClient;
var config = require('../config.js');
var userDao = require('../lib/user/user.js');
MongoClient.connect('mongodb://localhost:27017/' + config.server.dbName, function (err, db) {

    var userService = userDao(db);
    var email, username, password;

    function isValidEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    if (err) {
        console.error('was not able to connect to db, make sure the db is connected');
    }

    if (process.argv.length !== 5) {
        throw 'error: you must provides arguments email username password';
    } else {

        email = process.argv[2];
        username = process.argv[3];
        password = process.argv[4];

        console.log('email: ' + email);
        console.log('username: ' + username);
        console.log('password: ' + password);

        if (!isValidEmail(email)) {
            throw 'error: ' + email + ' is not a valid email';
        }

        userService.insert(email, password)
            .then(function (result) {
                return userService.findById(email);
            })
            .then(function (result) {
                result.email = email;
                result.username = username;
                result.profile = 'admin';

                return userService.save(result);
            })
            .then(function (result) {
                console.log('user successfully added');
                db.close();
            })
            .catch(function (err) {
                if (err.code === 11000) {
                    console.error('a user with email: ' + email + ' already exists');
                } else {
                    console.error('error: ' + err);
                }
                db.close();
            });
    }
});
