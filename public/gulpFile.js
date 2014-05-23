var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var fs = require('fs');
var karma = require('karma').server;
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var stylish = require('jshint-stylish');

var modulesFiles = ['./app.js', './modules/**/module.js', './modules/**/*.js'];

//modules
gulp.task('modules', function () {
    gulp.src(modulesFiles)
        .pipe(concat('modules.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('../dist/js'));
});

gulp.task('lint', function () {
    gulp.src(modulesFiles)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

//bower components
gulp.task('components', function () {
    gulp.src(['./bower_components/**/*.js', '!./bower_components/**/*.min.js'])
        .pipe(concat('components.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('../dist/js'));
});

//lib
gulp.task('lib', function () {

    //Angular
    gulp.src(['./lib/angular/angular.min.js',
        './lib/angular/angular-route.min.js',
        './lib/angular/angular-animate.min.js',
        './lib/angular/angular-sanitize.min.js'])
        .pipe(concat('angular.min.js'))
        .pipe(gulp.dest('../dist/lib/angular'));

    //highlight.js
    gulp.src(['./lib/highlight/highlight.pack.js', './lib/highlight/styles/default.css'])
        .pipe(gulp.dest('../dist/lib/highlight'));

    //showdown
    gulp.src(['./lib/showdown/showdown.min.js'])
        .pipe(gulp.dest('../dist/lib/showdown'));
});

//theme
gulp.task('theme', function () {
});

//index
gulp.task('index', function () {

});

//test
gulp.task('karma-CI', function (done) {
    var conf = require('./spec/karma-common.js');
    conf.singleRun = true;
    conf.browsers = ['PhantomJS'];
    conf.basePath = './';
    console.log(conf);
    karma.start(conf, done);
});

gulp.task('build', ['karma-CI', 'modules', 'lib', 'components', 'theme', 'index']);

