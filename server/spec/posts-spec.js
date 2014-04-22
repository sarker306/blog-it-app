var express = require('express');
var mongodb = require('mongodb').MongoClient;
var daoFactory = require('../lib/posts/post.js');
var postAPI = require('../lib/posts/postAPI.js');
var request = require('supertest');
var bodyParser = require('body-parser');
var when = require('blog-it-stub').when;
var messages = require('../messages.js');

describe('posts module', function () {

    //need a connected mongo db
    describe('post dao', function () {

        var dao;

        beforeEach(function (done) {
            mongodb.connect('mongodb://127.0.0.1:27017/test', function (err, db) {
                if (err) throw err;

                db.dropCollection('posts', function () {
                    dao = daoFactory(db);
                    done();
                });
            });
        });

        it('should insert a new post creating a permalink and setting the date at now', function (done) {

            var newPost = {
                postTitle: 'new post'
            };

            dao.insert(newPost)
                .then(function () {
                    return dao.findOne({postTitle: 'new post'});
                })
                .then(function (result) {
                    expect(result._id).toEqual('new-post');
                    expect(result.postTitle).toEqual('new post');
                    expect(result.createdAt).toBeDefined();
                    done();
                });
        });

        it('should fetch a set of all the existing tag from all the post collection', function (done) {
            var postsSample = [
                {postTitle: 'first post', tags: ['first', 'post']},
                {postTitle: 'second post', tags: ['second', 'post']}
            ];

            dao.insert(postsSample[0]).
                then(function () {
                    return dao.insert(postsSample[1]);
                })
                .then(function () {
                    return dao.tags()
                })
                .then(function (result) {
                    expect(result).toEqual(['first', 'post', 'second']);
                    done();
                });
        });
    });

    describe('post api', function () {

        var daoMock = {};
        var app;
        var securityMock;

        beforeEach(function () {

            securityMock = {
                requireAdminMiddleWare: function (req, res, next) {
                    req.user = {username: 'lorenzofox'};
                    return next();
                },

                bodyCheckMiddlewareFactory: function () {
                    return function (req, res, next) {
                        return next();
                    }
                }
            };

            app = express();
            app.use(bodyParser.json());
            postAPI(app, daoMock, securityMock);
        });

        describe('POST /api/posts', function () {

            it('should return 201 with newly created post', function (done) {
                var data = {postTitle: 'new post', postContent: 'post content'};
                var stub = when(daoMock, 'insert').thenResolveWith(1);
                var findOneStub = when(daoMock, 'findOne').thenResolveWith(data);
                spyOn(daoMock, 'findOne').andCallThrough();
                request(app)
                    .post('/api/posts')
                    .send(data)
                    .expect('Content-Type', /json/)
                    .expect(201)
                    .end(function (err, response) {
                        expect(daoMock.findOne).toHaveBeenCalledWith({postTitle: 'new post'});
                        expect(err).toBeNull();
                        expect(response.body).toEqual(data);
                        done();
                    });

                stub.flush();
                findOneStub.flush();
            });

            it('should handle duplicate key ', function (done) {
                var data = {postTitle: 'new post', postContent: 'post content'};
                var stub = when(daoMock, 'insert').thenRejectWith({code: 11000});
                var findOneStub = when(daoMock, 'findOne').thenResolveWith(data);
                request(app)
                    .post('/api/posts')
                    .send(data)
                    .expect('Content-Type', /json/)
                    .expect(409, {message: messages.conflict})
                    .end(function (err, response) {
                        expect(err).toBeNull();
                        done();
                    });

                stub.flush();
                findOneStub.flush();
            });

            it('should handle internal error ', function (done) {
                var data = {postTitle: 'new post', postContent: 'post content'};
                var stub = when(daoMock, 'insert').thenRejectWith({code: 2323213});
                var findOneStub = when(daoMock, 'findOne').thenResolveWith(data);
                request(app)
                    .post('/api/posts')
                    .send(data)
                    .expect('Content-Type', /json/)
                    .expect(500, {message: messages.internalError})
                    .end(function (err, response) {
                        expect(err).toBeNull();
                        done();
                    });

                stub.flush();
                findOneStub.flush();
            });
        });

        describe('GET /api/posts/:post', function () {

            it('should return the post requested', function (done) {

                var postData = {postTitle: 'new post', postContent: 'post content'};
                var stub = when(daoMock, 'findById').thenResolveWith(postData);
                spyOn(daoMock, 'findById').andCallThrough();
                request(app)
                    .get('/api/posts/my-post')
                    .expect('Content-Type', /json/)
                    .expect(200, postData)
                    .end(function (err, res) {
                        expect(err).toBeNull();
                        expect(daoMock.findById).toHaveBeenCalledWith('my-post');
                        done();
                    });
                stub.flush();
            });

            it('should return a 404', function (done) {
                var stub = when(daoMock, 'findById').thenResolveWith(null);
                spyOn(daoMock, 'findById').andCallThrough();
                request(app)
                    .get('/api/posts/my-post')
                    .expect('Content-Type', /json/)
                    .expect(404)
                    .end(function (err, res) {
                        expect(err).toBeNull();
                        expect(daoMock.findById).toHaveBeenCalledWith('my-post');
                        done();
                    });
                stub.flush();
            });

            it('should handle error', function (done) {
                var stub = when(daoMock, 'findById').thenRejectWith({});
                spyOn(daoMock, 'findById').andCallThrough();
                request(app)
                    .get('/api/posts/my-post')
                    .expect('Content-Type', /json/)
                    .expect(500, {message: messages.internalError})
                    .end(function (err, res) {
                        expect(err).toBeNull();
                        expect(daoMock.findById).toHaveBeenCalledWith('my-post');
                        done();
                    });
                stub.flush();
            });

        });

        describe('GET /api/posts', function () {

            it('should return the posts requested', function (done) {

                var stub = when(daoMock, 'find').thenResolveWith([
                    {postTitle: 'new post', postContent: 'post content'}
                ]);

                spyOn(daoMock, 'find').andCallThrough();

                request(app)
                    .get('/api/posts')
                    .expect('Content-Type', /json/)
                    .expect(200, [
                        {postTitle: 'new post', postContent: 'post content'}
                    ])
                    .end(function (err, res) {
                        expect(err).toBeNull();
                        expect(daoMock.find).toHaveBeenCalled();
                        expect(daoMock.find.mostRecentCall.args[1]).toEqual({sort: { 'createdAt': -1}, skip: 0, limit: 5});
                        done();
                    });

                stub.flush();
            });

            it('should take query parameters into account', function (done) {
                var stub = when(daoMock, 'find').thenResolveWith([
                    {postTitle: 'new post', postContent: 'post content'}
                ]);

                spyOn(daoMock, 'find').andCallThrough();

                request(app)
                    .get('/api/posts?start=4&end=7&tag=test')
                    .expect('Content-Type', /json/)
                    .expect(200, [
                        {postTitle: 'new post', postContent: 'post content'}
                    ])
                    .end(function (err, res) {
                        expect(err).toBeNull();
                        expect(daoMock.find).toHaveBeenCalled();
                        expect(daoMock.find.mostRecentCall.args[1]).toEqual({sort: { 'createdAt': -1}, skip: 4, limit: 3});
                        expect(daoMock.find.mostRecentCall.args[0].tags).toEqual('test');
                        done();
                    });

                stub.flush();
            });

            it('should handler error properly', function (done) {
                var stub = when(daoMock, 'find').thenRejectWith({code: 2121});
                spyOn(daoMock, 'find').andCallThrough();
                request(app)
                    .get('/api/posts')
                    .expect(500, {message: messages.internalError})
                    .end(function (err) {
                        expect(err).toBeNull();
                        done();
                    });
                stub.flush();
            });

        });

        describe('PUT /api/posts/:postId', function () {

            it('should update the post', function (done) {
                var post = {
                    _id: 'new-post',
                    postTitle: 'new post',
                    postContent: 'post content'};

                var stub = when(daoMock, 'save').thenResolveWith(post);
                spyOn(daoMock, 'save').andCallThrough();
                request(app)
                    .put('/api/posts/new-post')
                    .send(post)
                    .expect(200)
                    .end(function (err, result) {
                        expect(err).toBeNull();
                        expect(daoMock.save.mostRecentCall.args[0]).toEqual(post);
                        done();
                    });
                stub.flush();
            });

            it('should return 404 when it can not find post', function (done) {
                var post = {
                    _id: 'new-post',
                    postTitle: 'new post',
                    postContent: 'post content'};

                var stub = when(daoMock, 'save').thenResolveWith(0);
                spyOn(daoMock, 'save').andCallThrough();
                request(app)
                    .put('/api/posts/new-post')
                    .send(post)
                    .expect('Content-Type', /json/)
                    .expect(404)
                    .end(function (err, result) {
                        expect(err).toBeNull();
                        expect(daoMock.save.mostRecentCall.args[0]).toEqual(post);
                        done();
                    });
                stub.flush();
            });

            it('should return 400 with bad request message', function (done) {
                request(app)
                    .put('/api/posts/my-post')
                    .send({postTitle: 'my-post'})
                    .expect('Content-Type', /json/)
                    .expect(400, {message: messages.badRequest})
                    .end(function (err, result) {
                        expect(err).toBeNull();
                        done();
                    });
            });

            it('should handler internal error', function (done) {
                var post = {
                    _id: 'new-post',
                    postTitle: 'new post',
                    postContent: 'post content'};
                var stub = when(daoMock, 'save').thenRejectWith({});
                spyOn(daoMock, 'save').andCallThrough();
                request(app)
                    .put('/api/posts/new-post')
                    .send(post)
                    .expect(500, {message: messages.internalError})
                    .end(function (err, result) {
                        expect(err).toBeNull();
                        expect(daoMock.save.mostRecentCall.args[0]).toEqual(post);
                        done();
                    });
                stub.flush();
            });


        });

        describe('DELETE /api/posts/:postId', function () {

            it('should return a 200', function (done) {

                var stub = when(daoMock, 'removeById').thenResolveWith(1);

                spyOn(daoMock, 'removeById').andCallThrough();

                request(app)
                    .del('/api/posts/my-post')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        expect(err).toBeNull();
                        expect(daoMock.removeById).toHaveBeenCalledWith('my-post');
                        done();
                    });
                stub.flush();
            });

            it('should return 404 with appropriate message', function (done) {
                var stub = when(daoMock, 'removeById').thenResolveWith(0);
                spyOn(daoMock, 'removeById').andCallThrough();
                request(app)
                    .del('/api/posts/whatever')
                    .expect('Content-Type', /json/)
                    .expect(404)
                    .end(function (err, res) {
                        expect(err).toBeNull();
                        expect(daoMock.removeById).toHaveBeenCalledWith('whatever');
                        done();
                    });
                stub.flush();
            });

            it('should handle internal server error', function (done) {
                var stub = when(daoMock, 'removeById').thenRejectWith({});

                spyOn(daoMock, 'removeById').andCallThrough();

                request(app)
                    .del('/api/posts/my-post')
                    .expect('Content-Type', /json/)
                    .expect(500, {message: messages.internalError})
                    .end(function (err, res) {
                        expect(err).toBeNull();
                        expect(daoMock.removeById).toHaveBeenCalledWith('my-post');
                        done();
                    });
                stub.flush();
            });


        });

        describe('GET /api/posts/tags/all', function () {


            it('should return the list of tags', function (done) {

                var tagList = ['foo', 'bar'];
                var stub = when(daoMock, 'tags').thenResolveWith(tagList);

                spyOn(daoMock, 'tags').andCallThrough();

                request(app)
                    .get('/api/posts/tags/all')
                    .expect('Content-Type', /json/)
                    .expect(200, tagList)
                    .end(function (err, res) {
                        expect(err).toBeNull();
                        expect(daoMock.tags).toHaveBeenCalled();
                        done();
                    });
                stub.flush();
            });

            it('should handle internal server errror', function (done) {
                var stub = when(daoMock, 'tags').thenRejectWith({});

                spyOn(daoMock, 'tags').andCallThrough();

                request(app)
                    .get('/api/posts/tags/all')
                    .expect('Content-Type', /json/)
                    .expect(500, {message: messages.internalError})
                    .end(function (err, res) {
                        expect(err).toBeNull();
                        expect(daoMock.tags).toHaveBeenCalled();
                        done();
                    });
                stub.flush();
            });

        });

    });
});
