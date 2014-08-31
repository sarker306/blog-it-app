var MongoClient = require('mongodb').MongoClient;
var crypto = require('crypto');
var config = require('../config.js');
var posts = require('../lib/posts/post.js');
var tagList = ['post', 'whatever', 'blah'];
var authors = ['Laurent', 'Renard', 'Bob'];
var imageUrl = 'http://u1.ipernity.com/42/15/73/32541573.c7aed9c5.500.jpg?r2';
var paragraphs = [
    'Phasellus elit quam, mollis molestie [ligula](#) eu, congue vestibulum nulla. Morbi faucibus enim a feugiat semper. Donec pharetra, erat et venenatis venenatis, odio sem pulvinar eros, id porta [nisl](#) arcu vitae ligula. Mauris ipsum justo, vehicula et erat eu, porttitor euismod magna. Nam vehicula consectetur nibh, vel rutrum dui commodo id. In hac habitasse platea dictumst. In bibendum pellentesque mi sit amet pretium. Nam orci turpis, tempus quis mi eleifend, varius tempus urna. Integer euismod ultricies dolor. Vivamus eu consequat erat. In nec magna metus.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales hendrerit sem, sit amet sagittis mauris eleifend quis. Sed ultricies fringilla felis nec rhoncus. Maecenas ac adipiscing orci, at laoreet ligula. Maecenas at lectus nisi. Morbi ullamcorper gravida elementum. Suspendisse potenti. Nulla suscipit in sem vel eleifend. Sed mollis, velit sit amet eleifend vehicula, neque elit malesuada ligula, sit amet eleifend metus ante nec diam. Mauris vestibulum lorem quis odio fermentum accumsan. Quisque sem ligula, ornare sit amet dapibus ut, tincidunt ac lorem. Cras odio libero, viverra eget hendrerit non, tincidunt ac augue. Suspendisse aliquet mollis erat sit amet aliquet.',
    'Sed augue ligula, pharetra vel fermentum sit amet, vehicula nec diam. Nullam vitae porttitor dolor. Nulla et varius nunc, ut fermentum mi. Donec aliquam elit ut enim gravida posuere. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec ultrices mauris vel varius vestibulum. Fusce vel justo in leo lobortis iaculis a fringilla sem.'];
MongoClient.connect(config.server.dbPath, function (err, db) {

    var Post = posts(db);
    var i = 0;
    var remaining = 20;
    var r = function () {
        return Math.ceil(Math.random() * 3);
    };

    function guidGenerator() {
        var s4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4());
    }

    function createPost() {
        var post = {
            tags: []
        };
        var j = r();
        var i = r();

        while (j > 0) {
            post.tags.push(tagList[Math.max(0, r() - 1)]);
            j--;
        }
        post.postContent = '## title level 2 \n';

        while (i > 0) {
            post.postContent += paragraphs[Math.max(0, r() - 1)] + '\n\n';
            post.postContent += '![sample picture](' + imageUrl + ') \n\n';
            i--;
        }

        post.author = authors[r()];
        post.postTitle = 'title ' + guidGenerator();
        return post;
    }

    if (err) {
        console.error('was not able to connect to db');
    }


    function insert() {
        return Post.insert(createPost())
            .then(function () {

                remaining--;
                if (remaining < 1) {
                    db.close();
                    console.log('posts successfully inserted');
                }

            }, function (err) {
                console.error('error while inserting post: ' + err);
                db.close();
            });
    }

    for (i = 0; i < 20; i++) {
        insert();
    }

});

