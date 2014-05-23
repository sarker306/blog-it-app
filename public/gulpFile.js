var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var fs = require('fs');
var karma = require('karma').server;
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var stylish = require('jshint-stylish');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var minifyCss = require('gulp-minify-css');
var html2js = require('gulp-ng-html2js');
var minifyHtml = require('gulp-minify-html');

var modulesFiles = ['./app.js', './modules/**/module.js', './modules/**/*.js'];

//modules
gulp.task('modules', function () {
    gulp.src(modulesFiles)
        .pipe(concat('modules.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('../dist/js'));
});

gulp.task('templates', function () {
    gulp.src(['./modules/**/*.html', './themes/default/view/**.html'])
        .pipe(minifyHtml())
        .pipe(html2js(
            {
                moduleName: 'blog-it.partials',
                rename: function (url) {
                    var prepend = '/static/';

                    if (url.indexOf('/') !== -1) {
                        //internal partial
                        prepend += 'modules/';
                    } else {
                        //view
                        prepend += 'themes/default/view/';
                    }

                    return prepend + url;
                }
            }
        ))
        .pipe(concat('partials.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('../dist/js'));
});

//just as indication
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
    //Angular
    gulp.src(['./lib/angular/*'])
        .pipe(gulp.dest('../dist/lib/angular'));

    //highlight.js
    gulp.src(['./lib/highlight/highlight.pack.js', './lib/highlight/styles/default.css'])
        .pipe(gulp.dest('../dist/lib/highlight'));

    //showdown
    gulp.src(['./lib/showdown/showdown.min.js'])
        .pipe(gulp.dest('../dist/lib/showdown'));
});

//theme

//sass
gulp.task('sass', function () {
    gulp.src(['./themes/default/theme.scss'])
        .pipe(sass())
        .pipe(minifyCss())
        .pipe(gulp.dest('../dist/themes/default'));
});

gulp.task('theme', ['sass'], function () {
    gulp.src(['./themes/default/view/**.html'])
        .pipe(gulp.dest('../dist/themes/default/view'));

    gulp.src(['./themes/default/fonts/**'])
        .pipe(gulp.dest('../dist/themes/default/fonts'));
});

//index
gulp.task('index', function () {
    gulp.src(['./index.html'])
        .pipe(useref())
        .pipe(gulp.dest('../dist'));
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

gulp.task('build', ['karma-CI', 'modules', 'templates', 'lib', 'components', 'theme', 'index']);

