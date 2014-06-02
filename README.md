[![Build Status](https://travis-ci.org/blog-it/blog-it-app.svg?branch=master)](https://travis-ci.org/blog-it/blog-it-app)

# blog-it-app

A blog engine/CMS built with a full Javascript stack: [Angularjs](https://angularjs.org/), [Node.js](http://nodejs.org/) and [Mongodb](http://www.mongodb.org/).
It focuses on semantic content rather than WYSIWYG. Server is more a web service which provides these semantic representations (REST Like). Almost no rendering is done on the server side.

For more information, refer to [documentation website](http://blog-it.nodejitsu.com)

## build and test

* fork this repository, run `npm install` then `npm start` and you application should run on port 8000
* to run the test, `npm test`
* build production optimized assets, `gulp build` then edit the config.js file under the server folder to target the dist folder