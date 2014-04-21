var express = require('express');
var json = require('body-parser').json;
var MongoClient = require('mongodb').MongoClient;
var posts = require('./lib/posts');
MongoClient.connect('mongodb://localhost:27017/test', function (err, db) {
    var app = express();

    app.use(json());

    posts(app, db);

    app.listen(3000, function () {
        console.log('listening on port ' + 3000);
    });
});

