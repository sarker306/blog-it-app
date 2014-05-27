var daoFactory = require('blog-it-dao');
var Promise = require('es6-promise').Promise;

/**
 * Create a service to access the posts collection.
 * Return a service with the following interface
 * return {
        findOne: {promise},
        findById: {promise},
        find: {promise},
        insert: {promise},
        remove: {promise},
        removeById: {promise},
        save: {promise},
        update: {promise},
        updateById: {promise},
        tags: {promise}
    };
 * see <a href="https://www.npmjs.org/package/blog-it-dao">blog-it-dao</a> for more information
 * @param db a connected db
 * @returns {*}
 */
function getPostDao(db) {

    var collectionName = 'posts';
    var service = daoFactory(db, collectionName);
    var standardAddNew = service.insert;
    var collection = db.collection(collectionName);

    function addNew(newPost) {
        newPost._id = newPost.postTitle.toLowerCase().trim().replace(/\s/g, '-');
        newPost.createdAt = Date.now();
        return standardAddNew(newPost);
    }

    function tagList() {
        return new Promise(function (resolve, reject) {
            collection.distinct('tags', function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    service.insert = addNew;
    service.tags = tagList;

    return service;
}

module.exports = getPostDao;