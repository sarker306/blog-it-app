var passport = require('passport');

/**
 * bootstrap the different authentication end point with their related authentication strategy
 * @param userDao a service to access user collection
 * @param expressapp an express application
 * @param strategies an array of the different passport strategies
 */
exports.initialize = function (userDao, expressapp, strategies) {

    expressapp.use(passport.initialize());
    expressapp.use(passport.session());

    /**
     * set up strategies and create a route for it
     */
    strategies.forEach(function (value) {
        passport.use(value);
        expressapp.post('/api/login/' + value.name,
            passport.authenticate(value.name),
            function (req, res) {
                res.send(200, req.user);
            });
    });

    /**
     * serialize user to session
     */
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    /**
     * deserialize user from session
     */
    passport.deserializeUser(function (id, done) {

        userDao.findById(id).then(function (result) {
            done(null, result);
        }, function (err) {
            done(err, null);
        });
    });
};

