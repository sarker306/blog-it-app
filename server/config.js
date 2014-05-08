var path = require('path');

exports.server = {
    port: 3000,
    staticFolderUrl: '/static',
    staticFolderMapping: path.resolve(__dirname, '../public/'),
    cookieSecret: 'a_big_secret',
    dbName: 'blog-it-dev'
};