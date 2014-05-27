/**
 * attach the relevant routes to the express app
 * @param express an express application
 * @param userDao a db access service
 */
module.exports = function (express, userDao) {
    /**
     * send back the user related to the current cookie session
     */
    express.get('/api/users/me', function (req, res) {
        return req.user ? res.send(200, req.user) : res.send(200, {profile: 'guest'});
    });
};
