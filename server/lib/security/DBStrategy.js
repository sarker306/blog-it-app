var LocalStrategy = require('passport-local').Strategy;
var util = require('util');
var bcrypt = require('bcrypt-nodejs');

function verify(email, password, done) {

    this.user.findById(email).then(function (user) {

        function isValidPassword(password) {
            return bcrypt.compareSync(password, user.password);
        }

        if (!user || !user.password) {
            done(null, false, {message: 'Incorrect username'});
        } else if (isValidPassword(password) !== true) {
            return done(null, false, { message: 'Incorrect password' });
        } else {
            done(null, user);
        }

    }, function (err) {
        done(err);
    });
}

function DBStrategy(userDao) {

    if (!(this instanceof DBStrategy)) {
        console.log('DBStrategy should be used with new');
        return new DBStrategy(userDao);
    }
    this.user = userDao;

    //call super ctor
    LocalStrategy.call(this, { usernameField: 'email' }, verify.bind(this));
}

util.inherits(DBStrategy, LocalStrategy);

module.exports = DBStrategy;
