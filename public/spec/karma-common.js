module.exports = {
    files: [
        'lib/angular/angular.js',
        'lib/angular/angular-route.js',
        'lib/showdown/showdown.js',
        'spec/lib/**/*.js',
        'bower_components/**/*.js',
        'modules/**/module.js',
        'modules/**/*.js',
        'spec/test/*.js'
    ],
    frameworks: ['jasmine'],
    browsers: ['Chrome'],
    // coverage reporter generates the coverage
    reporters: ['progress', 'coverage'],

    port: 9876,

    preprocessors: {
        'modules/**/*.js': ['coverage']
    },
    coverageReporter: {
        type: 'html',
        dir: 'coverage/'
    }
};
