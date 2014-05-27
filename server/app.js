/**
 * This is the application entry point where the different modules are loaded, the db is connected and the web server is created
 */


var express = require('express');
var config = require('./config.js');
var MongoClient = require('mongodb').MongoClient;
var userDAO = require('./lib/user/user.js');
var user = require('./lib/user');
var security = require('./lib/security');
var post = require('./lib/posts');
var DBStrategy = require('./lib/security/DBStrategy');
var compress = require('compression');
var json = require('body-parser').json;
var serveStatic = require('serve-static');
var session = require('express-session');
var MongoStore = require('connect-mongostore')(session);
var cookieParser = require('cookie-parser');
var app = express();


MongoClient.connect('mongodb://localhost:27017/' + config.server.dbName, function (err, db) {

    var userDao = userDAO(db);
    var dbStrategy = new DBStrategy(userDao);

    //static files
    //compress static
    app.use(config.server.staticFolderUrl, compress());
    //map to 'public' directory
    app.use(config.server.staticFolderUrl, serveStatic(config.server.staticFolderMapping));
    //file was not found
    app.use(config.server.staticFolderUrl, function (req, res) {
        res.send(404);
    });

    app.use(compress());
    app.use(json());
    app.use(cookieParser());
    //handle session with mongo store
    app.use(session({
        secret: config.server.cookieSecret,
        store: new MongoStore({
            db: db
        })
    }));


    //initialize authentication layer (passport)
    security.initialize(userDao, app, [dbStrategy]);

    //routes related to users
    user(app, db);

    //routes related to the blog
    post(app, db);

    //fallback to index html (support html5 mode)
    app.get('/*', function (req, res) {
        res.sendfile('index.html', {root: config.server.staticFolderMapping});
    });

    app.listen(config.server.port, function () {
        console.log('listening on port ' + config.server.port);
    });
});