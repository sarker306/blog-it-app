module.exports = function (express, userDao) {
    express.get('/api/users/me', function (req, res) {
        return req.user ? res.send(200, req.user) : res.send(200, {profile: 'guest'});
    });
};
