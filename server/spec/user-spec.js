var MongoClient = require('mongodb').MongoClient;
var userDao = require('../lib/user/user.js');
var bcrypt = require('bcrypt-nodejs');
var userAPI = require('../lib/user/userAPI.js');
var express = require('express');
var request = require('supertest');

describe('user module', function () {

    var dao;

    describe('user dao', function () {


        beforeEach(function (done) {
            MongoClient.connect('mongodb://127.0.0.1:27017/test', function (err, db) {
                if (err) throw err;

                db.dropCollection('users', function () {
                    dao = userDao(db);
                    done();
                });
            });
        });

        it('should insert new user salting and hashing password', function (done) {
            var email = 'bob@gexample.com';
            dao.insert(email, '1234').then(function () {
                dao.findById(email).then(function (result) {
                    expect(result).toBeDefined();
                    expect(result._id).toEqual(email);
                    expect(result.password).not.toEqual('1234');
                    expect(bcrypt.compareSync('1234', result.password)).toBe(true);
                    done();
                });
            }, function (err) {
                console.error(err);
            });

        });
    });

    describe('user api', function () {

        var app;
        var daoMock;

        describe('GET /api/me', function () {

            var defaultUser = {
                email: 'laurent34azerty@gmail.com',
                profile: 'admin'
            };

            it('should return an existing user', function (done) {
                app = express();
                app.all('*', function (req, res, next) {
                    req.user = defaultUser;
                    next();
                });
                userAPI(app, daoMock);
                request(app)
                    .get('/api/users/me')
                    .expect('Content-Type', /json/)
                    .expect(200, defaultUser)
                    .end(function (err, res) {
                        expect(err).toBeNull();
                        done();
                    });
            });

            it('should return a user with a "guest" profile', function (done) {
                app = express();
                userAPI(app, daoMock);
                request(app)
                    .get('/api/users/me')
                    .expect('Content-Type', /json/)
                    .expect(200, {profile: 'guest'})
                    .end(function (err, res) {
                        expect(err).toBeNull();
                        done();
                    });
            });
        });
    });
});
