var path = require('path');
/**
 * A read only configuration
 * @type {{port: number, staticFolderUrl: string, staticFolderMapping: string, cookieSecret: string, dbName: string}}
 */
exports.server = {
    port: 3000,
    staticFolderUrl: '/static',
    staticFolderMapping: path.resolve(__dirname, '../public/'),
    cookieSecret: 'a_big_secret',
    dbName: 'blog-it-dev'
};