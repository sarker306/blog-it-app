var path = require('path');
/**
 * A read only configuration
 * @type {{port: number, staticFolderUrl: string, staticFolderMapping: string, cookieSecret: string, dbName: string}}
 */
exports.server = {
    port: 8000,
    staticFolderUrl: '/static',
    staticFolderMapping: path.resolve(__dirname, '../dist/'),
    cookieSecret: 'a_big_secret',
    dbPath: 'mongodb://localhost:27017/blog-it-dev'
};