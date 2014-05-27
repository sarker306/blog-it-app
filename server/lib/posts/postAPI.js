var messages = require('../../messages.js');
var errorHandler = require('../error/errorHandler.js');

/**
 * attach the relevant routes to the express app
 * @param express an express application
 * @param dao a db access service
 * @param security an object which hold the security middleware
 */
module.exports = function (express, dao, security) {

    /**
     * create a new post
     * (require admin user)
     * request body must contain "postContent" and "postTitle" fields
     */
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

    /**
     * get a particular post
     */
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

    /**
     * get a list of posts. Support query parameters
     * start: the first post index to get
     * end: the last post index to get
     * tag: a tag to filter the posts
     */
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

    /**
     * update a given post
     * (require admin user)
     */
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

    /**
     * delete a given post
     * (require admin user)
     */
    express.del('/api/posts/:post', security.requireAdminMiddleWare, function (req, res) {
        var postTitle = req.params.post;
        dao.removeById(postTitle).then(function (result) {
            result < 1 ? res.json(404, {message: 'whatever message'}) : res.json(200, {message: 'whatever valid message'});
        }, errorHandler(req, res));
    });

    /**
     * get the whole list of already existing tags
     */
    express.get('/api/posts/tags/all', function (req, res) {
        dao.tags().then(function (tags) {
            res.json(200, tags);
        }, errorHandler(req, res));
    });


};
