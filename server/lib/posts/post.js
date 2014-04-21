var daoFactory = require('blog-it-dao');
var Promise = require('es6-promise').Promise;

function getPostDao(db) {

    var collectionName = 'posts';
    var service = daoFactory(db, collectionName);
    var standardAddNew = service.insert;
    var collection = db.collection(collectionName);

    function addNew(newPost) {
        newPost._id = newPost.postTitle.toLowerCase().trim().replace(/\s/g, '-');
        newPost.createdAt = new Date();
        return standardAddNew(newPost);
    }

    function tagList() {
        return new Promise(function (resolve, reject) {
            collection.distinct('tags', function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result)
                }
            });
        });
    }

    service.insert = addNew;
    service.tags = tagList;

    return service;
}

module.exports = getPostDao;