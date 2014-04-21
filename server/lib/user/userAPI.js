module.exports = function (express, userDao) {
    express.get('/api/users/me', function (req, res) {
        if (req.user) {
            return res.send(200, req.user);
        } else {
            return res.send(200, {profile: 'guest'});
        }
    });
};
