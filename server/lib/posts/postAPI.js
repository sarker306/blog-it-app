var messages = require('../../messages.js');
var errorHandler = require('../error/errorHandler.js');

module.exports = function (express, dao, security) {

    express.post('/api/posts', security.requireAdminMiddleWare, security.bodyCheckMiddlewareFactory('postContent', 'postTitle'), function (req, res) {

        var post = req.body;

        post.author = req.user.username;

        dao.insert(post)
            .then(function () {
                return dao.findOne({postTitle: post.postTitle});
            })
            .then(function (createdPost) {
                res.json(201, createdPost);
            })
            .catch(errorHandler(req, res));
    });

    express.get('/api/posts/:post', function (req, res) {
        var postTitle = req.params.post;
        dao.findById(postTitle).then(function (result) {
            if (result === null) {
                return res.json(404, {message: messages.notFound + postTitle});
            } else {
                return res.json(200, result);
            }
        }, errorHandler(req, res));
    });

    express.get('/api/posts', function (req, res) {
        var pageSize = 5;
        var query = req.query || {};
        var start = parseInt((query.start || 0), 10);
        var end = parseInt((query.end || start + pageSize), 10);
        var optionObject = {
            sort: {createdAt: -1},
            skip: start,
            limit: (end - start)
        };
        var queryObject = query.tag !== undefined ? {tags: query.tag} : {};

        dao.find(queryObject, optionObject).then(function (result) {
            return res.json(200, result);
        }, errorHandler(req, res));
    });

    express.put('/api/posts/:postId', security.requireAdminMiddleWare, function (req, res) {
        var updatedPost = req.body;
        var id = req.params.postId;
        if (updatedPost && updatedPost._id == id) {
            dao.save(updatedPost).then(function (result) {
                result < 1 ? res.json(404, {message: 'whatever message'}) : res.json(200, {message: 'whatever valid message'});
            }, errorHandler(req, res));
        } else {
            res.json(400, {message: messages.badRequest});
        }

    });

    express.del('/api/posts/:post', security.requireAdminMiddleWare, function (req, res) {
        var postTitle = req.params.post;
        dao.removeById(postTitle).then(function (result) {
            result < 1 ? res.json(404, {message: 'whatever message'}) : res.json(200, {message: 'whatever valid message'});
        }, errorHandler(req, res));
    });

    express.get('/api/posts/tags/all', function (req, res) {
        dao.tags().then(function (tags) {
            res.json(200, tags);
        }, errorHandler(req, res));
    });


};
