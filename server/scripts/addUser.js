var MongoClient = require('mongodb').MongoClient;
var config = require('../config.js');
var userDao = require('../lib/user/user.js');
MongoClient.connect('mongodb://localhost:27017/' + config.server.dbName, function (err, db) {

    var userService = userDao(db);
    var credentials;

    function isValidEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    if (err) {
        console.error('was not able to connect to db, make sure the db is connected');
    }

    if (process.argv.length !== 3) {
        throw 'error: you must provide an argument "userEmail:password" (notice the quotes!)';
    } else {

        var argString = process.argv[2];
        credentials = argString.substring(1, argString.length - 1).split(':');

        if (credentials.length < 2 || !isValidEmail(credentials[0])) {
            throw 'error: the argument(your credentials) must follow the pattern "userEmail:password"(Note the quotes)';
        } else {
            userService.insert(credentials[0], credentials[1]).then(function () {
                console.log('the user has been added successfully');
                db.close();
            }, function (err) {
                if (err.code === 11000) {
                    console.error('user with provided email already exists');
                } else {
                    console.error('could not add the user: ' + err);
                }
                db.close();
            });
        }
    }

});
