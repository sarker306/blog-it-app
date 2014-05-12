var MongoClient = require('mongodb').MongoClient;
var crypto = require('crypto');
var config = require('../config.js');
var posts = require('../lib/posts/post.js');
var tagList = ['post', 'whatever', 'blah'];
var authors = ['Laurent', 'Renard', 'Bob'];
MongoClient.connect('mongodb://localhost:27017/' + config.server.dbName, function (err, db) {

    var Post = posts(db);
    var number = 20;
    var remaining = 20;
    var i;
    var r = function () {
        return Math.ceil(Math.random() * 3);
    };

    function guidGenerator() {
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }

    function createPost() {
        var post = {
            tags: []
        };
        var j = r();

        while (j > 0) {
            post.tags.push(tagList[Math.max(0, r() - 1)]);
            j--;
        }

        post.author = authors[r()];
        post.postContent = crypto.createHash('sha1').update('content' + (new Date()).getTime() + r()).digest('hex');
        post.postTitle = 'title ' + guidGenerator();
        return post;
    }

    if (err) {
        console.error('was not able to connect to db');
    }

    for (i = 0; i < number; i++) {


        Post.insert(createPost()).then(function () {
            remaining -= 1;
            if (remaining === 0) {
                console.log(number + ' post inserted successfully');
                db.close();
            }
        }, function (err) {
            console.error('error while inserting post: ' + err);
            db.close();
        });

    }

});

